import {createCardTemplate, createCardListTemplate} from './view/card.js';
import {createMenuTemplate, createSortMenuTemplate, createStatsTemplate} from './view/menu.js';
import {createPopupTemplate} from './view/popup.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createUserRankTemplate} from './view/user-rank.js';
import {generateCard, CARDS_NUMBER} from './mock/data.js';

const LIST_RENDER_COUNT = 5;
const EXTRA_LIST_RENDER_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');
const footerStats = document.querySelector('.footer__statistics');

const cards = new Array(CARDS_NUMBER).fill(null).map(() => generateCard());

render(siteHeaderElement, createUserRankTemplate(cards), 'beforeend');
render(siteMainElement, createMenuTemplate(cards), 'beforeend');
render(siteMainElement, createSortMenuTemplate(), 'beforeend');
render(siteMainElement, createCardListTemplate(), 'beforeend');

const filmsListElement = siteMainElement.querySelector('.films-list');
const filmsListContainer = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(cards.length, LIST_RENDER_COUNT); i++) {
  render(filmsListContainer, createCardTemplate(cards[i]), 'beforeend');
}


if (cards.length > LIST_RENDER_COUNT) {
  let renderedCardsCount = LIST_RENDER_COUNT;
  render(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');
  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');
  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    cards
      .slice(renderedCardsCount, renderedCardsCount + LIST_RENDER_COUNT)
      .forEach((card) => render(filmsListContainer, createCardTemplate(card), 'beforeend'));

    renderedCardsCount += LIST_RENDER_COUNT;

    if (renderedCardsCount >= cards.length) {
      showMoreButton.remove();
    }
  });
}

const extraFilmsLists = document.querySelectorAll('.films-list--extra');
const topRatedFilmsList = extraFilmsLists[0];
const topRatedFilmsContainer = topRatedFilmsList.querySelector('.films-list__container');
const mostCommentedFilmsList = extraFilmsLists[1];
const mostCommentedFilmsContainer = mostCommentedFilmsList.querySelector('.films-list__container');

for (let j = 0; j < EXTRA_LIST_RENDER_COUNT; j++) {
  render(topRatedFilmsContainer, createCardTemplate(cards[j+5]), 'beforeend');
  render(mostCommentedFilmsContainer, createCardTemplate(cards[j+7]), 'beforeend');
}

render(footerStats, createStatsTemplate(cards), 'beforeend');
render(siteBodyElement, createPopupTemplate(cards[3]), 'beforeend');
