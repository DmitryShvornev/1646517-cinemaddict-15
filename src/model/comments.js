import AbstractObserver from '../abstract-observer.js';

export default class CommentsModel extends AbstractObserver {
  constructor(cards) {
    super();
    this._cards = cards;
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
    update.comments = this._data[index];
    this._cards = [
      ...this._cards.slice(0, index),
      update,
      ...this._cards.slice(index + 1),
    ];
    this._notify(updateType, update);
  }

  deleteComment(updateType, update, innerUpdate) {
    const index = this._cards.findIndex((card) => card.id === update.id);
    const subIndex = this._data[index].findIndex((comment) => comment.id === innerUpdate.id);

    if (index === -1 || subIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._data[index] = [...this._data[index].slice(0, subIndex), ...this._data[index].slice(subIndex + 1)];
    update.comments = this._data[index];
    this._cards = [
      ...this._cards.slice(0, index),
      update,
      ...this._cards.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
