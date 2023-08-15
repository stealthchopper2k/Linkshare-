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
  uiUpdateComponent,
  editRightsComponent,
} from './components.js';
import { uiDynamicPanel, uiCreateTopic } from '../ui.js';
import { syncUiToArray } from '../drag-logic/draggable.js';
import UpdateImg from '../../images/push.png?as=webp';
import DeleteImg from '../../images/trash.png?as=webp';
import ReloadImg from '../../images/sync.png?as=webp';
import ShareImg from '../../images/share.svg?as=webp';

function addUtilityImages() {
  // add the images to the utility bar

  const updateImg = document.querySelector('.update');
  const deleteImg = document.querySelector('.remove');
  const syncImg = document.querySelector('.sync');
  const shareImg = document.querySelector('.share');

  if (updateImg) {
    updateImg.src = UpdateImg;
  }

  if (deleteImg) {
    deleteImg.src = DeleteImg;
  }

  if (syncImg) {
    syncImg.src = ReloadImg;
  }

  if (shareImg) {
    shareImg.src = ShareImg;
  }
}

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

  if (page === 'linkpage') {
    const links = data.file.links;
    handleTopicAndPanelDelete(links);

    if (auth.currentUser) {
      const rights = data.fileInfo.rights;
      rightsToComponents(rights, specificContent, data, links);
    } else {
      // todo add to local storage
    }
  }

  addUtilityImages();
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
