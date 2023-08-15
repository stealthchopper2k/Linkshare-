import { uiAddLinks } from './js/ui.js';
import { uiUtilityBar } from './js/utility/utilityBar.js';
import { getDataFileUrl, nudgeDataFile, rememberDataFile } from './js/data.js';
import { sortBy, score, generateNGramIndex } from './js/ordering.js';
import { initAuthUi } from './js/auth/authUi.js';
import {
  signedInRequest,
  signedOutRequest,
  initiateNewLinkPage,
} from './js/auth/fileReqs.js';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './js/auth/google.js';
import './style/master.css';

export let ngrams;
// https://stackoverflow.com/questions/53723251/javascript-modifing-an-imported-variable-causes-assignment-to-constant-varia
export function changeNgrams(value) {
  ngrams = value;
}
export const GRAMSIZE = 3;

// if (navigator.serviceWorker) {
//   // eslint-disable-next-line no-inner-declarations
//   async function registerServiceWorker() {
//     try {
//       await navigator.serviceWorker.register('./sw.js');
//     } catch (e) {
//       console.error("Service Worker failed.  Falling back to 'online only'.", e);
//     }
//   }
//   window.addEventListener('load', registerServiceWorker);
// }

function reportError(msg) {
  const main = document.createElement('main');
  document.body.textContent = '';
  document.body.appendChild(main);
  main.textContent = msg;
  main.classList.add('error');
}

/* When enter is pressed on the filter the first element
 * in the list should be opened.  Otherwise (when enter
 * is pressed on any other highlighted element) the
 * default event bahaviour can occur.
 */
function openFirstLinkIfAppropriate(elem) {
  if (elem === document.querySelector('#filter')) {
    document.querySelector('[data-score] a').click();
  }
}

export function updateContent(resetFilter = true) {
  const filterEl = document.querySelector('#filter');
  if (resetFilter) {
    filterEl.value = '';
  } else {
    score(filterEl.value.toLowerCase());
  }
  sortBy(filterEl.value.length > 0 ? 'score' : 'order');
}

function setupEventListeners() {
  /*
   * Monitor keypresses and update datasets so (based on CSS)
   * content can be made invisible.
   */
  window.addEventListener('keyup', (k) => {
    const filter = document.querySelector('#filter');
    const focus = document.querySelector(':focus');

    if (k.target === filter && k.code === 'Enter') {
      return openFirstLinkIfAppropriate(k.target);
    }
    if (k.code === 'Escape') return updateContent(true);
    if (k.code === 'Tab') return;

    if (k.ctrlKey) {
      if (k.code === 'Period') return nudgeDataFile(+1);
      if (k.code === 'Comma') return nudgeDataFile(-1);
    }

    // ensure that any typing that happens when the
    // text area doesn't have focus gets caught and
    // added to the text area.
    // also if anything else doesnt have focus (for editing purposes)
    if (
      focus === null &&
      k.key.length === 1 &&
      !k.altKey &&
      !k.metaKey &&
      !k.ctrlKey
    ) {
      filter.focus();
      if (k.key.length === 1) filter.value += k.key;
    }
  });

  document.querySelector('#filter').addEventListener('input', () => {
    updateContent(false);
  });
}

function makeLinkPage(cloudData) {
  try {
    const links = cloudData.file.links;

    document.title = `WebLinks: ${cloudData.file.title}`;
    document.querySelector('#title').textContent = cloudData.file.title;

    ngrams = generateNGramIndex(links, GRAMSIZE);

    uiAddLinks(links);
    uiUtilityBar(cloudData, 'linkpage');
  } catch (e) {
    console.log(`${e}, error with gettting cloudData with onAuthStateChange`);
  }
}

async function handleNewPage(token) {
  // get query of index to file
  const queryString = window.location.hash.split('?')[1];
  const urlParams = new URLSearchParams(queryString);

  const index = urlParams.get('index');

  // send index to server to create new file and upload to bucket
  const cloudData = await initiateNewLinkPage(token, index);

  // set window location to current page
  window.location.hash = cloudData.newName;
  makeLinkPage(cloudData);
}

// happens on load
// TODO reauthenticate user redirect

onAuthStateChanged(auth, async (user) => {
  const objectId = window.location.hash.substring(1);

  if (objectId.includes('newFile')) {
    if (!user) window.location.href = '/login';
    const token = await user.getIdToken();
    handleNewPage(token);
    return;
  }

  let cloudData;

  if (objectId && user) {
    const token = await user.getIdToken(); // fresh firebase token automatically refreshed
    initAuthUi(user);
    cloudData = await signedInRequest(token, objectId);
  } else {
    initAuthUi();
    cloudData = await signedOutRequest(objectId);
  }

  // if (!cloudData) window.location.href = '/';

  makeLinkPage(cloudData);
});

export async function onHashChanged() {
  const user = await auth.currentUser;
  const objectId = window.location.hash.substring(1);

  try {
    if (user) {
      const token = user.getIdToken();
      const cloudData = await signedInRequest(token, objectId);
      await makeLinkPage(cloudData);
    } else {
      const cloudData = await signedOutRequest(objectId);
      await makeLinkPage(cloudData);
    }
  } catch (e) {
    console.log(`${e}, error with onHashChanged`);
  }
}

window.addEventListener('hashchange', (e) => {
  // if we just came from a newFile page, we dont need to refetch any data
  if (e.oldURL.includes('newFile')) return;
  onHashChanged(e);
});

document.addEventListener('DOMContentLoaded', setupEventListeners);
