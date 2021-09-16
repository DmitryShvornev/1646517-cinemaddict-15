import StatsView from './view/stats.js';
import UserRankView from './view/user-rank.js';
import {generateCard, CARDS_NUMBER} from './mock/data.js';
import {render, remove} from './utils.js';
import MovieListPresenter from './presenter/movie-list.js';
import MenuPresenter from './presenter/filter.js';
import MenuModel from './model/filters.js';
import MoviesModel from './model/movies.js';
import StatisticsView from './view/statistics.js';
import {MenuItem} from './const.js';
import CommentsModel from './model/comments.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerStats = document.querySelector('.footer__statistics');

const cards = new Array(CARDS_NUMBER).fill(null).map(() => generateCard());
const cardsModel = new MoviesModel();
cardsModel.setCards(cards);
const commentsModel = new CommentsModel();
commentsModel.setData(cards);

render(siteHeaderElement, new UserRankView(cards));
const menuModel = new MenuModel();
const menuPresenter = new MenuPresenter(siteMainElement, menuModel, cardsModel);
menuPresenter.init();


const moviePresenter = new MovieListPresenter(siteMainElement, cardsModel, menuModel, commentsModel);
moviePresenter.init();
render(footerStats, new StatsView(cards));

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILTER:
      if (statisticsComponent) {
        remove(statisticsComponent);
      }
      moviePresenter.destroy();
      moviePresenter.init();
      break;
    case MenuItem.STATS:
      moviePresenter.destroy();
      statisticsComponent = new StatisticsView(cardsModel.getCards());
      render(siteMainElement, statisticsComponent);
  }
};

menuPresenter.setMenuHandler(handleSiteMenuClick);
