import AbstractView from './abstract-view.js';

export const createCardListTemplate = () => (
  `<section class="films">
  </section>`);

export default class CardListView extends AbstractView {
  getTemplate() {
    return createCardListTemplate();
  }
}
