import {
  AUTH_AUTHENTICATION,
  AUTH_FAIL,
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_SET_REDIRECT_PATH,
} from "../actions/actionType";

const state = {
  token: null,
  userId: null,
  loading: false,
  error: null,
  authRedirectPath: "/",
};

export default (state, { type, payload }) => {
  switch (type) {
    case AUTH_START:
      return {
        ...state,
        loading: true,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        token: payload.token,
        userId: payload.userId,
      };

    case AUTH_FAIL:
      return {
        ...state,
        error: payload,
      };

    case AUTH_SET_REDIRECT_PATH:
      return {
        ...state,
        authRedirectPath: payload,
      };

    case AUTH_LOGOUT:
      return {
        ...state,
      };

    default:
      return state;
  }
};
