import SortMenuView from '../view/sort-menu.js';
import CardListView from '../view/card-list.js';
import NoCardView from '../view/no-card.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import {render, RenderPosition, pushBodyElement, popBodyElement} from '../utils.js';
import CardView from '../view/card.js';
import PopupView from '../view/popup.js';
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
  }

  init(cards) {
    this._cards = cards.slice();
    this._renderMovieList();
  }

  _renderSortMenu(){
    render(this._container, this._sortComponent);
  }

  _renderCard(cardListElement, card) {
    const cardComponent = new CardView(card);
    const popupComponent = new PopupView(card);
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        popBodyElement(popupComponent);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    const onCardClick = () => {
      pushBodyElement(popupComponent);
      document.addEventListener('keydown', onEscKeyDown);
    };
    const onCardClose = () => {
      popBodyElement(popupComponent);
      document.removeEventListener('keydown', onEscKeyDown);
    };
    cardComponent.setPosterClickHandler(onCardClick);
    cardComponent.setTitleClickHandler(onCardClick);
    cardComponent.setCommentsClickHandler(onCardClick);
    popupComponent.setCloseButtonHandler(onCardClose);
    render(cardListElement, cardComponent);
  }

  _renderCardList() {
    render(this._container, this._cardListComponent);
  }

  _renderNoCard() {
    render(this._container, this._noCardComponent, RenderPosition.AFTER_BEGIN);
  }

  _renderShowMoreButton(listContainer) {
    let renderedCardsCount = LIST_RENDER_COUNT;
    const showMoreButton = new ShowMoreButtonView();
    const onShowMoreButtonClick = () => {
      this._cards
        .slice(renderedCardsCount, renderedCardsCount + LIST_RENDER_COUNT)
        .forEach((card) => this._renderCard(listContainer, card));

      renderedCardsCount += LIST_RENDER_COUNT;

      if (renderedCardsCount >= this._cards.length) {
        showMoreButton.getElement().remove();
      }
    };
    showMoreButton.setClickHandler(onShowMoreButtonClick);
    render(this._filmsListComponent.getElement(), showMoreButton);
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
      this._renderShowMoreButton(filmsListContainer);
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
