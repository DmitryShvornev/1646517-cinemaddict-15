import {createElement} from '../utils.js';

export const createFilmsListTemplate = (type) => {
  let extra = false;
  let header = '';
  switch (type) {
    case 'all':
      extra = false;
      header = 'All movies. Upcoming';
      break;
    case 'topRated':
      extra = true;
      header = 'Top rated';
      break;
    case 'mostCommented':
      extra = true;
      header = 'Most commented';
      break;
    default:
      break;
  }
  return `<section class="films-list ${extra ? 'films-list--extra' : ''}">
    <h2 class="films-list__title ${!extra ? 'visually-hidden' : ''}">${header}</h2>
    <div class="films-list__container">

    </div>
  </section>`;
};

export default class FilmsListView {
  constructor(type) {
    this._element = null;
    this._type = type;
  }

  getTemplate() {
    return createFilmsListTemplate(this._type);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
