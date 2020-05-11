import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import {
	AppFooter,
	AppHeader,
	AppSidebar,
	AppSidebarFooter,
	AppSidebarForm,
	AppSidebarHeader,
	AppSidebarMinimizer,
	AppSidebarNav2 as AppSidebarNav
} from '@coreui/react';
import adminRoutes from '../../roles/admin/routes';
import adminNavigation from '../../roles/admin/_nav';
import operatorRoutes from '../../roles/operator/routes';
import operatorNavigation from '../../roles/operator/_nav';

import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

import Loading from '../../utils/Loading';

const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {
	// loading = () => <div className='animated fadeIn pt-1 text-center'>Loading...</div>;

	render() {
		const roleNavigation = this.props.role === 'ROLE_ADMIN' ? adminNavigation : operatorNavigation;
		const roleRoutes = this.props.role === 'ROLE_ADMIN' ? adminRoutes : operatorRoutes;
		return (
			<div className='app'>
				<AppHeader fixed>
					<Suspense fallback={<Loading />}>
						<DefaultHeader {...this.props} /*onLogout={(e) => this.signOut(e).bind(this)}*/ />
					</Suspense>
				</AppHeader>
				<div className='app-body'>
					<AppSidebar fixed display='lg'>
						<AppSidebarHeader />
						<AppSidebarForm />
						<Suspense>
							<AppSidebarNav navConfig={roleNavigation} {...this.props} router={router} />
						</Suspense>
						<AppSidebarFooter />
						<AppSidebarMinimizer />
					</AppSidebar>
					<main className='main'>
						<Container className='mt-3' fluid>
							<Suspense fallback={<Loading />}>
								<Switch>
									{roleRoutes.map((route, idx) => {
										return route.component ? (
											<Route
												key={idx}
												path={route.path}
												exact={route.exact}
												name={route.name}
												render={(props) => <route.component {...props} />}
											/>
										) : null;
									})}
									<Redirect from='/' to='/dashboard' />
								</Switch>
							</Suspense>
						</Container>
					</main>
				</div>
				<AppFooter>
					<Suspense fallback={<Loading />}>
						<DefaultFooter />
					</Suspense>
				</AppFooter>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		role: state.sessionStore.role,
		email: state.sessionStore.email,
		logged: state.sessionStore.logged.toString()
	};
};

// const mapDisptachToProps = (dispatch) => {
// 	return {
// 		logout: () => {
// 			dispatch(actionCreators.logout());
// 		}
// 	};
// };

export default connect(mapStateToProps)(DefaultLayout);
// export default DefaultLayout;
