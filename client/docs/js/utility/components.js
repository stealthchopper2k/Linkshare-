import { updateContent, updateFileRights } from '../auth/fileReqs.js';
import { droppable } from '../drag-logic/draggable.js';
import { setLinkPageAdders } from './utilityBar.js';
import { auth } from '../auth/google.js';

export function addComponent(array, specificContent, page) {
  // bar template and specific template
  const addDiv = specificContent.querySelector('#add');
  // append the add section to the bar
  document.querySelector('.utilityBar').append(addDiv);
  // brand new link (new instance is made in newDroppable export function)
  if (page === 'linkpage') {
    setLinkPageAdders(array);
  }
}

export function uiDeleteComponent(specificContent) {
  const deleteIcon = specificContent.querySelector('#remove');
  document.querySelector('.utilityBar').append(deleteIcon);
  droppable(deleteIcon);
}

// to check if a user has changed the window hash to another file and attempted to update another objectID endpoint,
// the server will check the user rights of the file before updating the endpoint
export function uiUpdateComponent(specificContent, links) {
  const updateDiv = specificContent.querySelector('#update');
  document.querySelector('.utilityBar').append(updateDiv);

  const user = auth.currentUser;
  const objectId = window.location.hash.substring(1);

  updateDiv.addEventListener('click', async () => {
    await updateContent(user.accessToken, objectId, links);
  });
}

function rightsBox(user, usersArray, select) {
  const newBox = document.createElement('div');
  const span = document.createElement('span');
  const newSelect = select.cloneNode(true);
  const removeOption = document.createElement('option');

  // initial info
  const email = Object.keys(user)[0];
  const right = user[email];

  newBox.classList.add('userBox');

  span.classList.add('emailInput');
  span.textContent = email;

  removeOption.value = 'remove';
  removeOption.textContent = 'Remove User';

  newSelect.value = right;

  newSelect.append(removeOption);

  newBox.append(span, newSelect);

  newSelect.addEventListener('change', (e) => {
    // change user right
    if (e.target.value === 'remove') {
      newBox.remove();
      usersArray.splice(usersArray.indexOf(user), 1);
      console.log(usersArray);
    } else {
      user[email] = e.target.value;
    }
  });

  return newBox;
}

export function editRightsComponent(specificContent, users, read) {
  const editRightsDiv = specificContent.querySelector('#editrights');
  const select = specificContent.querySelector('.rightType');

  const utilityBar = document.querySelector('.utilityBar');

  utilityBar.append(editRightsDiv);

  const usersWithRights = JSON.parse(JSON.stringify(users));
  let pub;

  const shareImg = editRightsDiv.querySelector('.shareimg');
  const sectionEdit = editRightsDiv.querySelector('.section-edit');
  const userList = editRightsDiv.querySelector('.userList');
  const readType = editRightsDiv.querySelector('#readType');
  readType.checked = read;

  // const cancelBtn = editRightsDiv.querySelector('.cancelBtn');
  const confirmBtn = editRightsDiv.querySelector('.confirmBtn');
  const emailInput = editRightsDiv.querySelector('.emailInput');

  for (const user of usersWithRights) {
    const box = rightsBox(user, usersWithRights, select);
    userList.append(box);
  }

  // css technique learned from https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
  shareImg.addEventListener('click', () => {
    sectionEdit.style.display =
      sectionEdit.style.display === 'none' ? 'block' : 'none';
  });

  readType.addEventListener('change', (e) => {
    pub = e.target.checked;
  });

  emailInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rightType = editRightsDiv.querySelector('.rightType').value;
      const userEmail = e.target.value;

      // if exists
      if (usersWithRights.some((user) => Object.keys(user)[0] === userEmail)) {
        return;
      }

      const user = {
        [userEmail]: rightType,
      };

      usersWithRights.push(user);

      const box = rightsBox(user, usersWithRights, select);
      userList.append(box);
      e.target.value = '';
    }
  });

  confirmBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    const objectId = window.location.hash.substring(1);

    sectionEdit.style.display =
      sectionEdit.style.display === 'none' ? 'block' : 'none';

    const postObj = {
      usersWithRights: usersWithRights,
      readType: pub,
    };
    await updateFileRights(user.accessToken, objectId, postObj);
  });
}

export function fileUpdate(specificContent, files) {
  const updateDiv = specificContent.querySelector('#update');
  document.querySelector('.utilityBar').append(updateDiv);

  const header = document.querySelector('#title').textContent;
  const publicationTime = new Date().toLocaleString('en-GB', {
    timeZone: 'UTC',
  });

  const file = {
    title: header,
    links: files,
    publicationTime: publicationTime,
  };

  const user = auth.currentUser;
  const objectId = window.location.hash.substring(1);

  updateDiv.addEventListener('click', async () => {
    await updateContent(user.accessToken, objectId, file);
  });
}

export function uiSyncComponent(specificContent) {
  const syncDiv = specificContent.querySelector('#read');
  document.querySelector('.utilityBar').append(syncDiv);
  syncDiv.addEventListener('click', () => {
    window.location.reload();
  });
}
