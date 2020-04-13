import * as actionTypes from '../actions/actionTypes';

const initialState = {
	email: '',
	logged: false,
	role: ''
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.LOGIN:
			return {
				...state,
				email: action.payload.email,
				logged: true,
				role: action.payload.role
			};
		case actionTypes.LOGOUT:
			localStorage.removeItem('jwtTokenAutoCod');
			localStorage.removeItem('jwtRefreshTokenAutoCod');
			return {
				...state,
				email: '',
				logged: false,
				role: ''
			};
		default:
			return state;
	}
};

export default reducer;
