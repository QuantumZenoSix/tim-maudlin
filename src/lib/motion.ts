// Scroll-linked "assembly" choreography: each section's pieces start scattered (offset, scaled,
// faded) and fall into place as the section reaches the top of the screen, then drift away as it
// leaves. The desktop values reproduce the original Vue site (see site_overview.gif).
//
// Sections describe their choreography as a list of steps. Targets are `data-motion` names looked
// up inside the section only, so one section's steps can never move another section's elements.
import type { Attachment } from 'svelte/attachments';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Reduced-motion matches neither query, so those visitors get the static layout.
const DESKTOP = '(min-width: 992px) and (prefers-reduced-motion: no-preference)';
const PHONE = '(max-width: 991.98px) and (prefers-reduced-motion: no-preference)';
const REDUCED = '(prefers-reduced-motion: reduce)';

/**
 * Scroll to a section the way the original nav links did: 1.3 s with jQuery's default "swing"
 * easing (the same curve as sine.inOut). The choreography was tuned to play at this speed; the
 * browser's native smooth scroll is about three times faster. Scrolling by hand cancels it, and
 * `onArrive` only runs if it wasn't cancelled.
 */
export function scrollToSection(id: string, onArrive?: () => void) {
	const target = document.getElementById(id);
	if (!target) throw new Error(`scrollToSection: no element with id "${id}"`);
	gsap.to(window, {
		scrollTo: { y: target, autoKill: true },
		duration: window.matchMedia(REDUCED).matches ? 0 : 1.3,
		ease: 'sine.inOut',
		overwrite: true,
		onComplete: onArrive
	});
}

export interface Step {
	/** `data-motion` name of the element(s) to animate. */
	target: string;
	/**
	 * What scroll position drives the step: the section (default), another `data-motion` element
	 * inside it, or 'self' to give every matched element its own trigger.
	 */
	trigger?: string;
	/** ScrollTrigger start and end, e.g. ['top bottom', 'top top']. */
	range: [start: string, end: string];
	/** Animate from these values to the element's resting state... */
	from?: gsap.TweenVars;
	/** ...or from the resting state to these values. */
	to?: gsap.TweenVars;
}

export interface Choreography {
	desktop: Step[];
	phone: Step[];
}

function find(root: HTMLElement, name: string): HTMLElement[] {
	return Array.from(root.querySelectorAll<HTMLElement>(`[data-motion="${name}"]`));
}

/**
 * The resting value of every property a `to` step animates, read before any step runs. A `to`
 * tween would otherwise take its starting values from the element as it first renders, and if an
 * earlier `from` step animates the same property, that is the `from` step's scattered state: the
 * Articles panel used to vanish the moment it started leaving, because it "faded" from opacity 0.
 */
function restingValues(root: HTMLElement, steps: Step[]) {
	const rest = new Map<Element, Record<string, number | string>>();
	for (const step of steps) {
		if (!step.to) continue;
		for (const el of find(root, step.target)) {
			const values = rest.get(el) ?? {};
			for (const prop of Object.keys(step.to)) values[prop] ??= gsap.getProperty(el, prop);
			rest.set(el, values);
		}
	}
	return rest;
}

function play(root: HTMLElement, steps: Step[]) {
	const rest = restingValues(root, steps);
	for (const step of steps) {
		const targets = find(root, step.target);
		if (targets.length === 0) {
			// A renamed or removed element would otherwise silently drop part of the effect.
			if (import.meta.env.DEV) console.warn(`motion: no [data-motion="${step.target}"] in`, root);
			continue;
		}

		const groups =
			step.trigger === 'self'
				? targets.map((target) => ({ targets: [target], trigger: target }))
				: [
						{
							targets,
							trigger: step.trigger ? (find(root, step.trigger)[0] ?? root) : root
						}
					];

		for (const group of groups) {
			const scrollTrigger = {
				trigger: group.trigger,
				start: step.range[0],
				end: step.range[1],
				scrub: true
			};
			// GSAP's default ease (power1.out) is kept on purpose: the original tweens used it, and
			// it sets how pieces decelerate as they settle.
			if (step.from) gsap.from(group.targets, { ...step.from, scrollTrigger });
			if (step.to) {
				const from = Object.fromEntries(
					Object.keys(step.to).map((prop) => [
						prop,
						(_: number, el: Element) => rest.get(el)?.[prop]
					])
				);
				// Not rendered until its range starts, so it doesn't override an earlier `from` step.
				gsap.fromTo(group.targets, from, { ...step.to, immediateRender: false, scrollTrigger });
			}
		}
	}
}

