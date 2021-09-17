import AbstractObserver from '../abstract-observer.js';
import {MINUTES_PER_HOUR} from '../view/statistics.js';

export default class MoviesModel extends AbstractObserver {
  constructor() {
    super();
    this._cards = [];
  }

  setCards(updateType, cards) {
    this._cards = cards.slice();
    this._notify(updateType);
  }

  getCards() {
    return this._cards;
  }

  updateCard(updateType, update) {
    const index = this._cards.findIndex((card) => card.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }
    this._cards[index] = update;
    this._notify(updateType, update);
  }

  addCard(updateType, update) {
    this._cards.unshift(update);
    this._notify(updateType, update);
  }

  deleteCard(updateType, update) {
    const index = this._cards.findIndex((card) => card.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting card');
    }
    this._cards = this._cards.filter(({id}) => id !== index);
    this._notify(updateType);
  }

  static adaptToClient(card) {
    const adaptedCard = Object.assign(
      {},
      card,
      {
        title: card['film_info']['title'],
        original: card['film_info']['alternative_title'],
        rating: card['film_info']['total_rating'],
        poster: card['film_info']['poster'],
        age: card['film_info']['age_rating'],
        details: {
          director: card['film_info']['director'],
          writers: `${card['film_info']['writers']}`,
          actors: `${card['film_info']['actors']}`,
          releaseDate: card['film_info']['release']['date'],
          country: card['film_info']['release']['release_country'],
        },
        duration : {
          hours: Math.floor(card['film_info']['runtime'] / MINUTES_PER_HOUR),
          minutes: card['film_info']['runtime'] % MINUTES_PER_HOUR,
        },
        genre: `${card['film_info']['genre']}`,
        description: card['film_info']['description'],
        isInWatchList: card['user_details']['watchlist'],
        isAlreadyWatched: card['user_details']['already_watched'],
        isInFavorites: card['user_details']['favorite'],
        watchingDate: new Date(card['user_details']['watching_date']),
      },
    );

    delete adaptedCard['film_info']['title'];
    delete adaptedCard['film_info']['alternative_title'];
    delete adaptedCard['film_info']['total_rating'];
    delete adaptedCard['film_info']['poster'];
    delete adaptedCard['film_info']['age_rating'];
    delete adaptedCard['film_info']['director'];
    delete adaptedCard['film_info']['writers'];
    delete adaptedCard['film_info']['actors'];
    delete adaptedCard['film_info']['release']['date'];
    delete adaptedCard['film_info']['release']['release_country'];
    delete adaptedCard['film_info']['runtime'];
    delete adaptedCard['film_info']['genre'];
    delete adaptedCard['film_info']['description'];
    delete adaptedCard['user_details']['watchlist'];
    delete adaptedCard['user_details']['already_watched'];
    delete adaptedCard['user_details']['favorite'];
    delete adaptedCard['user_details']['watching_date'];

    return adaptedCard;
  }

  static adaptToServer(card) {
    const adaptedCard = Object.assign(
      {},
      card,
      {
        'film_info': {
          'title': card.title,
          'alternative_title': card.original,
          'total_rating': card.rating,
          'poster': card.poster,
          'age_rating': card.age,
          'director': card.details.director,
          'writers': card.details.writers,
          'actors': card.details.actors,
          'release': {
            'date': card.details.releaseDate,
            'release_country': card.details.country,
          },
          'runtime': card.duration.hours * MINUTES_PER_HOUR + card.duration.minutes,
          'genre': card.genre,
          'description': card.description,
        },
        'user_details': {
          'watchlist': card.isInWatchList,
          'already_watched': card.isAlreadyWatched,
          'watching_date': card.watchingDate.toISOString(),
          'favorite': card.isInFavorites,
        },
      },
    );


    delete adaptedCard.title;
    delete adaptedCard.original;
    delete adaptedCard.rating;
    delete adaptedCard.poster;
    delete adaptedCard.age;
    delete adaptedCard.details.director;
    delete adaptedCard.details.writers;
    delete adaptedCard.details.actors;
    delete adaptedCard.details.releaseDate;
    delete adaptedCard.details.country;
    delete adaptedCard.description;
    delete adaptedCard.isInWatchList;
    delete adaptedCard.isAlreadyWatched;
    delete adaptedCard.watchingDate;
    delete adaptedCard.isInFavorites;
    delete adaptedCard.duration;

    return adaptedCard;
  }
}
