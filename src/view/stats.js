import {createElement} from '../utils.js';
import {cardsToFilterMap} from './menu.js';

export const createStatsTemplate = (cards) => `<p>${cardsToFilterMap.all(cards)} movies inside</p>`;

export default class StatsView {
  constructor(cards) {
    this._element = null;
    this._cards = cards;
  }

  getTemplate() {
    return createStatsTemplate(this._cards);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
