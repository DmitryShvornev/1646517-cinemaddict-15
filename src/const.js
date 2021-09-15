export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const UserAction = {
  UPDATE_CARD: 'UPDATE_CARD',
  ADD_CARD: 'ADD_CARD',
  DELETE_CARD: 'DELETE_CARD',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const RenderPosition = {
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
};

export const FilterMap = {
  [FilterType.ALL]: (cards) => cards.length,
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.isInWatchList).length,
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.isAlreadyWatched).length,
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.isInFavorites).length,
};

export const MenuItem = {
  FILTER: 'FILTER',
  STATS: 'STATS',
};
