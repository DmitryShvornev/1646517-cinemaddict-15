import AbstractObserver from '../abstract-observer.js';

export default class CommentsModel extends AbstractObserver {
  constructor() {
    super();
    this._data = {};
  }

  pushData(id, items) {
    this._data[id] = items;
  }

  getData() {
    return this._data;
  }

  addComment(updateType, update, innerUpdate) {
    const index = update.id;
    this._data[index].push(innerUpdate);
    this._notify(updateType, update);
  }

  deleteComment(updateType, update, innerUpdate) {
    const index = update.id;
    const subIndex = this._data[index].findIndex(({id}) => id === innerUpdate.id);
    this._data[index] = [...this._data[index].slice(0, subIndex), ...this._data[index].slice(subIndex + 1)];
    const indexOfDeletedId = update.comments.findIndex((item) => item === innerUpdate.id);
    update.comments = [...update.comments.slice(0, indexOfDeletedId), ...update.comments.slice(indexOfDeletedId + 1)];
    this._notify(updateType, update);
  }
}
