import AbstractObserver from '../abstract-observer.js';

export default class CommentsModel extends AbstractObserver {
  constructor(cards) {
    super();
    this._data = cards.slice().map((card) => card.comments);
  }

  setData(cards) {
    this._data = cards.slice().map((card) => card.comments);
  }

  getData() {
    return this._data;
  }

  addComment(updateType, update, innerUpdate) {
    const index = this._cards.findIndex((card) => card.id === update.id);
    this._data[index] = [...this._data[index], innerUpdate];
    this._notify(updateType);
  }

  deleteComment(updateType, update, innerUpdate) {
    const index = this._cards.findIndex((card) => card.id === update.id);
    const subIndex = this._data[index].findIndex((comment) => comment.id === innerUpdate.id);

    if (index === -1 || subIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._data[index] = [...this._data[index].slice(0, subIndex), ...this._data[index].slice(subIndex + 1)];

    this._notify(updateType);
  }
}
