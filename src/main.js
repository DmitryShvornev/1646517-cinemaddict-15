import {createCardTemplate, createCardListTemplate} from './view/card.js';
import {createMenuTemplate, createSortMenuTemplate, createStatsTemplate} from './view/menu.js';
import {createPopupTemplate} from './view/popup.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createUserRankTemplate} from './view/user-rank.js';

const LIST_RENDER_COUNT = 5;
const EXTRA_LIST_RENDER_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');
const footerStats = document.querySelector('.footer__statistics');

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(), 'beforeend');
render(siteMainElement, createSortMenuTemplate(), 'beforeend');
render(siteMainElement, createCardListTemplate(), 'beforeend');

const filmsListElement = siteMainElement.querySelector('.films-list');
const filmsListContainer = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < LIST_RENDER_COUNT; i++) {
  render(filmsListContainer, createCardTemplate(), 'beforeend');
}

render(filmsListElement, createShowMoreButtonTemplate(), 'beforeend');

const extraFilmsLists = document.querySelectorAll('.films-list--extra');
const topRatedFilmsList = extraFilmsLists[0];
const topRatedFilmsContainer = topRatedFilmsList.querySelector('.films-list__container');
const mostCommentedFilmsList = extraFilmsLists[1];
const mostCommentedFilmsContainer = mostCommentedFilmsList.querySelector('.films-list__container');

for (let j = 0; j < EXTRA_LIST_RENDER_COUNT; j++) {
  render(topRatedFilmsContainer, createCardTemplate(), 'beforeend');
  render(mostCommentedFilmsContainer, createCardTemplate(), 'beforeend');
}

render(footerStats, createStatsTemplate(), 'beforeend');
render(siteBodyElement, createPopupTemplate(), 'beforeend');
