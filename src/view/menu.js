import AbstractView from './abstract.js';
import {FilterType, MenuItem} from '../const.js';


export const createMenuTemplate = (cards, filters, currentFilterType) => (`<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item ${currentFilterType === FilterType.ALL ? 'main-navigation__item--active':''}" data-filter-type="${FilterType.ALL}" data-control="${MenuItem.FILTER}">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST ? 'main-navigation__item--active':''}" data-filter-type="${FilterType.WATCHLIST}" data-control="${MenuItem.FILTER}">Watchlist <span class="main-navigation__item-count">${filters[FilterType.WATCHLIST]}</span></a>
    <a href="#history" class="main-navigation__item ${currentFilterType === FilterType.HISTORY ? 'main-navigation__item--active':''}" data-filter-type="${FilterType.HISTORY}" data-control="${MenuItem.FILTER}">History <span class="main-navigation__item-count">${filters[FilterType.HISTORY]}</span></a>
    <a href="#favorites" class="main-navigation__item ${currentFilterType === FilterType.FAVORITES ? 'main-navigation__item--active':''}" data-filter-type="${FilterType.FAVORITES}" data-control="${MenuItem.FILTER}">Favorites <span class="main-navigation__item-count">${filters[FilterType.FAVORITES]}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional" data-control="${MenuItem.STATS}">Stats</a>
</nav>`);


export default class MenuView extends AbstractView {
  constructor(cards, filters, filterType) {
    super();
    this._cards = cards;
    this._filters = filters;
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._filterType = filterType;
  }

  getTemplate() {
    return createMenuTemplate(this._cards, this._filters, this._filterType);
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

  _menuClickHandler(evt) {
    evt.preventDefault();
    this.getElement().querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');
    evt.target.classList.add('main-navigation__item--active');
    this._callback.menuClick(evt.target.dataset.control);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
