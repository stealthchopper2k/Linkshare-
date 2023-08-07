import {
  dragOverAddPlaceHolder,
  documentRemoval,
} from '../drag-logic/drag-placeholder.js';
import { auth } from '../auth/google.js';
import { newDroppable } from '../drag-logic/newDraggable.js';
import {
  getOrder,
  getMainUi,
  removeSubsequentElements,
} from '../json-logic/helper.js';
import { Panel } from '../json-logic/pan-ele.js'; //eslint-disable-line
import {
  uiSyncComponent,
  addComponent,
  uiDeleteComponent,
  fileToDashboard,
  uiUpdateComponent,
  editRightsComponent,
} from './components.js';
import { uiDynamicPanel, uiCreateTopic } from '../ui.js';
import { uiDynamicFile } from '../dashboard/hotlist.js';
import { fileUpdateComponent } from '../dashboard/components.js';
import { syncUiToArray } from '../drag-logic/draggable.js';

// holding div template
export function setUtilityTemplate() {
  const utilityTemplate = document.querySelector('#utilityBarTemplate');
  const utilityContent = utilityTemplate.content.cloneNode(true);

  const specificTemplate = document.querySelector('#specificControllers');
  const specificContent = specificTemplate.content.cloneNode(true);

  document.querySelector('body').appendChild(utilityContent);

  return specificContent;
}

// when user drops topic into bin and chooses delete topic and panels
// it will delete all element panels with "deleteDrop" function in /drag-logic/draggable.js
// and this function delete the corresponding object to the element
function handleTopicAndPanelDelete(links) {
  const delOptions = document.querySelector('.delOptions');
  const deleteTopicPanel = document.querySelector('.delPanel');
  const deleteTopic = document.querySelector('.delTopic');

  const handleDeleteTopicAndPanels = (e, links) => {
    const header = document.querySelector('[header-info]');

    const topic = e.target === deleteTopic;
    const topicWithPanels = e.target === deleteTopicPanel;

    if (topicWithPanels) {
      removeSubsequentElements(header, 'PANEL-ELE'); // remove header and panels
      header.remove();
    } else if (topic) {
      header.remove(); // remove just header
    }

    // get all panel elements
    const eles = getMainUi('PANEL-ELE');
    // delete corresponding elements and set new topics to objects
    syncUiToArray(links, eles);

    delOptions.classList.toggle('hidden');
  };

  // add event listener to buttons
  deleteTopicPanel.addEventListener('click', (e) => {
    handleDeleteTopicAndPanels(e, links);
  });

  deleteTopic.addEventListener('click', (e) => {
    handleDeleteTopicAndPanels(e, links);
  });
}

export function uiUtilityBar(data, page) {
  // remove bar if already there
  const ifExists = document.querySelector('.utilityBar');
  if (ifExists) ifExists.remove();

  const specificContent = setUtilityTemplate();

  uiSyncComponent(specificContent);
  uiDeleteComponent(specificContent);

  if (page === 'filePage') {
    const files = data.files;
    fileUpdateComponent(specificContent, files);
    addComponent(files, specificContent, 'filepage');
  } else if (page === 'linkpage') {
    const links = data.file.links;
    const rights = data.fileInfo.rights;
    handleTopicAndPanelDelete(links);

    if (auth.currentUser) {
      if (!data.hasInDash) fileToDashboard(specificContent); // if user already has in dash theres no need to add it again
      rightsToComponents(rights, specificContent, data, links);
    } else {
      // todo add to local storage
    }
  }
}

// messy?
function rightsToComponents(rights, specificContent, data, links) {
  const isOwner = rights === 'owner';
  const isEditor = rights === 'edit';

  addComponent(links, specificContent, 'linkpage');

  if (isOwner || isEditor) {
    uiUpdateComponent(specificContent, links);
  }

  if (isOwner) editRightsComponent(specificContent, data.fileInfo.info);
}

export function setLinkPageAdders(links) {
  const freshLink = {
    topic: 'shadow',
    text: 'Name',
    href: 'https://convertingcolors.com/rgb-color-38_35_44.html',
    type: 'Type',
    keywords: ['keyword'],
    textColor: '#000000',
    typeColor: '#FFFFFF',
    pub: true,
  };

  // holders of new d
  const addPanel = document.querySelector('.addPanel');
  const addTopic = document.querySelector('.addTopic');

  const order = getOrder();

  const draggyPanel = uiDynamicPanel(freshLink, -order, links);
  const draggyHeader = uiCreateTopic('Header', -order - 1);
  draggyHeader.textContent += order; // if we want headers to not be deleted on update, they need to be unique on drop
  draggyHeader.style.overflow = 'visible';

  newDroppable(draggyPanel, links, freshLink);
  newDroppable(draggyHeader, links, freshLink);

  dragOverAddPlaceHolder(draggyPanel);
  dragOverAddPlaceHolder(draggyHeader);

  addPanel.append(draggyPanel);
  addTopic.append(draggyHeader);

  documentRemoval('placeholder');
}

export function setFilePageAdders(files) {
  const addPanel = document.querySelector('.addPanel');

  const order = getOrder();

  const fileObj = {
    name: 'newFile', // make unique
    title: 'Name',
  };

  const newFile = uiDynamicFile(fileObj, order, files);

  newFile.classList.add('new');
  newDroppable(newFile, files, fileObj);
  dragOverAddPlaceHolder(newFile);

  addPanel.append(newFile);

  documentRemoval('placeholder');
}
