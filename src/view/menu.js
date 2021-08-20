import AbstractView from './abstract.js';

export const cardsToFilterMap = {
  all: (cards) => cards.length,
  watchlist: (cards) => cards.filter((card) => card.isInWatchList).length,
  history: (cards) => cards.filter((card) => card.isAlreadyWatched).length,
  favorites: (cards) => cards.filter((card) => card.isInFavorites).length,
};

export const createMenuTemplate = (cards) => (`<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${cardsToFilterMap.watchlist(cards)}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${cardsToFilterMap.history(cards)}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${cardsToFilterMap.favorites(cards)}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`);


export default class MenuView extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createMenuTemplate(this._cards);
  }
}
