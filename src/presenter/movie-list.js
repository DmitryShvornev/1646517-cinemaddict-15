import SortMenuView from '../view/sort-menu.js';
import CardListView from '../view/card-list.js';
import NoCardView from '../view/no-card.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import {render, remove, RenderPosition, updateItem} from '../utils.js';
import CardPresenter from './movie.js';
import {listTitles} from '../view/films-list.js';

const LIST_RENDER_COUNT = 5;
const EXTRA_LIST_RENDER_COUNT = 2;

export default class MovieListPresenter {
  constructor(container) {
    this._container = container;
    this._noCardComponent = new NoCardView();
    this._sortComponent = new SortMenuView();
    this._cardListComponent = new CardListView();
    this._filmsListComponent = new FilmsListView(listTitles.ALL);
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._renderedCardsCount = LIST_RENDER_COUNT;
    this._cardPresenter = new Map();
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(cards) {
    this._cards = cards.slice();
    this._renderMovieList();
  }

  _handleCardChange(updatedCard) {
    this._cards = updateItem(this._cards, updatedCard);
    this._cardPresenter.get(updatedCard.id).init(updatedCard);
  }

  _handleModeChange() {
    this._cardPresenter.forEach((presenter) => presenter.resetView());
  }

  _renderSortMenu(){
    render(this._container, this._sortComponent);
  }

  _renderCard(cardListElement, card) {
    const cardPresenter = new CardPresenter(cardListElement, this._handleCardChange, this._handleModeChange);
    cardPresenter.init(card);
    this._cardPresenter.set(card.id, cardPresenter);
  }

  _renderCardList() {
    render(this._container, this._cardListComponent);
  }

  _renderNoCard() {
    render(this._container, this._noCardComponent, RenderPosition.AFTER_BEGIN);
  }

  _handleShowMoreButtonClick() {
    this._cards
      .slice(this._renderedCardsCount, this._renderedCardsCount + LIST_RENDER_COUNT)
      .forEach((card) => this._renderCard(this._filmsListComponent.getElement().querySelector('.films-list__container'), card));

    this._renderedCardsCount += LIST_RENDER_COUNT;

    if (this._renderedCardsCount >= this._cards.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._filmsListComponent.getElement(), this._showMoreButtonComponent);
  }

  _renderMovieList() {
    if (this._cards.length === 0) {
      return this._renderNoCard();
    }
    this._renderSortMenu();
    this._renderCardList();
    const cardListElement = this._container.querySelector('.films');
    const filmsListElement = this._filmsListComponent.getElement();
    render(cardListElement, filmsListElement);
    const filmsListContainer = filmsListElement.querySelector('.films-list__container');

    for (let i = 0; i < Math.min(this._cards.length, LIST_RENDER_COUNT); i++) {
      this._renderCard(filmsListContainer, this._cards[i]);
    }

    if (this._cards.length > LIST_RENDER_COUNT) {
      this._renderShowMoreButton();
    }
    const topRatedFilmsList = new FilmsListView(listTitles.TOP_RATED);
    render(cardListElement, topRatedFilmsList);
    const topRatedFilmsContainer = topRatedFilmsList.getElement().querySelector('.films-list__container');
    const mostCommentedFilmsList = new FilmsListView(listTitles.MOST_COMMENTED);
    render(cardListElement, mostCommentedFilmsList);
    const mostCommentedFilmsContainer = mostCommentedFilmsList.getElement().querySelector('.films-list__container');

    for (let j = 0; j < EXTRA_LIST_RENDER_COUNT; j++) {
      this._renderCard(topRatedFilmsContainer,this._cards[j+5]);
      this._renderCard(mostCommentedFilmsContainer, this._cards[j+7]);
    }
  }
}
