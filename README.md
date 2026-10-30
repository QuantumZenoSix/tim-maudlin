## Project Description:

This website was built for Tim Maudlin, a Professor of Philosophy from NYU and it serves as a introduction to him and his work. I reached out to Tim because I'm an admirer of his work and offered a pro bono site for him. The site was completely designed and developed by me without the use of any templates or mockups.

https://quantumzenosix.github.io/tim-maudlin/dist/

## Technologies used:

### General

-HTML5
-CSS3/SCSS
-Javascript (ES5/ES6)

### Specific

- Vue JS 3.0 : The website itself was built on the Vue 3.0 JS framework using the Vue CLI and is fully mobile responsive. 
- Materialize CSS : I used materialize for the responsive grid system, and to handle small components (cards, tooltips, etc).
 - Google Material icons : Used icons throughout the site.
 - Flexbox : Used for each section to center elements and keep site mobile-responsive.
 - CSS Grid : Used on media section to layout videos.
 - SCSS : Styling written is SCSS.
 - Greensock Gsap : Used Gsap for animation using the ScrollTrigger plugin.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Svelte Rewrite

It was a pain to get the scrolling right when I first did this with Vue js 6 years ago.
Used Claude to rewrite this in Svelte which you'll find on this [branch](https://github.com/QuantumZenoSix/tim-maudlin/tree/sveltekit).
Claude had trouble understanding my visions with the scrolling that I had in the original version but I eventually got it going.
May merge the Svelte version into the main branch but leaving it in it's own branch for now.
