import AbstractView from './abstract.js';
import {cardsToFilterMap} from './menu.js';

export const createStatsTemplate = (cards) => `<p>${cardsToFilterMap.all(cards)} movies inside</p>`;

export default class StatsView extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createStatsTemplate(this._cards);
  }
}
