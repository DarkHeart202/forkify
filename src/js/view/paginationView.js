import MainView from './mainView';
import icons from 'url:../../img/icons.svg';
class PaginationView extends MainView {
  _parentElement = document.querySelector('.pagination');
  addHandlerButton(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currPage = this._data.page;
    const numPage = Math.ceil(
      this._data.search.length / this._data.resultPerPage,
    );

    //Page 1, and there are other pages
    if (this._data.page === 1 && numPage > 1) {
      return `
          <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> 
        `;
    }
    //last page
    if (currPage === numPage && numPage > 1) {
      return `
        <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>;
        `;
    }
    //other pages
    if (currPage < numPage) {
      return `
        <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>;
        <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>

        `;
    }
    //Page 1, and there are no other pages
    return ' ';
  }
}
export default new PaginationView();
