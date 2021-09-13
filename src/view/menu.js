import AbstractView from './abstract.js';
import {FilterType} from '../const.js';


export const createMenuTemplate = (cards, filters) => (`<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active" data-filter-type="${FilterType.ALL}">All movies</a>
    <a href="#watchlist" class="main-navigation__item" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${filters[FilterType.WATCHLIST]}</span></a>
    <a href="#history" class="main-navigation__item" data-filter-type="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${filters[FilterType.HISTORY]}</span></a>
    <a href="#favorites" class="main-navigation__item" data-filter-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${filters[FilterType.FAVORITES]}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`);


export default class MenuView extends AbstractView {
  constructor(cards, filters) {
    super();
    this._cards = cards;
    this._filters = filters;
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._cards, this._filters);
  }

  _filterChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this.getElement().querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');
    evt.target.classList.add('main-navigation__item--active');
    this._callback.filterChange(evt.target.dataset.filterType);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._filterChangeHandler);
  }
}
