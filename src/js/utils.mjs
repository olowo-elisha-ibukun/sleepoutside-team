// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  try {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) {
      return null;
    }
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn(`Unable to parse localStorage key ${key}:`, error);
    return null;
  }
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
// get a specific parameter from the URL query string
export function getParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}
// load an HTML template from the partials folder
export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${path}`);
  }
  return await response.text();
}

// Resolve a partial template path relative to this module file.
// This prevents deep nested pages from breaking when they try to fetch shared partials.
function resolvePartialPath(filename) {
  return new URL(`../public/partials/${filename}`, import.meta.url).href;
}

// render a template into a parent element
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback && typeof callback === "function") {
    callback(data);
  }
}

// load header and footer templates and inject them into the page
export async function loadHeaderFooter() {
  const headerUrl = resolvePartialPath('header.html');
  const footerUrl = resolvePartialPath('footer.html');
  const headerTemplate = await loadTemplate(headerUrl).catch(() => loadTemplate('/partials/header.html'));
  const footerTemplate = await loadTemplate(footerUrl).catch(() => loadTemplate('/partials/footer.html'));
  const headerEl = qs('#main-header');
  const footerEl = qs('#main-footer');
  if (headerEl) renderWithTemplate(headerTemplate, headerEl);
  if (footerEl) renderWithTemplate(footerTemplate, footerEl);
}
