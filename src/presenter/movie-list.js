import SortMenuView from '../view/sort-menu.js';
import CardListView from '../view/card-list.js';
import NoCardView from '../view/no-card.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import {render, remove, sortByDate, sortByRating} from '../utils.js';
import CardPresenter from './movie.js';
import {SortType} from '../const.js';
import {cardsFilter} from '../model/filters.js';
import {UserAction, UpdateType, FilterType} from '../const.js';

const LIST_RENDER_COUNT = 5;

export default class MovieListPresenter {
  constructor(container, model, filterModel, commentsModel) {
    this._container = container;
    this._model = model;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._noCardComponent = null;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._cardListComponent = new CardListView();
    this._filmsListComponent = new FilmsListView();
    this._renderedCardsCount = LIST_RENDER_COUNT;
    this._cardPresenter = new Map();
    this._currentFilterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._commentsModel.addObserver(this._handleModelEvent);
    this._model.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderMovieList();
  }

  destroy() {
    this._clearPanel({resetRenderedCardsCount: true, resetSortType: true});
    this._model.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleModelEvent);
  }

  _getCards() {
    this._currentFilterType = this._filterModel.getFilter();
    const cards = this._model.getCards().slice();
    const filteredCards = cardsFilter[this._currentFilterType](cards);
    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredCards.sort(sortByDate);
      case SortType.RATING:
        return filteredCards.sort(sortByRating);
    }
    return filteredCards;
  }

  _handleViewAction(actionType, updateType, update, innerUpdate = null) {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this._model.updateCard(updateType, update);
        break;
      case UserAction.ADD_CARD:
        this._model.addCard(updateType, update);
        break;
      case UserAction.DELETE_CARD:
        this._model.deleteCard(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update, innerUpdate);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update, innerUpdate);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._cardPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearPanel();
        this._renderMovieList({resetRenderedCardsCount: true});
        break;
      case UpdateType.MAJOR:
        this._clearPanel({resetRenderedCardsCount: true, resetSortType: true});
        this._renderMovieList();
        break;
    }
  }

  _handleModeChange() {
    this._cardPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearPanel({resetRenderedCardsCount: true});
    this._renderMovieList();
  }

  _renderSortMenu(){
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortMenuView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._container, this._sortComponent);
  }

  _renderCard(cardListElement, card) {
    const cardPresenter = new CardPresenter(cardListElement, this._handleViewAction, this._handleModeChange);
    cardPresenter.init(card);
    this._cardPresenter.set(card.id, cardPresenter);
  }

  _renderCardList() {
    render(this._container, this._cardListComponent);
  }

  _renderNoCard() {
    this._noCardComponent = new NoCardView(this._currentFilterType);
    render(this._container, this._noCardComponent);
  }

  _handleShowMoreButtonClick() {
    const cardCount = this._getCards().length;
    const newRenderedCardCount = Math.min(cardCount, this._renderedCardsCount + LIST_RENDER_COUNT);
    this._getCards()
      .slice(this._renderedCardsCount, newRenderedCardCount)
      .forEach((card) => this._renderCard(this._filmsListComponent.getElement().querySelector('.films-list__container'), card));
    this._renderedCardsCount += LIST_RENDER_COUNT;
    if (this._renderedCardsCount >= cardCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._filmsListComponent.getElement(), this._showMoreButtonComponent);
  }

  _renderMovieList() {
    const cards = this._getCards();
    this._commentsModel.setData(cards);
    const cardCount = cards.length;
    if (cardCount === 0) {
      return this._renderNoCard();
    }
    if (this._noCardComponent !== null) {
      remove(this._noCardComponent);
    }
    this._renderSortMenu();
    this._renderCardList();
    const cardListElement = this._container.querySelector('.films');
    const filmsListElement = this._filmsListComponent.getElement();
    render(cardListElement, filmsListElement);
    const filmsListContainer = filmsListElement.querySelector('.films-list__container');
    cards.slice(0, Math.min(cardCount, this._renderedCardsCount)).forEach((card) => this._renderCard(filmsListContainer, card));
    if (cardCount > this._renderedCardsCount) {
      this._renderShowMoreButton();
    }
  }

  _clearPanel({resetRenderedCardsCount = false, resetSortType = false} = {}) {
    const cardCount = this._getCards().length;
    this._cardPresenter.forEach((presenter) => presenter.destroy());
    this._cardPresenter.clear();
    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);
    if (resetRenderedCardsCount) {
      this._renderedCardsCount = LIST_RENDER_COUNT;
    } else {
      this._renderedCardsCount = Math.min(cardCount, this._renderedCardsCount);
    }
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
