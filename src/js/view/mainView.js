import icons from 'url:../../img/icons.svg';
export default class MainView {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMsg();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      // console.log(this._data);
      // Update changed text
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currEl.textContent = newEl.textContent;
      }

      //update changed attr
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value),
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
         <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderErrorMsg(message = this._errorMsg) {
    const markup = `
              <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMsg(message = this._message) {
    const markup = `
            <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }
}
