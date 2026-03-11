import * as model from '../js/model';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './view/recipeView';
import searchView from './view/searchView';
import resultView from './view/resultView';
import paginationView from './view/paginationView';
import bookmarksView from './view/bookmarksView';
import addRecipeView from './view/AddRecipeView';
import { MODEL_CLOSE_SEC } from './config';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }
// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io
///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    resultView.update(model.searchResult());
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (er) {
    recipeView.renderErrorMsg();
  }
};
const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);
    resultView.render(model.searchResult());

    paginationView.render(model.state.result);
  } catch (er) {
    console.log(er);
  }
};
const controlPagination = function (goToPage) {
  resultView.render(model.searchResult(goToPage));

  paginationView.render(model.state.result);
};
const controlServing = function (newNumber) {
  model.updateServing(newNumber);
  recipeView.update(model.state.recipe);
};
const controlBookMark = function () {
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarksStorage = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRec) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadeRecipe(newRec);

    // recnder recipe
    recipeView.render(model.state.recipe);
    // render bookmar
    bookmarksView.render(model.state.bookmarks);

    // change id in ur url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // succes msg
    addRecipeView.renderMsg();

    // close window form
    setTimeout(function () {
      addRecipeView.toggleAppearnce();
    }, MODEL_CLOSE_SEC);
  } catch (err) {
    console.log('🔥', err);
    addRecipeView.renderErrorMsg(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarksStorage);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServing(controlServing);
  recipeView.addHandlerBookmark(controlBookMark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerButton(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
