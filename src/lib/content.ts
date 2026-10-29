// All site copy and media in one place. Sections render from this; edit text here.
import philosophyOfPhysics2Cover from '#lib/assets/img/pubs/Philosophy-of-Physics-02-cropped.jpg';
import physicalGeometryCover from '#lib/assets/img/pubs/New-foudations-for-physical-geometry-cropped.jpg';
import philosophyOfPhysics1Cover from '#lib/assets/img/pubs/Philosophy-of-Physics-01-cropped.jpg';
import metaphysicsCover from '#lib/assets/img/pubs/Metaphysics-within-physics-cropped.jpg';
import truthAndParadoxCover from '#lib/assets/img/pubs/truth-and-paradox-cropped.jpg';
import quantumCover from '#lib/assets/img/pubs/quantum-cropped.jpg';
import thinkerImage from '#lib/assets/img/thinker.jpg';
import physicsImage from '#lib/assets/img/physics.jpg';
import logicImage from '#lib/assets/img/logic.jpg';

export interface NavItem {
	/** Element id of the section, also used in old links (kept for compatibility). */
	id: string;
	label: string;
	numeral: string;
}

export const navItems: NavItem[] = [
	{ id: 'home-link', label: 'Home', numeral: 'I.' },
	{ id: 'about-tim-link', label: 'About Tim', numeral: 'II.' },
	{ id: 'publications-I-link', label: 'Publications I', numeral: 'III.' },
	{ id: 'publications-II-link', label: 'Publications II', numeral: 'IV.' },
	{ id: 'media-link', label: 'Media', numeral: 'V.' },
	{ id: 'contact-link', label: 'Contact', numeral: 'VI.' }
];

/** A line pair on a section's title card, e.g. "Professor of Philosophy" / "New York University". */
export interface TitleBlock {
	primary: string;
	secondary?: string;
}

export const roles: TitleBlock[] = [
	{
		primary: 'Founder and Director',
		secondary: 'John Bell Institute for the Foundations of Physics'
	},
	{ primary: 'Professor of Philosophy', secondary: 'New York University' }
];

export interface InfoItem {
	text: string;
	href?: string;
	note?: string;
}

export const profile = {
	bio: `Tim Maudlin has interests primarily focused in the foundations of physics, metaphysics, and logic. His books include Quantum Non-Locality and Relativity (Blackwell, 3rd edition now available), Truth and Paradox (Oxford), The Metaphysics Within Physics (Oxford) and two volumes of 'Philosophy of Physics'. He is a member of the Academie Internationale de Philosophie des Sciences and the Foundational Questions Institute (FQXi). He has been a Guggenheim Fellow. He taught at Rutgers from 1986 to 2011, and has been a visiting professor at Harvard.`,
	education: [
		{ text: 'Ph.D. Pittsburgh, History and Philosophy of Science' },
		{ text: 'B.A. Yale, Physics and Philosophy' }
	] satisfies InfoItem[],
	memberships: [
		{
			text: 'John Bell Institute for the Foundations of Physics',
			href: 'https://www.johnbellinstitute.org/',
			note: '(Founder and Director)'
		},
		{
			text: 'American Academy of Arts and Sciences',
			href: 'https://www.amacad.org/person/tim-we-maudlin'
		},
		{ text: 'The Academie Internationale de Philosophie des Sciences' },
		{ text: 'Foundational Questions Institute (FQXi)' }
	] satisfies InfoItem[],
	awards: [
		{ text: 'Fellow of the American Council of Learned Societies, 2015' },
		{ text: 'American Academy of Arts and Sciences, 2015' },
		{
			text: 'Guggenheim Fellow, 2008',
			href: 'https://www.gf.org/fellows/all-fellows/tim-maudlin/'
		}
	] satisfies InfoItem[],
	interests: [
		{ label: 'Philosophy', image: thinkerImage, alt: 'The Thinker, Philosophy' },
		{ label: 'Foundations of Physics', image: physicsImage, alt: 'Physics, the Cosmos' },
		{ label: 'Logic', image: logicImage, alt: "Logic, Rubik's cube" }
	]
};

