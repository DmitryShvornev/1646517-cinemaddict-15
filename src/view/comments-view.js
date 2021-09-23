import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const createCommentsTemplate = (comments) => {
  const commentsItems = comments.map((item) => `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-${item.emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${item.comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${item.author}</span>
      <span class="film-details__comment-day">${dayjs(item.date).fromNow()}</span>
      <button class="film-details__comment-delete" data-comment-id=${item.id}>Delete</button>
    </p>
  </div>
</li>`).join('');
  return `<ul class="film-details__comments-list">${commentsItems}</ul>`;
};

export default class CommentsView extends AbstractView {
  constructor(comments) {
    super();
    this._comments = comments;
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }
}
