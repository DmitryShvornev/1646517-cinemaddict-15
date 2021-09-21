import CardView from '../view/card.js';
import PopupView from '../view/popup.js';
import CommentsView from '../view/comments.js';
import Api from '../api.js';
import {END_POINT, AUTHORIZATION} from '../const.js';
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
    this._api = new Api(END_POINT, AUTHORIZATION);

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

  init(card, commentsModel) {
    this._card = card;

    const prevCardComponent = this._cardComponent;
    const prevPopupComponent = this._popupComponent;
    this._commentsModel = commentsModel;
    this._cardComponent = new CardView(card);
    this._popupComponent = new PopupView(card, this._commentsModel);

    this._cardComponent.setPosterClickHandler(this._handleCardClick);
    this._cardComponent.setTitleClickHandler(this._handleCardClick);
    this._cardComponent.setCommentsClickHandler(this._handleCardClick);
    this._cardComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);
    this._cardComponent.setAddToWatchListClickHandler(this._handleAddToWatchListClick);
    this._cardComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);

    if (this._commentsModel.getData()[this._card.id]) {
      const commentsElement = new CommentsView(this._commentsModel.getData()[this._card.id]).getElement();
      const oldCommentsElement = this._popupComponent.getElement().querySelector('.film-details__comments-list');
      replace(commentsElement, oldCommentsElement);
    }

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
    this._api.getComments(this._card.id).then((comments) => {
      document.addEventListener('keydown', this._handleEscKeyDown);
      const commentsElement = new CommentsView(comments).getElement();
      const oldCommentsElement = this._popupComponent.getElement().querySelector('.film-details__comments-list');
      replace(commentsElement, oldCommentsElement);
      this._commentsModel.pushData(this._card.id, comments);
      this._changeMode();
      this._popupMode = popupMode.OPENED;
      this._popupComponent.restoreHandlers();
      pushBodyElement(this._popupComponent);
    });
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
