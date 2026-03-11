import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE, KEY } from './config';
// import { getJson, sendJson } from './helper';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  result: {
    query: '',
    page: 1,
    resultPerPage: RESULT_PER_PAGE,
    search: [],
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    title: recipe.title,
    id: recipe.id,
    publisher: recipe.publisher,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    imageUrl: recipe.image_url,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const loadSearchResult = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.query = query;
    state.result.search = data.data.recipes.map(rec => {
      return {
        title: rec.title,
        id: rec.id,
        publisher: rec.publisher,
        imageUrl: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.result.page = 1;
  } catch (er) {
    console.log(er);
  }
};
export const searchResult = function (page = state.result.page) {
  state.result.page = page;
  const start = (page - 1) * RESULT_PER_PAGE;
  const end = page * RESULT_PER_PAGE;
  return state.result.search.slice(start, end);
};
export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookMark = function (recipeBm) {
  state.bookmarks.push(state.recipe);

  //Mark as markeed
  if (recipeBm.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};
export const deleteBookMark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};
export const uploadeRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const data = ing[1].split(',').map(el => el.trim());
        if (data.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)',
          );
        const [quantity, unit, description] = data;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
console.log(state.bookmarks);
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

init();
