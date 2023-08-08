import { syncUiToArray } from '../drag-logic/draggable.js';

export function getPrecedingH2Name(div) {
  let precedingElement = div.previousElementSibling;

  while (precedingElement) {
    if (precedingElement.tagName === 'H2') {
      return precedingElement.textContent;
    }
    precedingElement = precedingElement.previousElementSibling;
  }
  return 'shadow';
}

// if selected to delete topic AND panel under, delete until next "topic" header
export function removeSubsequentElements(topic) {
  if (!topic) return;

  let nextSibling = topic.nextSibling;

  while (nextSibling && nextSibling.tagName !== 'H2') {
    const removed = nextSibling;
    nextSibling = removed.nextSibling;
    if (removed.tagName === 'PANEL-ELE') {
      removed.remove();
    }
  }
}

// for headers, on change, it needs to reflect in the links after header position
export function editElement(ele, links) {
  ele.addEventListener('dblclick', (e) => {
    console.log(e.target);
    ele.setAttribute('draggable', 'false');
    ele.focus();
    ele.setAttribute('contenteditable', 'true');
  });

  ele.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      ele.blur();
      // when name changes, change the links titles
      if (ele.tagName === 'H2') { // on enter set new topic that was edited
        const panels = getMainUi('PANEL-ELE');
        syncUiToArray(links, panels);
      }
      ele.setAttribute('draggable', 'true');
    }
  });
}

// grab all the panels or grab all the files
export function getMainUi(uiType) {
  const main = document.querySelector('main');
  if (uiType !== 'PANEL-ELE') {
    uiType = 'FILE-ELE';
  }
  return main.querySelectorAll(uiType);
}

// help from https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
// need to compare positions
export function uiPosition(parent, child, element) {
  const index = Array.prototype.indexOf.call(parent.querySelectorAll(child), element);
  return index;
}

// on drop we change positions with whatever is dropped
export function swapIndexPositions(links, oldIndex, newIndex) {
  if (oldIndex !== newIndex) {
    const oldItem = links.splice(oldIndex, 1)[0];
    links.splice(newIndex, 0, oldItem);
  }
}

// to maintain component id order
export function getOrder() {
  const main = document.querySelector('main');
  const order = main.childElementCount;
  return order;
}

//  changes all similar types of array item properties (if the type is changed),
//  otherwise it inherits the original color of whatever first found type

// fix shallow copy of the filter and find can cause bugs // may want to check on copy?
export function applyCSS(originalColor, item, array, id) {
  // if empty ignore css
  if (item.type === '') return;
  const main = document.querySelector('main');

  const typeElements = main.querySelectorAll(`.${item.type}`);
  const sameTypeLinks = array.filter(link => link.type === item.type);

  const colorChanged = item.typeColor !== originalColor;
  const notChanged = item.typeColor === originalColor;

  if (colorChanged) {
    for (const link of sameTypeLinks) {
      link.typeColor = item.typeColor;
      for (const el of typeElements) {
        el.style.backgroundColor = item.typeColor;
      }
    }
  } else if (notChanged) {
    const ele = document.querySelector(`[id="${id}"]`).querySelector('.type');
    // find first instance of the type that is not equal to the default white color
    const firstCol = sameTypeLinks.find(link => link.typeColor !== originalColor);
    if (!firstCol) return;
    ele.style.backgroundColor = firstCol.typeColor;
    item.typeColor = firstCol.typeColor;
  }
}
// applyCSS(originalColor, this.link, this.links, editorPanel.dataset.order);
