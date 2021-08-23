import AbstractView from './abstract.js';

export const createCardTemplate = (filmCard) => (`<article class="film-card">
  <h3 class="film-card__title">${filmCard.title}</h3>
  <p class="film-card__rating">${filmCard.rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${filmCard.year}</span>
    <span class="film-card__duration">${filmCard.duration}</span>
    <span class="film-card__genre">${filmCard.genre}</span>
  </p>
  <img src="./images/posters/${filmCard.poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${filmCard.description}</p>
  <a class="film-card__comments">${filmCard.commentsNumber} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`);


export default class CardView extends AbstractView {
  constructor(card) {
    super();
    this._card = card;
    this._posterClickHandler = this._posterClickHandler.bind(this);
    this._titleClickHandler = this._titleClickHandler.bind(this);
    this._commentsClickHandler = this._commentsClickHandler.bind(this);
  }

  getTemplate() {
    return createCardTemplate(this._card);
  }

  _posterClickHandler(evt) {
    evt.preventDefault();
    this._callback.posterClick();
  }

  _titleClickHandler(evt) {
    evt.preventDefault();
    this._callback.titleClick();
  }

  _commentsClickHandler(evt) {
    evt.preventDefault();
    this._callback.commentsClick();
  }

  setPosterClickHandler(callback) {
    this._callback.posterClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._posterClickHandler);
  }

  setTitleClickHandler(callback) {
    this._callback.titleClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._titleClickHandler);
  }

  setCommentsClickHandler(callback) {
    this._callback.commentsClick = callback;
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._commentsClickHandler);
  }
}
