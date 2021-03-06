import {FilterMap, FilterType} from '../const.js';
import AbstractView from './abstract-view.js';

const LOW_RANK = 'Novice';
const MIDDLE_RANK = 'Fan';
const HIGH_RANK = 'Movie Buff';

const LOW_RANK_LIMIT = 0;
const MIDDLE_RANK_LIMIT = 10;
const HIGH_RANK_LIMIT = 20;

export const getRank = (cards) => {
  let rank = '';
  const watchedFilms = FilterMap[FilterType.HISTORY](cards);
  if (watchedFilms > LOW_RANK_LIMIT && watchedFilms <= MIDDLE_RANK_LIMIT) {
    rank = LOW_RANK;
  } else if (watchedFilms > MIDDLE_RANK_LIMIT && watchedFilms <= HIGH_RANK_LIMIT) {
    rank = MIDDLE_RANK;
  } else if (watchedFilms > HIGH_RANK_LIMIT) {
    rank = HIGH_RANK;
  }
  return rank;
};

export const createUserRankTemplate = (cards) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getRank(cards)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserRankView extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createUserRankTemplate(this._cards);
  }
}
