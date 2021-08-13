import CardView from './view/card.js';
import CardListView from './view/card-list.js';
import MenuView from './view/menu.js';
import SortMenuView from './view/sort-menu.js';
import StatsView from './view/stats.js';
import PopupView from './view/popup.js';
import ShowMoreButtonView from './view/show-more-button.js';
import UserRankView from './view/user-rank.js';
import {generateCard, CARDS_NUMBER} from './mock/data.js';
import {render} from './utils.js';

const LIST_RENDER_COUNT = 5;
const EXTRA_LIST_RENDER_COUNT = 2;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');
const footerStats = document.querySelector('.footer__statistics');

const cards = new Array(CARDS_NUMBER).fill(null).map(() => generateCard());

const renderCard = (cardListElement, card) => {
  const cardComponent = new CardView(card);
  const popupComponent = new PopupView(card);
  const onCardClick = () => {
    siteBodyElement.classList.add('hide-overflow');
    siteBodyElement.appendChild(popupComponent.getElement());
  };
  const onCardClose = () => {
    siteBodyElement.classList.remove('hide-overflow');
    siteBodyElement.removeChild(popupComponent.getElement());
  };
  cardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', onCardClick);
  cardComponent.getElement().querySelector('.film-card__title').addEventListener('click', onCardClick);
  cardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', onCardClick);
  popupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', onCardClose);
  render(cardListElement, cardComponent.getElement());
};

render(siteHeaderElement, new UserRankView(cards).getElement());
render(siteMainElement, new MenuView(cards).getElement());
render(siteMainElement, new SortMenuView().getElement());
render(siteMainElement, new CardListView().getElement());

const filmsListElement = siteMainElement.querySelector('.films-list');
const filmsListContainer = filmsListElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(cards.length, LIST_RENDER_COUNT); i++) {
  renderCard(filmsListContainer, cards[i]);
}


if (cards.length > LIST_RENDER_COUNT) {
  let renderedCardsCount = LIST_RENDER_COUNT;
  const showMoreButton = new ShowMoreButtonView().getElement();
  render(filmsListElement, showMoreButton);
  const onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    cards
      .slice(renderedCardsCount, renderedCardsCount + LIST_RENDER_COUNT)
      .forEach((card) => renderCard(filmsListContainer, card));

    renderedCardsCount += LIST_RENDER_COUNT;

    if (renderedCardsCount >= cards.length) {
      showMoreButton.remove();
    }
  };
  showMoreButton.addEventListener('click', onShowMoreButtonClick);
}

const extraFilmsLists = document.querySelectorAll('.films-list--extra');
const topRatedFilmsList = extraFilmsLists[0];
const topRatedFilmsContainer = topRatedFilmsList.querySelector('.films-list__container');
const mostCommentedFilmsList = extraFilmsLists[1];
const mostCommentedFilmsContainer = mostCommentedFilmsList.querySelector('.films-list__container');

for (let j = 0; j < EXTRA_LIST_RENDER_COUNT; j++) {
  renderCard(topRatedFilmsContainer,cards[j+5]);
  renderCard(mostCommentedFilmsContainer, cards[j+7]);
}

render(footerStats, new StatsView(cards).getElement());
