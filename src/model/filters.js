import AbstractObserver from '../abstract-observer.js';
import {FilterType} from '../const.js';

export const cardsFilter = {
  [FilterType.ALL]: (cards) => cards,
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.isInWatchList),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.isAlreadyWatched),
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.isInFavorites),
};

export default class MenuModel extends AbstractObserver {
  constructor() {
    super();
    this._filter = FilterType.ALL;
  }

  setFilter(updateType, value) {
    this._filter = value;
    this._notify(updateType, value);
  }

  getFilter() {
    return this._filter;
  }
}
