import SmartView from './smart.js';
import CommentsView from './comments.js';
import PopupControlsView from './popup-controls.js';

const EMOJI_SIZE = 55;

const createEmojiTemplate = (value) => {
  const emoji = document.createElement('img');
  emoji.width = EMOJI_SIZE;
  emoji.height = EMOJI_SIZE;
  emoji.src = `./images/emoji/${value}.png`;
  return emoji;
};

export const createPopupTemplate = (filmCard) => {
  const popupControlsTemplate = new PopupControlsView(filmCard).getTemplate();
  const commentsTemplate = new CommentsView(filmCard).getTemplate();
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${filmCard.poster}" alt="">

          <p class="film-details__age">${filmCard.age}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmCard.title}</h3>
              <p class="film-details__title-original">Original: ${filmCard.title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmCard.rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmCard.details.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmCard.details.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmCard.details.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${filmCard.details.releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${filmCard.duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmCard.details.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${filmCard.genre}</span>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${filmCard.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        ${popupControlsTemplate}
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmCard.commentsNumber}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class PopupView extends SmartView {
  constructor(card) {
    super();
    this._card = card;
    this._closeButtonHandler = this._closeButtonHandler.bind(this);
    this._addToFavoritesClickHandler = this._addToFavoritesClickHandler.bind(this);
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._card);
  }

  _closeButtonHandler(evt) {
    evt.preventDefault();
    this._callback.closeButton();
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchListClick();
  }

  _alreadyWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  _addToFavoritesClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToFavoritesClick();
  }

  _emojiClickHandler(evt) {
    const selectedEmojiContainer = document.querySelector('.film-details__add-emoji-label');
    selectedEmojiContainer.innerHTML = '';
    if (evt.target.matches('input')) {
      selectedEmojiContainer.appendChild(createEmojiTemplate(evt.target.value));
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('click', this._emojiClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseButtonHandler(this._callback.closeButton);
    this.setAddToFavoritesClickHandler(this._callback.addToFavoritesClick);
    this.setAddToWatchListClickHandler(this._callback.addToWatchListClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
  }

  setInnerHandlers() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('click', this._emojiClickHandler);
  }

  setCloseButtonHandler(callback) {
    this._callback.closeButton = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeButtonHandler);
  }

  setAddToWatchListClickHandler(callback) {
    this._callback.addToWatchListClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._addToWatchListClickHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._alreadyWatchedClickHandler);
  }

  setAddToFavoritesClickHandler(callback) {
    this._callback.addToFavoritesClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._addToFavoritesClickHandler);
  }
}
