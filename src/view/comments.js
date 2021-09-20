import AbstractView from './abstract.js';

const createCommentsTemplate = (comments) => (comments.map((item) => `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-${item.emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${item.comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${item.author}</span>
      <span class="film-details__comment-day">${item.date}</span>
      <button class="film-details__comment-delete" data-comment-id=${item.id}>Delete</button>
    </p>
  </div>
</li>`).join(''));

export default class CommentsView extends AbstractView {
  constructor(comments) {
    super();
    this._comments = comments;
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }
}
