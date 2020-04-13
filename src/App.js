import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import axios from './utils/axios';
import Auth from './utils/Auth';
import * as actionCreators from './store/actions/index';

// import { renderRoutes } from 'react-router-config';
import './App.scss';

import Loading from './utils/Loading';

// const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// const loading = () => (
// 	<Spinner
// 		type='grow'
// 		style={{
// 			position: 'fixed',
// 			top: '50%',
// 			left: '50%',
// 			transform: 'translate(-50%, -50%)',
// 			width: '3rem',
// 			height: '3rem'
// 		}}
// 	/>
// );

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Page404 = React.lazy(() => import('./pages/Page404'));
const Page500 = React.lazy(() => import('./pages/Page500'));
const Confirmation = React.lazy(() => import('./pages/Confirmation/Confirmation'));

class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router>
				<React.Suspense fallback={<Loading />}>
					<Switch>
						<Route exact path='/login' name='Login Page' render={(props) => <Login {...props} />} />
						<Route exact path='/register' name='Register Page' render={(props) => <Register {...props} />} />
						<Route
							exact
							path='/confirmation/:token'
							name='Confirmation'
							render={(props) => <Confirmation {...props} />}
						/>
						<Route exact path='/404' name='Page 404' render={(props) => <Page404 {...props} />} />
						<Route exact path='/500' name='Page 500' render={(props) => <Page500 {...props} />} />
						{/* <Route path='/' name='Home' render={(props) => <DefaultLayout {...props} />} /> */}
						<PrivateRoute logged={this.isAuth} name='Home' path='/' component={DefaultLayout} />
					</Switch>
				</React.Suspense>
			</Router>
		);
	}

	isAuth = () => {
		if (!this.props.logged) {
			const result = Auth.checkSession();
			this.props.login(result);
			return result.logged;
		} else {
			return this.props.logged;
		}
	};
}

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) => {
			return rest.logged() ? <Component {...props} /> : <Redirect to='/login' />;
		}}
	/>
);

const mapStateToProps = (state) => {
	return {
		logged: state.sessionStore.logged
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: (payload) => {
			dispatch(actionCreators.login(payload));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