export interface Book {
	title: string;
	year: string;
	publisher: string;
	cover: string;
	description: string[];
	link: string;
}

export const books: Book[] = [
	{
		title: 'Philosophy of Physics, Volume 2: Quantum Theory',
		year: '2019',
		publisher: 'Princeton University Press',
		cover: philosophyOfPhysics2Cover,
		description: [
			'In this book, Tim Maudlin, one of the world’s leading philosophers of physics, offers a sophisticated, original introduction to the philosophy of quantum mechanics. The briefest, clearest, and most refined account of his influential approach to the subject, the book will be invaluable to all students of philosophy and physics.',
			'Quantum mechanics holds a unique place in the history of physics. It has produced the most accurate predictions of any scientific theory, but, more astonishing, there has never been any agreement about what the theory implies about physical reality. Maudlin argues that the very term “quantum theory” is a misnomer. A proper physical theory should clearly describe what is there and what it does—yet standard textbooks present quantum mechanics as a predictive recipe in search of a physical theory.',
			'In contrast, Maudlin explores three proper theories that recover the quantum predictions: the indeterministic wavefunction collapse theory of Ghirardi, Rimini, and Weber; the deterministic particle theory of deBroglie and Bohm; and the conceptually challenging Many Worlds theory of Everett. Each offers a radically different proposal for the nature of physical reality, but Maudlin shows that none of them are what they are generally taken to be.'
		],
		link: 'https://press.princeton.edu/books/hardcover/9780691183527/philosophy-of-physics'
	},
	{
		title: 'New Foundations for Physical Geometry',
		year: '2014',
		publisher: 'Oxford University Press',
		cover: physicalGeometryCover,
		description: [
			'Topology is the mathematical study of the most basic geometrical structure of a space. Mathematical physics uses topological spaces as the formal means for describing physical space and time. This book proposes a completely new mathematical structure for describing geometrical notions such as continuity, connectedness, boundaries of sets, and so on, in order to provide a better mathematical tool for understanding space-time. This is the initial volume in a two-volume set, the first of which develops the mathematical structure and the second of which applies it to classical and Relativistic physics.'
		],
		link: 'https://global.oup.com/academic/product/new-foundations-for-physical-geometry-9780198701309'
	},
	{
		title: 'Philosophy of Physics, Volume 1: Space and Time',
		year: '2012',
		publisher: 'Princeton University Press',
		cover: philosophyOfPhysics1Cover,
		description: [
			'This concise book introduces nonphysicists to the core philosophical issues surrounding the nature and structure of space and time, and is also an ideal resource for physicists interested in the conceptual foundations of space-time theory. Tim Maudlin’s broad historical overview examines Aristotelian and Newtonian accounts of space and time, and traces how Galileo’s conceptions of relativity and space-time led to Einstein’s special and general theories of relativity. Maudlin explains special relativity with enough detail to solve concrete physical problems while presenting general relativity in more qualitative terms. Additional topics include the Twins Paradox, the physical aspects of the Lorentz-FitzGerald contraction, the constancy of the speed of light, time travel, the direction of time, and more.'
		],
		link: 'https://press.princeton.edu/books/paperback/9780691165714/philosophy-of-physics'
	},
	{
		title: 'The Metaphysics Within Physics',
		year: '2007',
		publisher: 'Oxford University Press',
		cover: metaphysicsCover,
		description: [
			'What fundamental account of the world is implicit in physical theory? Physics straightforwardly postulates quarks and electrons, but what of the more intangible elements, such as laws of nature, universals, causation and the direction of time? Do they have a place in the physical structure of the world?',
			'Tim Maudlin argues that the ontology derived from physics takes a form quite different from those most commonly defended by philosophers. Physics postulates irreducible fundamental laws, eschews universals, does not require a fundamental notion of causation, and makes room for the passage of time. In a series of linked essays The Metaphysics Within Physics outlines an approach to metaphysics opposed to the Humean reductionism that motivates much analytical metaphysics.'
		],
		link: 'https://global.oup.com/academic/product/the-metaphysics-within-physics-9780199575374'
	},
	{
		title: 'Truth and Paradox: Solving the Riddles',
		year: '2004',
		publisher: 'Oxford University Press',
		cover: truthAndParadoxCover,
		description: [
			"Consider the sentence 'This sentence is not true'. It seems that the sentence can be neither true nor not true, on pain of contradiction. Tim Maudlin sets out a novel account of logic and semantics which allows him to deal with certain notorious paradoxes which have bedevilled philosophical theories of truth. All philosophers interested in logic and language will find Truth and Paradox a stimulating read."
		],
		link: 'https://global.oup.com/academic/product/truth-and-paradox-9780199203918'
	},
	{
		title: 'Quantum Non-Locality and Relativity: Metaphysical Intimations of Modern Physics',
		year: '1994',
		publisher: 'Oxford: Basil Blackwell',
		cover: quantumCover,
		description: [
			'The third edition of Quantum Non-Locality and Relativity has been carefully updated to reflect significant developments, including a new chapter covering important recent work in the foundations of physics.',
			'The third edition includes a premier philosophical study of Bell’s Theorem and its implication for the relativistic account of space and time as well as the "Free Will Theorem" of John Conway and Simon Kochen.',
			'Also included is a discussion of Roderich Tumulka’s explicit, relativistic theory that can reproduce the quantum mechanical violation of Bell’s inequality.',
			'This book introduces philosophers to the relevant physics and demonstrates how philosophical analysis can help inform physics.'
		],
		link: 'https://onlinelibrary.wiley.com/doi/book/10.1002/9781444396973'
	}
];

