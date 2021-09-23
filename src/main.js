import StatsView from './view/stats-view.js';
import UserRankView from './view/user-rank-view.js';
import {render, remove} from './utils.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import MenuPresenter from './presenter/menu-presenter.js';
import MenuModel from './model/menu-model.js';
import MoviesModel from './model/movies-model.js';
import StatisticsView from './view/statistics-view.js';
import {MenuItem, UpdateType} from './const.js';
import CommentsModel from './model/comments-model.js';
import Api from './api.js';
import {END_POINT, AUTHORIZATION} from './const.js';


const api = new Api(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerStatsElement = document.querySelector('.footer__statistics');

const cardsModel = new MoviesModel();
const commentsModel = new CommentsModel();

const menuModel = new MenuModel();
const menuPresenter = new MenuPresenter(siteMainElement, menuModel, cardsModel);
menuPresenter.init();
const moviePresenter = new MovieListPresenter(siteMainElement, cardsModel, menuModel, commentsModel, api);
moviePresenter.init();


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

api.getCards()
  .then((cards) => {
    cardsModel.setCards(UpdateType.INIT, cards);
    render(siteHeaderElement, new UserRankView(cards));
    render(footerStatsElement, new StatsView(cards));
  });
