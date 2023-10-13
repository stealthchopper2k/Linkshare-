import {
  uiAddLinks,
  uiPopulateDataSelector,
  observeMainChildCount,
  homeImg,
} from './js/ui.js';
import { uiUtilityBar } from './js/utility/utilityBar.js';
import { getDataFileUrl, nudgeDataFile, rememberDataFile } from './js/data.js';
import { sortBy, score, generateNGramIndex } from './js/ordering.js';
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
  homeImg();

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

function titleChange(newTitle) {
  const title = document.querySelector('#title');

  if (title) {
    title.textContent = newTitle;
    document.title = newTitle;
  }

  return title.textContent;
}

function makeLinkPage(cloudData) {
  const links = cloudData.file.links;
  const fileInfo = cloudData.fileInfo;
  const title = cloudData.file.title;

  titleChange(title);

  const url = getDataFileUrl();
  rememberDataFile(title, url);

  ngrams = generateNGramIndex(links, GRAMSIZE);

  uiAddLinks(links);

  if (cloudData.fileInfo !== null) {
    uiUtilityBar(links, fileInfo);
    observeMainChildCount();
  }
}

function getQuery() {
  // get query of index to file
  const queryString = window.location.hash.split('?')[1];
  const urlParams = new URLSearchParams(queryString);

  const index = urlParams.get('index');
  return { index };
}

async function handleNewPage(token) {
  const params = getQuery();

  const cloudData = await initiateNewLinkPage(token, params.index);

  if (!cloudData.error) {
    window.location.hash = cloudData.newName; // hash before makeLinkPage
    makeLinkPage(cloudData);
  }
}

onAuthStateChanged(auth, async (user) => {
  const objectId = window.location.hash.substring(1);
  uiPopulateDataSelector();

  if (objectId.includes('newFile')) {
    if (!user) window.location.href = '/login';
    const token = await user.getIdToken();
    handleNewPage(token);
    return;
  }

  let cloudData;

  if (user) {
    const token = await user.getIdToken(); // fresh firebase token automatically refreshed
    cloudData = await signedInRequest(token, objectId);
  } else {
    cloudData = await signedOutRequest(objectId);
  }

  if (cloudData.error) {
    // TODO: Search bar or visit
    const title = document.querySelector('#title');
    const input = document.querySelector('#filter');
    input.style.display = 'none';

    title.textContent = `${cloudData.error} :(`;
    // search bar OR a list of files they have on their local storage
  } else if (!cloudData.error) {
    makeLinkPage(cloudData);
  }
});

export async function onHashChanged() {
  const user = auth.currentUser;
  const objectId = window.location.hash.substring(1);
  let cloudData;

  try {
    if (user) {
      const token = await user.getIdToken();
      if (objectId.includes('newFile')) {
        handleNewPage(token);
        return;
      }
      cloudData = await signedInRequest(token, objectId);
    } else {
      cloudData = await signedOutRequest(objectId);
    }
    if (cloudData.error) {
      // TODO: Search bar or visit
      const title = document.querySelector('#title');
      const input = document.querySelector('#filter');
      input.style.display = 'none';

      title.textContent = `${cloudData.error} :(`;
      // search bar OR a list of files they have on their local storage
    } else if (!cloudData.error) {
      makeLinkPage(cloudData);
    }
  } catch (e) {
    console.log(`${e}, error with onHashChanged`);
  }
}

document.addEventListener('DOMContentLoaded', setupEventListeners);
