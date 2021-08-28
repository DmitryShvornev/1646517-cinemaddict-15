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

export const replace = (newChild, oldChild) => {

  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;
  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Cannor replace unexisting elements.');
  }
  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if(!(component instanceof AbstractView)) {
    throw new Error('Can only remove components.');
  }
  component.getElement().remove();
  component.removeElement();
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

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
