import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('jwtTokenAutoCod');

const refreshAuthLogic = (failedRequest) =>
	axios
		.post('/refresh/token', {
			refreshToken: localStorage.getItem('jwtRefreshTokenAutoCod')
		})
		.then((tokenRefreshResponse) => {
			const newToken = tokenRefreshResponse.headers['x-auth-token'];
			localStorage.setItem('jwtTokenAutoCod', newToken);
			failedRequest.response.config.headers['x-auth-token'] = newToken;
			axios.defaults.headers.common['x-auth-token'] = newToken;
			return Promise.resolve();
		})
		.catch(() => {
			localStorage.clear();
			window.history.go('/login');
		});
createAuthRefreshInterceptor(axios, refreshAuthLogic);

export default axios;
