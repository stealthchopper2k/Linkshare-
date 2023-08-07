import { getPrecedingH2Name, uiPosition, swapIndexPositions, removeSubsequentElements, getMainUi } from '../json-logic/helper.js';
import { closestPanelOrTopic } from './insertion.js';

// insertToClosestElement,

// fix do we really need this eletype ???
export function draggable(draggableEle, links) {
  let eleType = draggableEle.tagName;

  if (eleType === 'H2') {
    eleType = 'PANEL-ELE';
  }

  let initialPosition;
  draggableEle.setAttribute('draggable', true);
  draggableEle.addEventListener('dragstart', (e) => {
    // prevent drag if input is focused
    if (document.activeElement.tagName === 'INPUT') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const main = document.querySelector('main');
    initialPosition = uiPosition(main, eleType, draggableEle);

    // if not new element, remove placeholder for element being dragged
    dragStart(e);
  });

  // handles array updates
  const handleDragEnd = (e) => {
    const main = document.querySelector('main');
    removePlaceHolder(); // remove dynamic placeholder of dropped element

    // definitely some redundant code here
    const newPosition = uiPosition(main, eleType, draggableEle); // get pos
    swapIndexPositions(links, initialPosition, newPosition); // swap link pos in links array

    // set new topic titles to moves links
    const eles = getMainUi(eleType);
    syncUiToArray(links, eles);

    draggableEle.classList.remove('dragged');
  };

  draggableEle.addEventListener('dragend', handleDragEnd);
}

// handles deletion or insertion
export function droppable(droppableEle) {
  droppableEle.addEventListener('dragover', dragOver);
  droppableEle.addEventListener('drop', (e) => {
    const id = e.dataTransfer.getData('text/id');
    const item = document.querySelector(`[id="${id}"]`);

    // containers in which drop does either delete or replace
    const isRemoveBin = e.target.classList.contains('remove');
    const isMain = e.target.closest('main');
    const newItem = item.classList.contains('new');

    if (isRemoveBin) {
      // delete options if dropped on remove div
      deleteDrop(item);
    } else if (isMain) { // if in main then replace with dynamic placeholder
      const placeholder = document.querySelector('.placeholder');
      if (placeholder) {
        placeholder.replaceWith(item);
      } else if (newItem) {
        const main = document.querySelector('main'); // if element is new and not dropped properly between panels, add it to end of main
        main.append(item);
      }
    }
  });
}

// todo handle 'FILE-ELE' element deletion and give options?
function deleteDrop(item) {
  if (item.classList.contains('new')) return; // base case, dont delete new panel and headers (in utility panels)

  const isHeader = item.tagName === 'H2';
  const isPanel = item.tagName === 'PANEL-ELE';
  // const isFile = item.tagName === 'FILE-ELE';

  // if panel dropped to bin, delete panel element
  if (isPanel) {
    item.remove(); // (also deletes corresponding object using syncUiToArray in draggable function)
  } else if (isHeader) {
    toggleDeleteOption(item);
    clearHeaderAttribute();
    // set an attribute to that header to refer to it in, utility\utilityBar\handleTopicAndPanelDelete
    item.setAttribute('header-info', item.id);
  }
}

// we want to keep one of these at a time to monitor one dropped topic
export function clearHeaderAttribute() {
  const headerAttribute = document.querySelectorAll('[header-info]');
  headerAttribute.forEach((ele) => {
    ele.removeAttribute('header-info');
  });
}

// Show button to delete topic by itself OR button to delete topic and panels beneath
export function toggleDeleteOption() {
  const delOptions = document.querySelector('.delOptions');
  delOptions.classList.toggle('hidden');
}

// removes links from array index according to ui pos
export function syncUiToArray(links, panels) {
  if (panels.length !== links.length) {
    links.splice(panels.length, links.length - panels.length);
  }

  // if no topic e.g in dash page
  if (!links[0] || !links[0].topic) return;

  // change link topic to preceeding topic else shadow
  for (let i = 0; i < panels.length; i++) {
    const currPanel = panels[i];
    links[i].topic = getPrecedingH2Name(currPanel);
  }
  console.log(links);
}

export function dragStart(e) {
  // if target isnt directly a panel or header then g
  let currentPanel = e.target;
  if (!currentPanel.id) currentPanel = closestPanelOrTopic(e.target);
  // get id of moving element
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/id', currentPanel.id);
  }

  currentPanel.classList.add('dragged');
}

export function removePlaceHolder() {
  const placeHolder = document.querySelector('.placeholder');
  if (placeHolder) placeHolder.remove();
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  if (e.target.tagName === 'MAIN') removePlaceHolder();
}
