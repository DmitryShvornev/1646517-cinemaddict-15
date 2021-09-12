import StatsView from './view/stats.js';
import UserRankView from './view/user-rank.js';
import {generateCard, CARDS_NUMBER} from './mock/data.js';
import {render} from './utils.js';
import MovieListPresenter from './presenter/movie-list.js';
import MenuPresenter from './presenter/filter.js';
import MenuModel from './model/filters.js';
import MoviesModel from './model/movies.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerStats = document.querySelector('.footer__statistics');

const cards = new Array(CARDS_NUMBER).fill(null).map(() => generateCard());
const cardsModel = new MoviesModel();
cardsModel.setCards(cards);

render(siteHeaderElement, new UserRankView(cards));
const menuModel = new MenuModel();
const menuPresenter = new MenuPresenter(siteMainElement, menuModel, cardsModel);
menuPresenter.init();


const moviePresenter = new MovieListPresenter(siteMainElement, cardsModel, menuModel);
moviePresenter.init();
render(footerStats, new StatsView(cards));
