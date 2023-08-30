import { changeDataFile } from './data.js';
import { draggable, droppable } from './drag-logic/draggable.js';
import { editElement } from './json-logic/helper.js';
import { Panel } from './json-logic/pan-ele.js'; //eslint-disable-line
import { dragOverAddPlaceHolder } from './drag-logic/drag-placeholder.js';
import HomeImg from '../../images/home.svg?as=webp';

export function uiCreateTopic(name, order) {
  const d = document.createElement('h2');
  d.classList.add('topic');
  d.dataset.order = order;
  d.id = order;
  d.dataset.score = 0;
  d.textContent = name;
  return d;
}

export function uiDynamicPanel(link, order, links) {
  const linkElement = document.createElement('panel-ele');
  linkElement.order = order;
  linkElement.id = order;
  linkElement.score = 0;
  linkElement.links = links;
  linkElement.link = link;

  return linkElement;
}

export function addDragBehaviour(element, links, vertical) {
  draggable(element, links, vertical);
  droppable(element, vertical);
  dragOverAddPlaceHolder(element);

  return element;
}

export function uiAddLinks(links) {
  const oldMain = document.querySelector('main');
  if (oldMain) oldMain.remove();

  const main = document.createElement('main');
  main.classList.add('check');

  droppable(main, true);
  document.body.appendChild(main);

  let i = 0;
  let lastTopic;
  for (let j = 0; j < links.length; j++) {
    const link = links[j];
    if (link.topic && link.topic !== lastTopic && link.topic !== 'shadow') {
      // if not shadow, which is default topic
      const topicElement = uiCreateTopic(link.topic, i--);
      main.append(topicElement);
      // headers are content editable
      editElement(topicElement, links);
      addDragBehaviour(topicElement, links, true);
      lastTopic = link.topic;
    }
    // fix just pass a single instance of links from storage or hash ??
    const linkElement = uiDynamicPanel(link, i--, links);
    main.appendChild(linkElement);
    addDragBehaviour(linkElement, links, true);
  }
  editElement(document.querySelector('#title'), []);
}

function uiSelectDataFile(e) {
  changeDataFile(e.target.value);
}

export function uiPopulateDataSelector() {
  if (!localStorage.dataFileList) return;

  const dataFiles = JSON.parse(localStorage.dataFileList);
  if (!Array.isArray(dataFiles) || !dataFiles.length) return;

  const selector = document.querySelector('#datasel');
  selector.innerHTML = '<option>Select data file</option>';
  for (const file of dataFiles) {
    const opt = document.createElement('option');
    opt.textContent = file.title;
    opt.value = file.url;
    selector.appendChild(opt);
  }

  selector.disabled = false;

  if (dataFiles.length > 1) {
    selector.classList.remove('hidden');
  }

  selector.addEventListener('change', uiSelectDataFile);
}

export function observeMainChildCount() {
  const main = document.querySelector('.check');

  showDroppableMain();
  const dropzone = document.querySelector('#dropzone');

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.target.childNodes.length === 1) {
        dropzone.style.display = 'flex'; // Hide the dropzone
      } else {
        dropzone.style.display = 'none'; // Show the dropzone
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(main, { childList: true });
}

export function homeImg() {
  const homeimg = document.querySelector('.homeimg');

  homeimg.src = HomeImg;
}

function showDroppableMain() {
  const main = document.querySelector('.check');
  if (!main) return;

  const div = document.createElement('div');
  div.id = 'dropzone';
  const span = document.createElement('span');
  span.id = 'note';

  // span.style.width = '100%';
  span.textContent = 'Drop here to add new links';

  div.appendChild(span);
  main.appendChild(div);

  if (main.childElementCount > 1) {
    div.style.display = 'none';
  } else {
    div.style.display = 'flex';
  }
}
