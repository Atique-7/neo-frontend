import jwtDecode from 'jwt-decode';
import { createAction } from '@reduxjs/toolkit';

export const loginUser = createAction('LOGIN', (token) => ({
  payload: {
    token,
    isAuthenticated: true,
  },
}));

export const logoutUser = createAction('LOGOUT');


export const checkTokenExpirationMiddleware = () => {
    return (dispatch, getState) => {
        const token = getState().auth.token;

        if (token && jwtDecode(token).exp < Date.now() / 1000) {
            dispatch(logoutUser());
        }
    };
};
