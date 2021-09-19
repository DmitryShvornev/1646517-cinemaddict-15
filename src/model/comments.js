import AbstractObserver from '../abstract-observer.js';
import Api from '../api.js';
import {END_POINT, AUTHORIZATION} from '../const.js';

export default class CommentsModel extends AbstractObserver {
  constructor() {
    super();
    this._data = [];
  }

  setData(cards) {
    this._cards = cards.slice();
    const comments = [];
    const api = new Api(END_POINT, AUTHORIZATION);
    cards.forEach((card) => api.getComments(card.id).then((items) => comments.push(items)));
    this._data = comments;
  }

  getData() {
    return this._data;
  }

  getCards() {
    return this._cards;
  }

  addComment(updateType, update, innerUpdate) {
    const index = this._cards.findIndex((card) => card.id === update.id);
    this._data[index] = [...this._data[index], innerUpdate];
    update.comments = this._data[index];
    this._cards[index] = update;
    this._notify(updateType, update);
  }

  deleteComment(updateType, update, innerUpdate) {
    const index = this._cards.findIndex((card) => card.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete comment from unexisting card');
    }
    const subIndex = this._data[index].findIndex((comment) => comment.id === innerUpdate.id);
    if (subIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }
    this._data[index] = [...this._data[index].slice(0, subIndex), ...this._data[index].slice(subIndex + 1)];
    update.comments = this._data[index];
    this._cards[index] = update;

    this._notify(updateType, update);
  }
}
