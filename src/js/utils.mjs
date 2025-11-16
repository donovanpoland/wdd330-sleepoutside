// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = ""; // clear contents if clear flag is true
  }
  
  // map over the list and generate HTML strings using the template function
  const htmlStrings = list.map(templateFn);

  // insert the combined HTML string at the specified position in the parent element
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get('product');
  return product;
}
function renderWithTemplate(template, parentElement, data, callback, position = "afterbegin") {
  if (parentElement) {
    parentElement.insertAdjacentHTML(position, template);
    if (callback) {
      callback(data);
    }
  } else {
    console.error("Parent element is null or undefined.");
  }
}

async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const header = document.querySelector("header");
  header.innerHTML = "";
  // Get header element from page
  const headerElement = document.getElementById("dy-header");
  // Get header template
  const headerTemplate = await loadTemplate("../partials/header.html");
  // Get footer element from page
  const footerElement = document.getElementById("dy-footer");
  // Get footer template
  const footerTemplate = await loadTemplate("../partials/footer.html");

  // Update page with footer/header
  if (headerElement && headerTemplate) {
    renderWithTemplate(headerTemplate, headerElement);
  }
  if (footerElement && footerTemplate) {
    renderWithTemplate(footerTemplate, footerElement);
  }
}
