// import { init } from '../script.js';
import { uiPopulateDataSelector } from './ui.js';

export function changeDataFile(url) {
  console.log('change');
  localStorage.dataFileUrl = url;
  window.location.hash = url.substring(5, url.length - 5);
  // init();
}

export function getDataFileUrl() {
  // get it from fragment, store in local storage
  if (window.location.hash.length > 1) {
    const retval = `data/${window.location.hash.substring(1)}.json`;
    localStorage.dataFileUrl = retval;
    return retval;
  }

  // if not there, get it from local storage
  if (localStorage.dataFileUrl) return localStorage.dataFileUrl;

  return 'data/11f63e90.json';
}

export function nudgeDataFile(direction) {
  if (!localStorage.dataFileList) return;
  const dataFiles = JSON.parse(localStorage.dataFileList);
  if (!Array.isArray(dataFiles) || !dataFiles.length) return;

  let index = dataFiles.findIndex(f => f.url === localStorage.dataFileUrl);

  // stop early if no current url detected
  if (index === -1) return;

  index = (index + direction + dataFiles.length) % dataFiles.length;

  changeDataFile(dataFiles[index].url);
}

export function rememberDataFile(title, url) {
  let dataFiles = [];

  // get localStorage.dataFiles, fail gracefully
  try {
    dataFiles = JSON.parse(localStorage.dataFileList);
  } catch (e) {}

  dataFiles = dataFiles.filter(f => f.url !== url);
  dataFiles.push({ title, url });
  dataFiles.sort((x, y) => x.title.localeCompare(y.title));
  localStorage.dataFileList = JSON.stringify(dataFiles);
  uiPopulateDataSelector();
}
