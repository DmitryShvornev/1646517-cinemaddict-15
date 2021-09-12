import AbstractView from './view/abstract.js';
import dayjs from 'dayjs';
import {RenderPosition} from './const.js';

const siteBodyElement = document.querySelector('body');

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
  if (component === null) {
    return;
  }

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
  const index = items.findIndex(({id}) => id === update.id);

  if (index === -1) {
    return items;
  }
  const updatedItems = items.slice();
  updatedItems[index] = update;
  return updatedItems;
};

export const sortByDate = (cardA, cardB) => (dayjs(cardA.details.releaseDate).diff(dayjs(cardB.details.releaseDate)));

export const sortByRating = (cardA, cardB) => (cardA.rating - cardB.rating);
