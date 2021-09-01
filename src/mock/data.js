import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

export const CARDS_NUMBER = 17;

const TITLES = [
  'Made for each other',
  'Popeye meets Sindbad',
  'Sagebrush trail',
  'Santa Claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with golden arm',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
];

const GENRES = [
  'Comedy',
  'Mystery',
  'Drama',
  'Cartoon',
  'Western',
  'Musical',
];

const AGES = [0, 6, 12, 18];

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const COUNTRIES = [
  'USA',
  'Russia',
  'Italy',
  'France',
  'Germany',
  'Poland',
  'England',
  'Brazil',
  'Turkey',
  'India',
];

const NAMES = [
  'Jim Morrison',
  'Hugh Jackman',
  'Tim Macoveev',
  'Jesse Spencer',
  'Alisher Morgenstern',
];

const getRandomInteger = (first = 0, last = 1) => {
  const lower = Math.ceil(Math.min(first, last));
  const upper = Math.floor(Math.max(first, last));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloat = (first = 5.0, last = 10.0, fractionDegree = 1) => {
  const lower = Math.min(first, last);
  const upper = Math.max(first, last);
  return Math.floor(lower + Math.random() * (upper - lower)).toFixed(fractionDegree);
};

const getRandomArrayElement = (elements) => (elements[getRandomInteger(0, elements.length - 1)]);

const generateCardDetails = () => {
  const maxYearsGap = 7;
  const yearsGap = getRandomInteger(-2 * maxYearsGap, -maxYearsGap);
  return {
    director: getRandomArrayElement(NAMES),
    writers: getRandomArrayElement(NAMES),
    actors: getRandomArrayElement(NAMES),
    releaseDate: `${dayjs().add(yearsGap, 'years').format('D MMMM YYYY')}`,
    country: getRandomArrayElement(COUNTRIES),
  };
};

const generateComment = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const date = dayjs().add(daysGap, 'day').format('D MMMM YYYY');
  return {
    text: getRandomArrayElement(DESCRIPTIONS),
    emotion: getRandomArrayElement(EMOTIONS),
    author: getRandomArrayElement(NAMES),
    date,
  };
};

const generateCommentsList = (number) => {
  const commentsList = new Array(number).fill().map(() => generateComment());
  return commentsList;
};

export const generateCard = () => {
  const isInWatchList = getRandomInteger() === 0;
  const commentsNumber =  getRandomInteger(1,100);
  return {
    id: nanoid(),
    poster: getRandomArrayElement(POSTERS),
    title: getRandomArrayElement(TITLES),
    rating: getRandomFloat(),
    year: getRandomInteger(1931, 2021),
    description: getRandomArrayElement(DESCRIPTIONS),
    duration: `${getRandomInteger(1,3)}h ${getRandomInteger(0,59)}m`,
    commentsNumber,
    comments: generateCommentsList(commentsNumber),
    genre: getRandomArrayElement(GENRES),
    isInWatchList,
    isAlreadyWatched: !isInWatchList,
    isInFavorites: !isInWatchList,
    age: getRandomArrayElement(AGES),
    details: generateCardDetails(),
  };
};
