import { ngrams, GRAMSIZE } from '../script.js';

// create an array of ngrams within string
// e.g. otter -> ot/tt/te/er and banana -> ba/an/na
function explode(text, n = 2) {
  text = text.toLowerCase();
  const results = [];
  for (let i = 0; i < text.length - n + 1; i++) {
    const candidate = text.slice(i, i + n);
    if (!results.includes(candidate)) {
      results.push(candidate);
    }
  }
  return results;
}

export function generateNGramIndex(links, n = 2) {
  const index = {};
  for (const link of links) {
    const grams = explode(link.text + ' ' + link.type + ' ' + link.keywords, n);
    for (const ngram of grams) {
      if (!index[ngram]) {
        index[ngram] = [];
      }
      if (!index[ngram].includes(link.href)) {
        index[ngram].push(link.href);
      }
    }
  }
  return index;
}

export function score(text) {
  const resettable = document.querySelectorAll('main [data-score]');
  // const resettable = document.querySelectorAll('main>*');
  resettable.forEach(r => { r.dataset.score = 0; });

  // get ngrams for input
  const grams = explode(text, GRAMSIZE);

  // score urls by matching ngrams
  const scores = {};
  for (const gram of grams) {
    const urls = ngrams[gram];
    if (urls) {
      for (const url of urls) {
        const result = scores[url] || 0;
        scores[url] = result + 1;
      }
    }
  }

  // find urls in page and apply scores
  Object.keys(scores).forEach((url) => {
    const e = document.querySelector(`main a[href="${url}"]`);
    if (e) {
      e.parentElement.dataset.score = scores[url];
    } else {
      // new
      const e = document.querySelector('.theurlthingthatactuallymatters');
      console.log(e);
      e.parentElement.dataset.score = scores[url];
    }
  });

  // new links not searchable
  if (text.length < GRAMSIZE) {
    const hideable = document.querySelectorAll('main [data-score]');
    hideable.forEach(r => { r.dataset.matched = true; });
    sortBy('order');
  } else {
    // hide non-matches if there was some input
    const hide = document.querySelectorAll('main [data-score="0"]');
    const show = document.querySelectorAll('main :not([data-score="0"])');
    console.log(show);
    hide.forEach(r => { r.dataset.matched = false; });
    show.forEach(r => { r.dataset.matched = true; });
    // sort by highest score (hide zeroes)
    sortBy('score');
  }
}

export function sortBy(what = 'score') {
  const main = document.querySelector('main');
  if (!main) return;

  const nodes = Array.from(main.children);

  // sort from highest value to smallest
  nodes.sort((x, y) => y.dataset[what] - x.dataset[what]);
  nodes.forEach(n => main.appendChild(n));
}
