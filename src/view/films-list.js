import AbstractView from './abstract.js';

export const listTitles = {
  ALL: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export const createFilmsListTemplate = (header) => {
  const extra = header !== listTitles.ALL;
  return `<section class="films-list ${extra && 'films-list--extra'}">
    <h2 class="films-list__title ${!extra ? 'visually-hidden' : ''}">${header}</h2>
    <div class="films-list__container">

    </div>
  </section>`;
};

export default class FilmsListView extends AbstractView {
  constructor(header) {
    super();
    this._header = header;
  }

  getTemplate() {
    return createFilmsListTemplate(this._header);
  }
}
