// taken from https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib

export function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

// if the event cursor is in top or bottom half
// if top return true else false
export function topOrBottomOfElement(e, element) {
  const rect = element.getBoundingClientRect();
  return e.clientY < (rect.top + rect.bottom) / 2;
}

export function leftOrRightOfElement(e, element) {
  const rect = element.getBoundingClientRect();
  return e.clientX < (rect.left + rect.right) / 2;
}

export function insertLeftOrRight(item, element, e) {
  if (!element) return;
  const leftOrRight = leftOrRightOfElement(e, element);
  if (leftOrRight) {
    element.parentNode.insertBefore(item, element);
  } else {
    insertAfter(item, element);
  }
}

export function insertTopOrBottom(item, element, e) {
  const topOrBot = topOrBottomOfElement(e, element);
  if (topOrBot) {
    console.log(item);
    element.parentNode.insertBefore(item, element);
  } else {
    console.log(item);
    insertAfter(item, element);
  }
}

export function closestPanelOrTopic(element) {
  if (!element) return;

  if (element.closest('panel-ele')) {
    return element.closest('panel-ele');
  } else if (element.closest('.topic')) {
    return element.closest('.topic');
  } else if (element.closest('file-ele')) {
    return element.closest('file-ele');
  } else {
    return null;
  }
}

// // check the topmost element, if not within specific pixel amount, then go down
// // todo perhaps make the main component have a fixed length rather than relying on dragging to other panels
export function insertToClosestElement(e, item, vertical) {
  // fix the extra 10px is subject to change mobile vs desktop
  // get position of cursor
  if (!e.target.closest('main')) return;

  const closestElement = findClosestElement(e, 10, 10, vertical);

  if (vertical) {
    insertTopOrBottom(item, closestElement, e);
  } else {
    insertLeftOrRight(item, closestElement, e);
  }
}

// find first element to opposite side of axis (X = left right, Y = up down)
// limit to attempts and
export function findClosestElement(e, offSet, maxAttempts, vertical) {
  let attempts = 0;
  let before;
  let closestElement;
  let offSet2 = offSet;
  let before2;

  while (
    !before ||
    before.classList.contains('placeholder') ||
    before.classList.contains('check')
  ) {
    if (attempts < maxAttempts) {
      offSet += 10;
      offSet2 += 10;

      if (vertical) {
        before = document.elementFromPoint(e.clientX, e.clientY - offSet); // goes up
        before2 = document.elementFromPoint(e.clientX, e.clientY + offSet2); // goes down
      } else {
        before = document.elementFromPoint(e.clientX - offSet, e.clientY); // goes left
        before2 = document.elementFromPoint(e.clientX + offSet2, e.clientY); // goes right
      }
      if (!before || !before2) {
        attempts += 1;
      } else {
        const main = document.querySelector('main');
        const nonNull = main.contains(before) ? before : before2;
        closestElement = closestPanelOrTopic(nonNull);
      }
    }
  }

  return closestElement;
}
