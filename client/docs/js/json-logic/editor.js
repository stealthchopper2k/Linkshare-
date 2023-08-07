function createKeywordSpan(keyword) {
  const span = document.createElement('span');
  span.textContent = keyword;
  span.classList.add('keyword');
  return span;
}

function handleRemove(span, keywords, keyword) {
  span.addEventListener('click', () => {
    const index = keywords.indexOf(keyword);
    if (index >= 0) { // if exists
      keywords.splice(index, 1);
    }
    span.remove();
  });

  return keywords;
}

// make list-builder for keywords
export function populateKeywordsDiv(keywords = [], keywordList) {
  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    const span = createKeywordSpan(keyword);
    // delete from dom and keywords array
    handleRemove(span, keywords, keyword);
    keywordList.append(span);
  }
  return keywordList;
}

// on enter add it to list
export function addKeyword(link, input, keywordList) {
  const handleInputKey = (e) => {
    if (e.key === 'Enter') {
      const keyword = input.value;
      const span = createKeywordSpan(keyword);
      link.keywords.push(keyword);
      // handle click delete
      handleRemove(span, link.keywords, keyword);
      keywordList.append(span);
      input.value = '';
    }
  };

  input.addEventListener('keydown', handleInputKey);

  return handleInputKey;
}

// Update suggestions list for keywords
export function addExistingSuggestions(links) {
  const existing = [];
  // first clear the existing suggestions
  const sugg = document.querySelector('#typesuggestions');
  sugg.replaceChildren();
  // add new ones
  for (const link of links) {
    if (!existing.includes(link.type)) {
      existing.push(link.type);
      createOption(link.type, sugg);
    }
  }
}

export function createOption(val, ele) {
  const option = document.createElement('option');
  option.value = val;
  ele.append(option);
}
