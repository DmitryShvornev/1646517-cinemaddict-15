import StatsView from './view/stats.js';
import UserRankView from './view/user-rank.js';
import {render, remove} from './utils.js';
import MovieListPresenter from './presenter/movie-list.js';
import MenuPresenter from './presenter/filter.js';
import MenuModel from './model/filters.js';
import MoviesModel from './model/movies.js';
import StatisticsView from './view/statistics.js';
import {MenuItem, UpdateType} from './const.js';
import CommentsModel from './model/comments.js';
import Api from './api.js';
import {END_POINT, AUTHORIZATION} from './const.js';


const api = new Api(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerStats = document.querySelector('.footer__statistics');

const cardsModel = new MoviesModel();
const commentsModel = new CommentsModel();

const menuModel = new MenuModel();
const menuPresenter = new MenuPresenter(siteMainElement, menuModel, cardsModel);
menuPresenter.init();
const moviePresenter = new MovieListPresenter(siteMainElement, cardsModel, menuModel, commentsModel, api);
//moviePresenter.init();


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
    commentsModel.setData(cards);

    render(siteHeaderElement, new UserRankView(cards));
    render(footerStats, new StatsView(cards));
  });

moviePresenter.init();
