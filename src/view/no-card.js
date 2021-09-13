import AbstractView from './abstract.js';
import {FilterType} from '../const.js';

const NoCardsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoCardTemplate = (data) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${NoCardsTextType[data]}</h2>
    </section>
  </section>`
);

export default class NoCardView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoCardTemplate(this._data);
  }
}
