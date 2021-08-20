import AbstractView from './abstract.js';

const createCommentsTemplate = ({comments}) => (comments.slice().map((comment) => `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${comment.text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${comment.author}</span>
      <span class="film-details__comment-day">${comment.date}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`).join(''));

export default class CommentsView extends AbstractView {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createCommentsTemplate(this._card);
  }
}
