import CardView from './view/card.js';
import CardListView from './view/card-list.js';
import MenuView from './view/menu.js';
import SortMenuView from './view/sort-menu.js';
import StatsView from './view/stats.js';
import PopupView from './view/popup.js';
import ShowMoreButtonView from './view/show-more-button.js';
import UserRankView from './view/user-rank.js';
import {generateCard, CARDS_NUMBER} from './mock/data.js';
import {render, RenderPosition} from './utils.js';
import NoCardView from './view/no-card.js';
import FilmsListView from './view/films-list.js';

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
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      siteBodyElement.classList.remove('hide-overflow');
      siteBodyElement.removeChild(popupComponent.getElement());
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };
  const onCardClick = () => {
    siteBodyElement.classList.add('hide-overflow');
    siteBodyElement.appendChild(popupComponent.getElement());
    document.addEventListener('keydown', onEscKeyDown);
  };
  const onCardClose = () => {
    siteBodyElement.classList.remove('hide-overflow');
    siteBodyElement.removeChild(popupComponent.getElement());
    document.removeEventListener('keydown', onEscKeyDown);
  };
  cardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', onCardClick);
  cardComponent.getElement().querySelector('.film-card__title').addEventListener('click', onCardClick);
  cardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', onCardClick);
  popupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', onCardClose);
  render(cardListElement, cardComponent.getElement());
};

render(siteHeaderElement, new UserRankView(cards).getElement());
render(siteMainElement, new MenuView(cards).getElement());

const renderSite = (mainElement, cardsData) => {
  if (cardsData.length === 0) {
    return render(mainElement, new NoCardView.getElement(), RenderPosition.AFTER_BEGIN);
  }
  render(mainElement, new SortMenuView().getElement());
  render(mainElement, new CardListView().getElement());
  const cardListElement = mainElement.querySelector('.films');
  const filmsListElement = new FilmsListView('all').getElement();
  render(cardListElement, filmsListElement);
  const filmsListContainer = filmsListElement.querySelector('.films-list__container');

  for (let i = 0; i < Math.min(cardsData.length, LIST_RENDER_COUNT); i++) {
    renderCard(filmsListContainer, cardsData[i]);
  }


  if (cardsData.length > LIST_RENDER_COUNT) {
    let renderedCardsCount = LIST_RENDER_COUNT;
    const showMoreButton = new ShowMoreButtonView().getElement();
    render(filmsListElement, showMoreButton);
    const onShowMoreButtonClick = (evt) => {
      evt.preventDefault();
      cardsData
        .slice(renderedCardsCount, renderedCardsCount + LIST_RENDER_COUNT)
        .forEach((card) => renderCard(filmsListContainer, card));

      renderedCardsCount += LIST_RENDER_COUNT;

      if (renderedCardsCount >= cardsData.length) {
        showMoreButton.remove();
      }
    };
    showMoreButton.addEventListener('click', onShowMoreButtonClick);
  }

  const topRatedFilmsList = new FilmsListView('topRated').getElement();
  render(cardListElement, topRatedFilmsList);
  const topRatedFilmsContainer = topRatedFilmsList.querySelector('.films-list__container');
  const mostCommentedFilmsList = new FilmsListView('mostCommented').getElement();
  render(cardListElement, mostCommentedFilmsList);
  const mostCommentedFilmsContainer = mostCommentedFilmsList.querySelector('.films-list__container');

  for (let j = 0; j < EXTRA_LIST_RENDER_COUNT; j++) {
    renderCard(topRatedFilmsContainer,cardsData[j+5]);
    renderCard(mostCommentedFilmsContainer, cardsData[j+7]);
  }

  render(footerStats, new StatsView(cardsData).getElement());
};

renderSite(siteMainElement, cards);
