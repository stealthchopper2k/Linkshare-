// import { init } from '../script.js';
import { uiPopulateDataSelector } from './ui.js';
import { onHashChanged } from '../index.js';

export function changeDataFile(url) {
  localStorage.dataFileUrl = url;
  window.location.href = url;
  onHashChanged();
}

export function getDataFileUrl() {
  // get it from fragment, store in local storage
  if (window.location.hash.length > 1) {
    const retval = `#${window.location.hash.substring(1)}`;
    if (!retval.includes('newFile')) {
      localStorage.dataFileUrl = retval;
      return retval;
    }
  }

  // if not there, get it from local storage
  if (localStorage.dataFileUrl) return localStorage.dataFileUrl;

  return '#';
}

export function nudgeDataFile(direction) {
  if (!localStorage.dataFileList) return;
  const dataFiles = JSON.parse(localStorage.dataFileList);
  if (!Array.isArray(dataFiles) || !dataFiles.length) return;

  let index = dataFiles.findIndex((f) => f.url === localStorage.dataFileUrl);

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

  dataFiles = dataFiles.filter((f) => f.url !== url);
  dataFiles.push({ title, url });
  dataFiles.sort((x, y) => x.title.localeCompare(y.title));
  localStorage.dataFileList = JSON.stringify(dataFiles);
  uiPopulateDataSelector();
}
