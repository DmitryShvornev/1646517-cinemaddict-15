import AbstractView from './view/abstract.js';

const siteBodyElement = document.querySelector('body');

export const RenderPosition = {
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
};

export const render = (container, child, place = RenderPosition.BEFORE_END) => {

  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (child instanceof AbstractView) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTER_BEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFORE_END:
      container.append(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};


export const pushBodyElement = (component) => {
  siteBodyElement.classList.add('hide-overflow');
  siteBodyElement.appendChild(component.getElement());
};

export const popBodyElement = (component) => {
  siteBodyElement.classList.remove('hide-overflow');
  siteBodyElement.removeChild(component.getElement());
};
