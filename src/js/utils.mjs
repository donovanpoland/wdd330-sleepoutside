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
  return urlParams.get(param);
}


export function renderWithTemplate(template, parentElement, data, callback) {

  parentElement.innerHTML = template;
  if(callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate("../partials/header.html");
    const footerTemplate = await loadTemplate("../partials/footer.html");

    const headerElement = document.querySelector("#dy-header");
    const footerElement = document.querySelector("#dy-footer");

    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement);
    } else {
      console.warn("Header element '#dy-header' not found");
    }

    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
    } else {
      console.warn("Footer element '#dy-footer' not found");
    }
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}