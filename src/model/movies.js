import AbstractObserver from '../abstract-observer.js';

export default class MoviesModel extends AbstractObserver {
  constructor() {
    super();
    this._cards = [];
  }

  setCards(cards) {
    this._cards = cards.slice();
  }

  getCards() {
    return this._cards;
  }

  updateCard(updateType, update) {
    const index = this._cards.findIndex((card) => card.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }
    this._cards[index] = update;
    this._notify(updateType, update);
  }

  addCard(updateType, update) {
    this._cards.unshift(update);
    this._notify(updateType, update);
  }

  deleteCard(updateType, update) {
    const index = this._cards.findIndex((card) => card.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting card');
    }
    this._cards = this._cards.filter(({id}) => id !== index);
    this._notify(updateType);
  }
}
