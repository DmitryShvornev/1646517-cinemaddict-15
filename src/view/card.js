import {createElement} from '../utils.js';

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


export default class CardView {
  constructor(card) {
    this._card = card;
    this._element = null;
  }

  getTemplate() {
    return createCardTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
