import {createElement} from '../utils.js';

const createCommentsTemplate = ({commentsNumber, comments}) => {
  const commentsTemplateList = new Array(commentsNumber).fill(null);
  for (let i = 0; i < commentsTemplateList.length; i++) {
    commentsTemplateList[i] = `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comments[i].emotion}.png" width="55" height="55" alt="emoji-${comments[i].emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comments[i].text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comments[i].author}</span>
          <span class="film-details__comment-day">${comments[i].date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>)`;
  }
  const commentsTemplate = commentsTemplateList.join('');
  return commentsTemplate;
};

export default class CommentsView {
  constructor(card) {
    this._element = null;
    this._card = card;
  }

  getTemplate() {
    return createCommentsTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
