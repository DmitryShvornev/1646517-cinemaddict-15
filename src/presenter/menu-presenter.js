import MenuView from '../view/menu-view.js';
import {render, replace, remove} from '../utils.js';
import {UpdateType, FilterType, FilterMap} from '../const.js';

export default class MenuPresenter {
  constructor(container, model, dataModel) {
    this._container = container;
    this._component = null;
    this._model = model;
    this._dataModel = dataModel;
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._dataModel.addObserver(this._handleModelEvent);
    this._callback = {};
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._component;
    this._component = new MenuView(this._dataModel.getCards(), filters, this._model.getFilter());
    this._component.setFilterChangeHandler(this._handleFilterChange);
    if (prevFilterComponent === null) {
      render(this._container, this._component);
      return;
    }
    this._component.setMenuClickHandler(this._callback.menuClick);
    replace(this._component, prevFilterComponent);
    remove(prevFilterComponent);
  }

  setMenuHandler(callback) {
    this._component.setMenuClickHandler(callback);
    this._callback.menuClick = callback;
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterChange(filter) {
    if (this._model.getFilter() === filter) {
      return;
    }

    this._model.setFilter(UpdateType.MAJOR, filter);
  }

  _getFilters() {
    const cards = this._dataModel.getCards();
    return {
      [FilterType.ALL]: FilterMap[FilterType.ALL](cards),
      [FilterType.WATCHLIST]: FilterMap[FilterType.WATCHLIST](cards),
      [FilterType.HISTORY]: FilterMap[FilterType.HISTORY](cards),
      [FilterType.FAVORITES]: FilterMap[FilterType.FAVORITES](cards),
    };
  }
}
