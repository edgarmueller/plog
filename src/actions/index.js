import * as _ from 'lodash';
import { routerActions } from 'react-router-redux';
import {
  CREATE_POST_FAILURE,
  CREATE_POST_SUCCESS,
  DELETE_POST_SUCCESS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_BLOCKS_SUCCESS,
  SELECT_POST,
  SIGN_UP_USER_SUCCESS,
  SIGN_UP_USER_FAILURE,
  UPDATE_BLOCK_DIALECT,
  UPDATE_BLOCK_TEXT,
  UPDATE_POST_TITLE,
  USER_LOGIN_FAILURE,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  REMOVE_BLOCK_SUCCESS,
  ADD_BLOCK,
  ADD_BLOCK_FAILURE,
  REMOVE_BLOCK_FAILURE,
  FETCH_BLOCKS_FAILURE,
  DELETE_POST_FAILURE,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  MOVE_BLOCK_UP,
  MOVE_BLOCK_DOWN,
  ADD_TAG_SUCCESS,
  ADD_TAG_FAILURE,
  DELETE_TAG_SUCCESS,
  DELETE_TAG_FAILURE,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  ERROR_PASSWORDS_DONT_DIFFER,
  ACTIVATE_ACCOUNT_SUCCESS,
  ACTIVATE_ACCOUNT_FAILURE,
  FETCH_BLOCK_REQUEST,
  FETCH_BLOCK_SUCCESS, UPDATE_BLOCK_NAME,
  MOVE_BLOCK_TO,
} from '../constants/index';
import * as api from '../api';
import { getIsFetchingPosts } from '../reducers';

export function errorHandler(dispatch, error, type) {
  if (error === undefined) {
    dispatch({
      type,
      statusText: 'An unknown statusText occurred.',
    });
    return;
  }

  let errorMessage = '';
  const errorResponse = error.response;

  if (errorResponse === undefined) {
    errorMessage = error.message;
  } else if (typeof errorResponse === 'string') {
    errorMessage = errorResponse;
  } else if (errorResponse.messages) {
    errorMessage = _.join(errorResponse.messages, '\n');
  } else if (errorResponse.data && errorResponse.data.messages) {
    errorMessage = _.join(errorResponse.data.messages, '\n');
  } else if (errorResponse.data && errorResponse.data.statusText) {
    errorMessage = errorResponse.data.statusText;
  } else if (errorResponse.data) {
    errorMessage = errorResponse.data;
  }


  if (errorResponse !== undefined && errorResponse.status === 401) {
    if (!_.isEmpty(localStorage.getItem('token'))) {
      // we had previously had a valid token
      dispatch({
        type: USER_LOGOUT_SUCCESS,
        statusText: 'Your token timed out. Please login again.',
      });
      localStorage.removeItem('token');
    } else {
      dispatch({
        type: USER_LOGIN_FAILURE,
        statusText: 'Your username or password is wrong.',
      });
    }
  } else {
    dispatch({
      type,
      statusText: errorMessage,
    });
  }
}

export const initPosts = posts => ({
  type: FETCH_POSTS_SUCCESS,
  posts,
});

export const selectPost = (post) => {
  localStorage.setItem('selectedPost', JSON.stringify(post));
  return {
    type: SELECT_POST,
    post,
  };
};

export const createPost = post => dispatch => api.createPost(post)
    .then(
      (resp) => {
        dispatch({
          type: CREATE_POST_SUCCESS,
          post: resp.data.data,
        });
      },
      (error) => {
        errorHandler(dispatch, error, CREATE_POST_FAILURE);
      },
    );

export const updatePost = (selectedPost, blocks) => (dispatch) => {
  const promises = blocks.map((block, idx) => {
    const clonedBlock = _.clone(block);
    clonedBlock.index = idx;
    return api.updateBlock(selectedPost.id, clonedBlock);
  });

  return Promise.all(promises, api.updatePost(selectedPost)
    .then(
      (resp) => {
        dispatch({
          type: UPDATE_POST_SUCCESS,
          post: resp.data.data,
        });
      },
      error => errorHandler(dispatch, error, UPDATE_POST_FAILURE),
    ),
  );
};

export const deletePost = post => dispatch =>
  api.deletePost(post.id).then(
    dispatch({
      type: DELETE_POST_SUCCESS,
      post,
    }),
    error => errorHandler(dispatch, error, DELETE_POST_FAILURE),
  );

//
// Auth actions --
//
export const logoutUser = () => (dispatch) => {
  api.logoutUser()
    .then(
      (resp) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({
          type: USER_LOGOUT_SUCCESS,
          statusText: 'You have logged out successfully.',
          status: resp.status,
        });
        dispatch(routerActions.push('login'));
      },
    );
};


/**
 * Action for signing up an user.
 *
 * @param signUpToken the sign-up token
 */
export const registerUser = signUpToken => dispatch =>
  api.registerUser(signUpToken)
    .then(
      () => {
        dispatch({
          type: SIGN_UP_USER_SUCCESS,
        });
        dispatch(routerActions.push('/'));
      },
      error => errorHandler(dispatch, error, SIGN_UP_USER_FAILURE),
    );


export const loginUser = ({ email, password }) => dispatch =>
// TODO  rememberMe can not be configured
  api.loginUser(email, password, true)
    .then(
      (response) => {
        const {
          user,
          userId,
          token,
        } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        dispatch({
          type: USER_LOGIN_SUCCESS,
          token,
          user,
          userId,
        });
      },
      (error) => {
        errorHandler(dispatch, error, USER_LOGIN_FAILURE);
      },
    );

