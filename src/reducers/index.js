import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import posts, * as fromPosts from './posts';
import authReducer, * as fromAuth from './auth';

const app = combineReducers({
  posts,
  auth: authReducer,

    // form
  form: formReducer,

    // routing
  routing: routerReducer,
});

export default app;

export const getSelectedPost = state => fromPosts.getPostBeingEdited(state.posts);
export const getBlocks = state => fromPosts.getBlocks(state.posts);
export const getIsFetchingPosts = state => fromPosts.isFetchingPosts(state.posts);
export const getAllPosts = state => fromPosts.getAllPosts(state.posts);
export const getPostErrorMessage = state => fromPosts.getPostErrorMessage(state.posts);

export const getIsAuthenticated = state => fromAuth.isAuthenticated(state.auth);