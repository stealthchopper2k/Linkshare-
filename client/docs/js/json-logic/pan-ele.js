import { populateKeywordsDiv, addKeyword } from './editor.js';
import { changeNgrams } from '../../script.js';
import { generateNGramIndex } from '../ordering.js';
import { applyCSS } from './helper.js';

export class Panel extends HTMLElement {
  constructor() {
    super();
    this.link = {};
    this.order = 0;
    this.score = 0;
    this.links = [];
  }

  connectedCallback() {
    const div = this.uiCreateLink();

    if (this.children.length < 1) {
      this.appendChild(div);
    }
  }

  // create static panel
  uiCreateLink() {
    this.link.keywords = this.link.keywords || []; // definitely more clean way of saying this
    const d = document.createElement('div');
    d.id = this.order;
    d.classList.add('panel');
    d.dataset.score = this.score;
    d.dataset.order = this.order;
    if (this.link.keywords && this.link.keywords.length > 0) {
      d.dataset.keywords = this.link.keywords.join(' ');
    }

    const s = document.createElement('span');
    s.classList.add('type');
    s.classList.add(this.link.type || 'none');

    s.textContent = this.link.type;

    const a = document.createElement('a');
    a.classList.add('ref', 'theurlthingthatactuallymatters');
    a.href = this.link.href || '';

    const p1 = document.createElement('span');
    p1.classList.add('refName');

    p1.textContent = this.link.text || '';
    a.append(p1);

    if (this.link.info) {
      const p2 = document.createElement('p');
      p2.classList.add('info');
      p2.innerHTML = this.link.info || '';
      a.append(p2);
    }
    if (this.link.textColor) p1.style.color = this.link.textColor;
    if (this.link.typeColor) s.style.backgroundColor = this.link.typeColor;

    d.append(s, a);
    this.replacePanelWithEditor(d);
    return d;
  }

  // double clicking panel turns into editor panel
  replacePanelWithEditor(ele) {
    ele.addEventListener('dblclick', (e) => {
      e.preventDefault();
      const panel = this.createEditorPanel();
      this.addEditorPanelEventListeners(panel, this.link);
      ele.replaceWith(panel); // replace element
      // default first input to focus is .type on top of editorPanel
      panel.querySelector('.type').select();
    });
  }

  // on confirm in editor panel switch back to panel
  replaceEditorWithPanel(oldEle) {
    const panel = this.uiCreateLink();
    oldEle.replaceWith(panel);
    return panel;
  }

  // Static panel creator
  createEditorPanel() {
    const template = document.querySelector('#editor-panel-template');
    const cloned = template.content.cloneNode(true);
    const editorPanel = cloned.querySelector('.editorPanel');

    this.uiUpdateSuggestions(this.links);
    editorPanel.id = this.order;
    editorPanel.dataset.score = this.score;
    editorPanel.dataset.order = this.order;

    if (this.link.keywords && this.link.keywords.length > 0) {
      editorPanel.dataset.keywords = this.link.keywords.join(' ');
    }

    editorPanel.querySelector('.type-name').textContent = 'Type: ';
    editorPanel.querySelector('.type').value = this.link.type;
    editorPanel.querySelector('.color-type').value = this.link.typeColor;
    editorPanel.querySelector('.color-refName').value = this.link.textColor;
    editorPanel.querySelector('.type').style.backgroundColor = this.link.typeColor;
    editorPanel.querySelector('.refInput').value = this.link.text;
    editorPanel.querySelector('.theurlthingthatactuallymatters').value = this.link.href;
    editorPanel.querySelector('.pub-checkbox').checked = this.link.pub;

    const keywordList = editorPanel.querySelector('.keywords-list');
    const input = editorPanel.querySelector('.keywords-input');

    populateKeywordsDiv(this.link.keywords, keywordList);
    addKeyword(this.link, input, keywordList);

    return editorPanel;
  }

  // understood from https://stackoverflow.com/questions/20069828/how-to-convert-set-to-array
  getUniqueLinkTypes(links) {
    return Array.from(new Set(links.map(link => link.type)));
  }

  // concept learned from https://coderwall.com/p/o9ws2g/why-you-should-always-append-dom-elements-using-documentfragments
  createOptionElements(types) {
    const fragment = document.createDocumentFragment();
    for (const type of types) {
      const option = document.createElement('option');
      option.value = type;
      fragment.appendChild(option);
    }
    return fragment;
  }

  // checks links array to find removed and updated type values
  // updates all ui suggestions for type accordingly using fragment
  uiUpdateSuggestions() {
    const suggestionDivs = document.querySelectorAll('#typesuggestions');
    const uniqueLinkTypes = this.getUniqueLinkTypes(this.links);
    const fragment = this.createOptionElements(uniqueLinkTypes);

    for (const suggestion of suggestionDivs) {
      suggestion.textContent = '';
      suggestion.append(fragment.cloneNode(true));
    }
  }

  addEditorPanelEventListeners(editorPanel) {
    const originalLink = JSON.parse(JSON.stringify(this.link));
    const originalColor = originalLink.typeColor;

    const typeInput = editorPanel.querySelector('.type');
    const textInput = editorPanel.querySelector('.refInput');
    const hrefInput = editorPanel.querySelector('.theurlthingthatactuallymatters');
    const pubInput = editorPanel.querySelector('.pub-checkbox');
    const confirmBtn = editorPanel.querySelector('.confirm');
    const cancelBtn = editorPanel.querySelector('.cancel');
    const typeColor = editorPanel.querySelector('.color-type');
    const textColor = editorPanel.querySelector('.color-refName');

    // query select all similar types AND links, change the style.backgroundColor AND link.typeColor
    typeColor.addEventListener('change', (e) => {
      this.link.typeColor = typeColor.value;
    });

    textColor.addEventListener('change', (e) => {
      this.link.textColor = textColor.value;
    });

    // default input changes to alter the original array
    typeInput.addEventListener('input', (e) => {
      typeInput.value = typeInput.value.toString().replaceAll(' ', '');
      this.link.type = typeInput.value;
    });

    textInput.addEventListener('change', (e) => {
      this.link.text = textInput.value;
    });

    pubInput.addEventListener('change', (e) => {
      this.link.pub = pubInput.checked;
    });

    // prevent space from being entered in type input (only single words allowed)
    typeInput.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }
    });

    hrefInput.addEventListener('input', (e) => {
      this.link.href = hrefInput.value;
      console.log(this.link.href);
    });

    // Drag and Drop for URL input field
    // hrefInput.addEventListener('drop', function (e) {
    //   e.stopPropagation();
    //   e.preventDefault();

    //   const url = e.dataTransfer.getData('text/plain');

    //   hrefInput.value = url;
    //   this.link.href = url;
    // });

    confirmBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.replaceEditorWithPanel(editorPanel);
      // When a new type is added, add it to the suggestions list
      this.uiUpdateSuggestions(this.links);
      applyCSS(originalColor, this.link, this.links, editorPanel.dataset.order);
      changeNgrams(generateNGramIndex(this.links, 3));
    });

    // fix In the future if we want to add nesting to links, this will cause bugs
    cancelBtn.addEventListener('click', (e) => {
      Object.assign(this.link, originalLink); // shallow copy, works since we have 1 level and no nesting in array
      this.replaceEditorWithPanel(editorPanel);
    });
  }
}

customElements.define('panel-ele', Panel);
