import jwtDecode from 'jwt-decode';
import axios from './axios';

class Auth {
	static login(token, refreshToken) {
		localStorage.setItem('jwtTokenAutoCod', token);
		localStorage.setItem('jwtRefreshTokenAutoCod', refreshToken);
		const { email, role } = jwtDecode(token);
		return {
			email,
			role
		};
	}

	static checkSession() {
		const refreshToken = localStorage.getItem('jwtRefreshTokenAutoCod');
		if (refreshToken) {
			const { exp, email, role } = jwtDecode(refreshToken);
			if (!exp || !email || !role) {
				return {
					logged: false
				};
			} else {
				if (Date.now() >= exp * 1000) {
					return {
						email: '',
						logged: false,
						role: ''
					};
				} else {
					return {
						email,
						logged: true,
						role
					};
				}
			}
		} else {
			return {
				logged: false
			};
		}
	}
	// 	const token = localStorage.getItem('jwtTokenAutoCod');
	// 	if (token) {
	// 		const { exp, email } = jwtDecode(token);
	// 		if (Date.now() >= exp * 1000) {
	// 			return {
	// 				email: '',
	// 				logged: false,
	// 				role: ''
	// 			};
	// 		} else {
	// 			return {
	// 				email,
	// 				logged: true
	// 			};
	// 		}
	// 	} else {
	// 		const refreshToken = localStorage.getItem('jwtRefreshTokenAutoCod');
	// 		 axios
	// 			.post('/refresh/token', {
	// 				refreshToken
	// 			})
	// 			.then((res) => {
	// 				const token = res.headers['x-auth-token'];
	// 			})
	// 			.catch();
	// 		// return null;
	// 	}
	// }
}

export default Auth;
