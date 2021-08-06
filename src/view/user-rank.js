import {cardsToFilterMap} from './menu.js';

export const createUserRankTemplate = (cards) => {
  let rank = '';
  const watchedFilms = cardsToFilterMap.history(cards);
  if (watchedFilms > 0 && watchedFilms <= 10) {
    rank = 'Novice';
  } else if (watchedFilms > 10 && watchedFilms <= 20) {
    rank = 'Fan';
  } else if (watchedFilms > 20) {
    rank = 'Movie Buff';
  }
  return `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
