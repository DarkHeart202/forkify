import MainView from './mainView';
import icons from 'url:../../img/icons.svg';
class AddRecipeView extends MainView {
  _parentElement = document.querySelector('.upload');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnUploade = document.querySelector('.upload__btn');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _message = 'Recipe was successfully uploaded :)';
  constructor() {
    super();
    this._addHandlerOpen();
    this._addHandlerClose();
  }
  _addHandlerOpen() {
    this._btnOpen.addEventListener('click', this.toggleAppearnce.bind(this));
  }
  _addHandlerClose() {
    [this._btnClose, this._overlay].forEach(e =>
      e.addEventListener('click', this.toggleAppearnce.bind(this)),
    );
  }
  toggleAppearnce() {
    [this._window, this._overlay].forEach(e => e.classList.toggle('hidden'));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      console.log(dataArr);
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}
export default new AddRecipeView();
