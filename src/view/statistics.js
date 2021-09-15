import SmartView from './smart.js';
import {getRank} from './user-rank.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {cardsFilter} from '../model/filters.js';
import {FilterType} from '../const.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const BAR_HEIGHT = 50;
const MINUTES_PER_HOUR = 60;

const TimeFilterType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const makeItemsUniq = (items) => [...new Set(items)];

const countCardsByGenre = (cards, genre) => cards.filter((card) => card.genre === genre).length;

const countWatchedFilmsInDateRange = (cards, dateFrom, dateTo) => {
  if (dateFrom === null) {
    return cards.length;
  }
  let counter = 0;
  for (let i = 0; i < cards.length; i++) {
    if(dayjs(cards[i].watchingDate).isBetween(dateFrom, dateTo)) {
      counter++;
    }
  }
  return counter;
};

const getWatchedFilmsInDateRange = (cards, dateFrom, dateTo) =>
  cards.filter((card) => dayjs(card.watchingDate).isBetween(dateFrom, dateTo));

const calculateDate = (filter) => {
  let diff;
  switch (filter) {
    case TimeFilterType.ALL:
      return null;
    case TimeFilterType.TODAY:
      diff = 1;
      return dayjs().subtract(diff, 'day').toDate();
    case TimeFilterType.WEEK:
      diff = 6;
      return dayjs().subtract(diff, 'day').toDate();
    case TimeFilterType.MONTH:
      diff = 30;
      return dayjs().subtract(diff, 'day').toDate();
    case TimeFilterType.YEAR:
      diff = 365;
      return dayjs().subtract(diff, 'day').toDate();
  }
};

const processGenres = (cards) => {
  const genres = cards.map((card) => card.genre);
  const uniqGenres = makeItemsUniq(genres);
  const cardsByGenreCounts = uniqGenres.map((genre) => countCardsByGenre(cards, genre));
  const maxIndex = cardsByGenreCounts.findIndex((item) => item === Math.max(...cardsByGenreCounts));
  let maxGenre;
  if (cards.length === 0) {
    maxGenre = 'None';
  } else {
    maxGenre = uniqGenres[maxIndex];
  }

  return {
    cardLabels: uniqGenres,
    dataset: cardsByGenreCounts,
    topGenre: maxGenre,
  };
};

const countDuration = (cards) => {
  let totalMinutes = 0;
  for (let i = 0; i < cards.length; i++) {
    totalMinutes += Number(cards[i].duration.hours) * MINUTES_PER_HOUR;
    totalMinutes += Number(cards[i].duration.minutes);
  }
  const totalHours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const restMinutes = totalMinutes % MINUTES_PER_HOUR;
  return {
    hours: totalHours,
    minutes: restMinutes,
  };
};

const renderStatsChart = (statisticCtx, cards, dateFrom, dateTo) => {
  let cardsInDateRange = cards;
  if (dateFrom !== null) {
    cardsInDateRange = getWatchedFilmsInDateRange(cards, dateFrom, dateTo);
  }
  const {cardLabels, dataset} = processGenres(cardsInDateRange);
  statisticCtx.height = BAR_HEIGHT * dataset.length;
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: cardLabels,
      datasets: [{
        data: dataset,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const createStatsTemplate = (data) => {
  const {cards, dateFrom, dateTo} = data;
  let dataToProcess = cards;
  if (dateFrom !== null) {
    dataToProcess = getWatchedFilmsInDateRange(cards, dateFrom, dateTo);
  }
  const {topGenre} = processGenres(cardsFilter[FilterType.HISTORY](dataToProcess));
  const {hours, minutes} = countDuration(cardsFilter[FilterType.HISTORY](dataToProcess));
  const rank = getRank(cards);
  const watchedFilmsCount = countWatchedFilmsInDateRange(cardsFilter[FilterType.HISTORY](cards), dateFrom, dateTo);
  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rank}</span>
  </p>
  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" class="statistic__filters-label">Month</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedFilmsCount}<span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>
  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>
</section>`;
};

export default class StatisticsView extends SmartView {
  constructor(cards) {
    super();
    this._cards = cardsFilter[FilterType.HISTORY](cards);
    this._filterType = TimeFilterType.ALL;

    this._data = {
      cards,
      topGenre: '',
      dateFrom: calculateDate(this._filterType),
      dateTo: dayjs().toDate(),
    };
    this._chart = null;
    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._setInnerHandlers();
    this._setChart();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setChart();
    this._setInnerHandlers();
  }

  _filterClickHandler(evt) {
    const elementId = evt.target.htmlFor;
    this._filterType = this.getElement().querySelector(`[id=${elementId}]`).value;
    this.updateData({dateFrom: calculateDate(this._filterType)});
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.statistic__filters').addEventListener('click', this._filterClickHandler);
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }
    const {cards, dateFrom, dateTo} = this._data;
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = renderStatsChart(statisticCtx, cardsFilter[FilterType.HISTORY](cards), dateFrom, dateTo);
  }
}
