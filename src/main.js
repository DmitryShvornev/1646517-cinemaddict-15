import MenuView from './view/menu.js';
import StatsView from './view/stats.js';
import UserRankView from './view/user-rank.js';
import {generateCard, CARDS_NUMBER} from './mock/data.js';
import {render} from './utils.js';
import MovieListPresenter from './presenter/movie-list.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const footerStats = document.querySelector('.footer__statistics');

const cards = new Array(CARDS_NUMBER).fill(null).map(() => generateCard());

render(siteHeaderElement, new UserRankView(cards));
render(siteMainElement, new MenuView(cards));

const moviePresenter = new MovieListPresenter(siteMainElement);
moviePresenter.init(cards);
render(footerStats, new StatsView(cards));
