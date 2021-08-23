import AbstractView from './abstract.js';

const createControlsTemplate = (filmCard) => (
  `<button type="button" class="film-details__control-button ${filmCard.isInWatchList ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
  <button type="button" class="film-details__control-button ${filmCard.isAlreadyWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
  <button type="button" class="film-details__control-button ${filmCard.isInFavorites ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>`
);

export default class PopupControlsView extends AbstractView {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createControlsTemplate(this._card);
  }
}