export const fetchPosts = () => (dispatch, getState) => {
  if (getIsFetchingPosts(getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: FETCH_POSTS_REQUEST,
  });

  return api
    .fetchPosts()
    .then(
      (resp) => {
        dispatch(initPosts(resp.data.data));
      },
      (error) => {
        errorHandler(dispatch, error, FETCH_POSTS_FAILURE);
      },
    );
};

// TODO: should only get post id as parameter
export const fetchBlocks = selectedPost => dispatch =>
  api.fetchBlocks(selectedPost.id)
    .then(
      (resp) => {
        dispatch({
          type: FETCH_BLOCKS_SUCCESS,
          postId: selectedPost.id,
          blocks: resp.data.data,
        });
      },
      error => errorHandler(dispatch, error, FETCH_BLOCKS_FAILURE),
    );

export const updateBlockText = (block, text) => ({
  type: UPDATE_BLOCK_TEXT,
  block,
  text,
});

export const updateBlockName = (block, name) => ({
  type: UPDATE_BLOCK_NAME,
  block,
  name,
});

export const moveBlock = (dragIndex, hoverIndex) => ({
  type: MOVE_BLOCK_TO,
  dragIndex,
  hoverIndex,
});

export const updateBlockDialect = (block, dialect) => ({
  type: UPDATE_BLOCK_DIALECT,
  block,
  dialect,
});

export const updatePostTitle = title => ({
  type: UPDATE_POST_TITLE,
  title,
});

export const addBlock = (postId, block) => dispatch =>
  api.addBlock(postId, block)
    .then(
      (resp) => {
        dispatch({
          type: ADD_BLOCK,
          block: resp.data.data,
        });
      },
      (error) => {
        errorHandler(dispatch, error, ADD_BLOCK_FAILURE);
      },
    );

export const removeBlock = (postId, block) => dispatch =>
  api.removeBlock(postId, block)
    .then(
      (resp) => {
        // TODO: write test that expects blockId in response
        // TODO: this will fail if a request has been executed multiple times!
        //       should this even be allowed?
        dispatch({
          type: REMOVE_BLOCK_SUCCESS,
          blockId: resp.data.data.blockId,
        });
      },
      (error) => {
        errorHandler(dispatch, error, REMOVE_BLOCK_FAILURE);
      },
    );

export const moveBlockUp = block => ({
  type: MOVE_BLOCK_UP,
  block,
});

export const moveBlockDown = block => ({
  type: MOVE_BLOCK_DOWN,
  block,
});

export const addTag = (postId, tag) => dispatch =>
  api.addTag(postId, tag)
    .then(
      // TODO: response unused
      (resp) => {
        dispatch({
          type: ADD_TAG_SUCCESS,
          postId,
          tag: resp.data.data.tag,
        });
      },
      (error) => {
        errorHandler(dispatch, error, ADD_TAG_FAILURE);
      },
    );

export const removeTag = (postId, tagId) => dispatch =>
  api.removeTag(postId, tagId)
    .then(
      () => {
        dispatch({
          type: DELETE_TAG_SUCCESS,
          postId,
          tagId,
        });
      },
      (error) => {
        errorHandler(dispatch, error, DELETE_TAG_FAILURE);
      },
    );

export const forgotPassword = email => dispatch =>
  api.forgotPassword(email)
    .then(
      () => {
        dispatch({
          type: FORGOT_PASSWORD_SUCCESS,
        });
      },
      (error) => {
        errorHandler(dispatch, error, FORGOT_PASSWORD_FAILURE);
      },
    );

export const resetPassword = token => newPassword => dispatch =>
  api.resetPassword(token, newPassword)
    .then(
      () => {
        dispatch({
          type: RESET_PASSWORD_SUCCESS,
        });
      },
      error => errorHandler(dispatch, error, RESET_PASSWORD_FAILURE),
    );

export const changePassword = (currentPassword, newPassword) => (dispatch) => {
  if (currentPassword === newPassword) {
    dispatch({
      type: ERROR_PASSWORDS_DONT_DIFFER,
    });

    // TODO
    return;
  }

  api.changePassword(currentPassword, newPassword)
    .then(
      () => {
        dispatch({
          type: RESET_PASSWORD_SUCCESS,
        });
        dispatch(logoutUser());
      },
      error => errorHandler(dispatch, error, RESET_PASSWORD_FAILURE),
    );
};

export const activateAccount = token => dispatch =>
  api.activateAccount(token)
    .then(
      () => dispatch({ type: ACTIVATE_ACCOUNT_SUCCESS }),
      error => errorHandler(dispatch, error, ACTIVATE_ACCOUNT_FAILURE),
    );

export const downloadFile = (postId, fileId) => (onSuccess, onRejected) => (dispatch) => {
  dispatch({
    type: FETCH_BLOCK_REQUEST,
  });
  api.download(postId, fileId)
    .then(
      (resp) => {
        const reader = new FileReader();
        const loadEnd = () => {
          dispatch({
            type: FETCH_BLOCK_SUCCESS,
          });
          onSuccess(reader.result);
        };
        if (process.env.NODE_ENV === 'test') {
          reader.on('loadend', loadEnd);
        } else {
          reader.onloadend = loadEnd;
        }
        reader.readAsDataURL(resp.data);
      },
      error => onRejected(error),
    );
};

export const uploadFile = (postId, blockId, file) => api.upload(postId, blockId, file);

