import AbstractView from './abstract-view.js';
import {FilterMap, FilterType} from '../const.js';

export const createStatsTemplate = (cards) => `<p>${FilterMap[FilterType.ALL](cards)} movies inside</p>`;

export default class StatsView extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createStatsTemplate(this._cards);
  }
}
