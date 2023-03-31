import { configureStore } from '@reduxjs/toolkit';
import { tmdbApi } from '../services/TMDB';

import genreOrCategoryReducer from '../features/currentGenreOrCategory';

export default configureStore({
  reducer: {
    // add the generated reducer as a specific top level slice
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    currentGenreOrCategory: genreOrCategoryReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tmdbApi.middleware)
});