let setUp = false;

/** Page-wide ScrollTrigger behaviour, set up the first time a section attaches. */
function setUpOnce() {
	if (setUp) return;
	setUp = true;
	keepScrollOnBreakpointChange();
	refreshWhenPageHeightChanges();
}

/**
 * ScrollTrigger scrolls to the top while it measures, then restores the position. But crossing the
 * desktop/phone breakpoint replaces every trigger, and each new one clears the position it saved
 * (GSAP 3.15), so the page would be left at the top: a visitor rotating a tablet would lose their
 * place. Remember the position ourselves and put it back if needed.
 */
function keepScrollOnBreakpointChange() {
	let y = 0;
	ScrollTrigger.addEventListener('refreshInit', () => (y = window.scrollY));
	ScrollTrigger.addEventListener('refresh', () => {
		if (Math.round(window.scrollY) === Math.round(y)) return;
		window.scrollTo({ top: y, behavior: 'instant' });
		ScrollTrigger.update();
	});
}

/**
 * Scroll ranges are measured in page pixels once, so when content changes height (an accordion
 * panel opening, a longer book description), every section below would animate in the wrong place:
 * on phones, Media had already landed before it came into view. Re-measure once the height settles.
 */
function refreshWhenPageHeightChanges() {
	let height = document.documentElement.scrollHeight;
	let timer: ReturnType<typeof setTimeout> | undefined;
	new ResizeObserver(() => {
		const current = document.documentElement.scrollHeight;
		if (current === height) return;
		height = current;
		clearTimeout(timer);
		timer = setTimeout(() => ScrollTrigger.refresh(), 100);
	}).observe(document.body);
}

/**
 * Attach to a section's root element. Steps are created in order (later steps may build on
 * earlier ones), and everything is reverted when the breakpoint changes or the section unmounts.
 */
export function choreograph(choreography: Choreography): Attachment<HTMLElement> {
	return (root) => {
		setUpOnce();
		const media = gsap.matchMedia();
		media.add(DESKTOP, () => play(root, choreography.desktop));
		media.add(PHONE, () => play(root, choreography.phone));
		return () => media.revert();
	};
}

/**
 * The phone version of the assembly: every block slides and scales into place as it scrolls into
 * view, over short distances so nothing overlaps once it has landed.
 *
 * Ranges are wrapped in clamp() so blocks near the end of the page still finish landing: a phone
 * can't scroll the last section's content up to 55% of the screen.
 */
export function phoneAssembly(extra: Step[] = []): Step[] {
	const clamped = (step: Step): Step => ({
		...step,
		range: [`clamp(${step.range[0]})`, `clamp(${step.range[1]})`]
	});
	const steps: Step[] = [
		{
			target: 'title-card',
			trigger: 'self',
			range: ['top 95%', 'top 60%'],
			from: { yPercent: -60, opacity: 0 }
		},
		{
			target: 'title-block',
			trigger: 'self',
			range: ['top 95%', 'top 65%'],
			from: { y: -24, opacity: 0.4 }
		},
		{
			target: 'content',
			trigger: 'self',
			range: ['top 95%', 'top 55%'],
			from: { y: 80, scale: 0.92, opacity: 0 }
		},
		...extra
	];
	return steps.map(clamped);
}
