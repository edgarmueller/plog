
import { USER_LOGOUT_SUCCESS } from '../constants/index';

export const createFetchingProgressReducer =
  (request, success, failure) => (state = false, action) => {
    switch (action.type) {
      case request:
        return true;
      case USER_LOGOUT_SUCCESS:
      case success:
      case failure:
        return false;
      default:
        return state;
    }
  };

export const createErrorMessageReducer = (request, success, failure) => (state = null, action) => {
  switch (action.type) {
    case failure:
      return action.statusText;
    case request:
    case success:
      return null;
    default:
      return state;
  }
};