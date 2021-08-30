import CardView from '../view/card.js';
import PopupView from '../view/popup.js';
import {render, pushBodyElement, popBodyElement, remove, replace} from '../utils.js';

const popupMode = {
  OPENED: 'OPENED',
  CLOSED: 'CLOSED',
};

export default class CardPresenter {
  constructor(container, changeData, changeMode){
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._popupComponent = null;
    this._popupMode = popupMode.CLOSED;

    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleCardClose = this._handleCardClose.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);
    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
  }

  init(card) {
    this._card = card;

    const prevCardComponent = this._cardComponent;
    const prevPopupComponent = this._popupComponent;

    this._cardComponent = new CardView(card);
    this._popupComponent = new PopupView(card);

    this._cardComponent.setPosterClickHandler(this._handleCardClick);
    this._cardComponent.setTitleClickHandler(this._handleCardClick);
    this._cardComponent.setCommentsClickHandler(this._handleCardClick);
    this._cardComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);
    this._cardComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
    this._cardComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._popupComponent.setCloseButtonHandler(this._handleCardClose);
    this._popupComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);
    this._popupComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
    this._popupComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    if (prevCardComponent === null || prevPopupComponent === null) {
      render(this._container, this._cardComponent);
      return;
    }

    if (this._popupMode === popupMode.CLOSED) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._popupMode === popupMode.OPENED) {
      replace(this._cardComponent, prevCardComponent);
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevCardComponent);
    remove(prevPopupComponent);
  }

  resetView() {
    if (this._popupMode !== popupMode.CLOSED) {
      remove(this._popupComponent);
    }
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._popupComponent);
  }

  _handleEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      popBodyElement(this._popupComponent);
      this._popupMode = popupMode.CLOSED;
      document.removeEventListener('keydown', this._handleEscKeyDown);
    }
  }

  _handleCardClick () {
    pushBodyElement(this._popupComponent);
    document.addEventListener('keydown', this._handleEscKeyDown);
    this._changeMode();
    this._popupMode = popupMode.OPENED;
  }

  _handleCardClose() {
    popBodyElement(this._popupComponent);
    this._popupMode = popupMode.CLOSED;
    document.removeEventListener('keydown', this._handleEscKeyDown);
  }

  _handleAddToWatchListClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          isInWatchList: !this._card.isInWatchList,
        },
      ),
    );
  }

  _handleAlreadyWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          isAlreadyWatched: !this._card.isAlreadyWatched,
        },
      ),
    );
  }

  _handleAddToFavoritesClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          isInFavorites: !this._card.isInFavorites,
        },
      ),
    );
  }
}