export const featuredReads = [
	{
		source: 'Scientific American',
		title: 'Philosophy Has Made Plenty of Progress',
		link: 'https://blogs.scientificamerican.com/cross-check/philosophy-has-made-plenty-of-progress/'
	},
	{
		source: 'Quanta Magazine',
		title: 'A Defense of the Reality of Time',
		link: 'https://www.quantamagazine.org/a-defense-of-the-reality-of-time-20170516/'
	},
	{
		source: 'The Atlantic',
		title: 'What Happened Before the Big Bang?',
		link: 'https://www.theatlantic.com/technology/archive/2012/01/what-happened-before-the-big-bang-the-new-philosophy-of-cosmology/251608/'
	}
];

export const publicationProfiles = [
	{ source: 'PhilPeople', link: 'https://philpeople.org/profiles/tim-maudlin' },
	{ source: 'Academia.edu', link: 'http://nyu.academia.edu/TimMaudlin' },
	{ source: 'NYU', link: 'https://as.nyu.edu/faculty/tim-maudlin' }
];

export interface Video {
	/** YouTube video id */
	id: string;
	title: string;
}

// The first video is shown in the main player when the page loads.
export const videos: Video[] = [
	{
		id: 'KXriGVf00mk',
		title: 'Does time pass? | Julian Barbour, Tim Maudlin, Emily Thomas'
	},
	{ id: 'hC3ckLqsL5M', title: 'The Problem With Quantum Theory | Tim Maudlin' },
	{ id: '-TXVhxm5oAU', title: 'Philosophy in Quantum Theory | Tim Maudlin' },
	{ id: 'JS75WK4cHz8', title: 'Tim Maudlin - Multiverse - Where Do We Go From Here? (Part 2)' },
	{
		id: 'VbXEc9vpeIM',
		title: 'What We’ve Gotten Wrong About Quantum Physics | World Science Festival'
	}
];

// The address the Contact button opens in the visitor's mail app. It is public.
export const contactEmail = 'twm3@nyu.edu';

export const credit = {
	text: 'Tim Maudlin 2020 || Website Design and Development by',
	name: 'Bobby Valenzuela',
	href: 'mailto:bobbyv231@gmail.com'
};
