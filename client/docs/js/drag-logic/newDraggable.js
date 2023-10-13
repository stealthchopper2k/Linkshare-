import {
  getPrecedingH2Name,
  uiPosition,
  editElement,
  getMainUi,
  getOrder,
} from '../json-logic/helper.js';
import { changeNgrams } from '../../index.js';
import { generateNGramIndex } from '../ordering.js';
import { uiDynamicPanel, uiCreateTopic, addDragBehaviour } from '../ui.js';
import { syncUiToArray, dragStart } from './draggable.js';

export function newDroppable(draggedElement, array, item) {
  const eleType = draggedElement.tagName;

  draggedElement.classList.add('new');

  draggedElement.setAttribute('draggable', true);
  draggedElement.addEventListener('dragstart', (e) => {
    if (document.activeElement.tagName === 'INPUT') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // const input = document.querySelector('.multiInput');
    // multiDiv(array, item, input, eleType);
    dragStart(e);
  });

  // on dragend, reset the new element, update array to the drop
  const handleNewPanel = (e) => {
    draggedElement.classList.remove('dragged');

    if (e.target.closest('main') === null) return;

    let parentAdder;
    if (eleType === 'H2') {
      const panels = getMainUi('PANEL-ELE');
      parentAdder = document.querySelector('.addTopic');
      draggedElement.classList.remove('new');
      syncUiToArray(array, panels);
      editElement(draggedElement, array);
    } else if (eleType === 'PANEL-ELE') {
      parentAdder = document.querySelector('.addPanel');
      updateArrayForLink(array, item, draggedElement);
      changeNgrams(generateNGramIndex(array, 3));
    } else {
      parentAdder = document.querySelector('.addPanel');
      updateArrayForFile(array, item, draggedElement);
    }
    // fix adding a number of elements, then deleting same number of elements causes adding ID bug
    setNewDroppable(parentAdder, eleType, item, array);

    // if file is a panel horizontal, else vertical
    if (eleType === 'FILE-ELE') {
      addDragBehaviour(draggedElement, array, false);
    } else {
      addDragBehaviour(draggedElement, array, true);
    }

    draggedElement.removeEventListener('dragend', handleNewPanel);
  };

  draggedElement.addEventListener('dragend', handleNewPanel);
}

// fix doesn't look efficient but im unsure how to handle the side effects cleanly
function updateArrayForFile(files, file, div) {
  const main = document.querySelector('main');
  const position = uiPosition(main, 'FILE-ELE', div);
  div.classList.remove('new');
  files.splice(position, 0, file);
  return files;
}

function updateArrayForLink(array, link, div) {
  const main = document.querySelector('main');
  const position = uiPosition(main, 'PANEL-ELE, .h2', div);
  div.classList.remove('new');
  link.topic = getPrecedingH2Name(div);
  array.splice(position, 0, link);
  return array;
}

// setNewDroppable(parentAdder, eleType, item, array);
// assigns brand new panel to the utilityBars addPanel div with adjusted id according to 'main'
function setNewDroppable(holderEle, type, item = {}, array) {
  const copyLink = JSON.parse(JSON.stringify(item));
  // new Panel gets copy of the array ID so its not mutated by utilityPanel
  const ele = whatEleToReset(type, item, array);

  newDroppable(ele, array, copyLink);
  ele.classList.add('new');
  holderEle.textContent = ''; // clear the addPanel div
  holderEle.append(ele);
}

// fix order issue the order in files needs to correlate with id or data-order to update correctly
function whatEleToReset(eleType, item, array) {
  const copyLink = JSON.parse(JSON.stringify(item));

  const order = getOrder() + 10;

  let ele;

  if (eleType === 'H2') {
    ele = uiCreateTopic('Header', -order);
    ele.textContent += order; // if we want headers to not be deleted on update, they need to be unique on drop
  } else if (eleType === 'PANEL-ELE') {
    ele = uiDynamicPanel(copyLink, -order, array);
  }

  return ele;
}
