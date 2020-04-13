import * as actionTypes from './actionTypes';

export const login = (payload) => {
	return {
		type: actionTypes.LOGIN,
		payload
	};
};

export const logout = () => {
	return {
		type: actionTypes.LOGOUT
	};
};
