import { removePlaceHolder } from './draggable.js';
import { insertToClosestElement } from './insertion.js';

export function dragOverAddPlaceHolder(droppableEle) {
  droppableEle.addEventListener('dragover', placeHolderFunction);
}

// placeholder is the element that shows where the dragged element will be placed
export function placeHolderFunction(e) {
  // if above placeholder, then dont do anything
  if (e.target.classList.contains('placeholder')) {
    return;
  }
  removePlaceHolder();

  const div = document.createElement('div');
  div.classList.add('placeholder');
  div.style.display = 'flex';
  div.style.justifyContent = 'center';
  div.style.alignItems = 'center';
  div.style.borderRadius = '5px';
  div.height = '50px';
  div.style.border = '1px dashed gray';
  div.textContent = 'Drop Here';
  // set timeout to prevent performance issues
  insertToClosestElement(e, div);
}

// remove placeholder wherever is it is
export function documentRemoval(element) {
  document.addEventListener('dragend', (e) => {
    const placeholder = document.querySelector(`.${element}`);
    if (placeholder) {
      placeholder.remove();
    }
  });
}
