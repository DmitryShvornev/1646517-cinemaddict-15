import CardView from '../view/card.js';
import PopupView from '../view/popup.js';
import {render, pushBodyElement, popBodyElement, remove, replace} from '../utils.js';
import {UserAction, UpdateType} from '../const.js';
import dayjs from 'dayjs';

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
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleAddCommentClick = this._handleAddCommentClick.bind(this);
    this._handlePopupAddToFavoritesClick = this._handlePopupAddToFavoritesClick.bind(this);
    this._handlePopupAddToWatchListClick = this._handlePopupAddToWatchListClick.bind(this);
    this._handlePopupAlreadyWatchedClick = this._handlePopupAlreadyWatchedClick.bind(this);
  }

  init(card, comments) {
    this._card = card;

    const prevCardComponent = this._cardComponent;
    const prevPopupComponent = this._popupComponent;

    this._cardComponent = new CardView(card);
    this._popupComponent = new PopupView(card, comments);

    this._cardComponent.setPosterClickHandler(this._handleCardClick);
    this._cardComponent.setTitleClickHandler(this._handleCardClick);
    this._cardComponent.setCommentsClickHandler(this._handleCardClick);
    this._cardComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);
    this._cardComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
    this._cardComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._popupComponent.setCloseButtonHandler(this._handleCardClose);
    this._popupComponent.setAddToFavoritesClickHandler(this._handlePopupAddToFavoritesClick);
    this._popupComponent.setAddToWatchListClickHandler(this._handlePopupAddToWatchListClick);
    this._popupComponent.setAlreadyWatchedClickHandler(this._handlePopupAlreadyWatchedClick);
    this._popupComponent.setDeleteClickHandler(this._handleDeleteCommentClick);
    this._popupComponent.setAddCommentHandler(this._handleAddCommentClick);
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

  getPopupComponent() {
    return this._popupComponent;
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
    this._changeData(UserAction.UPDATE_CARD, UpdateType.MINOR, {...this._card, isInWatchList: !this._card.isInWatchList});
  }

  _handleAlreadyWatchedClick() {
    this._changeData(UserAction.UPDATE_CARD, UpdateType.MINOR, {...this._card, isAlreadyWatched: !this._card.isAlreadyWatched, watchingDate: dayjs()});
  }

  _handleAddToFavoritesClick() {
    this._changeData(UserAction.UPDATE_CARD, UpdateType.MINOR, {...this._card, isInFavorites: !this._card.isInFavorites});
  }

  _handlePopupAddToWatchListClick() {
    this._changeData(UserAction.UPDATE_CARD, UpdateType.PATCH, {...this._card, isInWatchList: !this._card.isInWatchList});
  }

  _handlePopupAlreadyWatchedClick() {
    this._changeData(UserAction.UPDATE_CARD, UpdateType.PATCH, {...this._card, isAlreadyWatched: !this._card.isAlreadyWatched, watchingDate: dayjs()});
  }

  _handlePopupAddToFavoritesClick() {
    this._changeData(UserAction.UPDATE_CARD, UpdateType.PATCH, {...this._card, isInFavorites: !this._card.isInFavorites});
  }

  _handleAddCommentClick(comment) {
    this._changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, {...this._card}, comment);
  }

  _handleDeleteCommentClick(comment) {
    this._changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, {...this._card}, comment);
  }
}
