import AbstractView from './abstract-view.js';

export const createFilmsListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container">

    </div>
  </section>`
);

export default class FilmsListView extends AbstractView {
  constructor(header) {
    super();
    this._header = header;
  }

  getTemplate() {
    return createFilmsListTemplate(this._header);
  }
}
