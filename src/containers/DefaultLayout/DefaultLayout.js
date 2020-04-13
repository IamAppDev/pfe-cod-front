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
							<AppSidebarNav navConfig={adminNavigation} /*{...this.props}*/ router={router} />
						</Suspense>
						<AppSidebarFooter />
						<AppSidebarMinimizer />
					</AppSidebar>
					<main className='main'>
						<Container className='mt-3' fluid>
							<Suspense fallback={<Loading />}>
								<Switch>
									{adminRoutes.map((route, idx) => {
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

const mapDisptachToProps = (dispatch) => {
	return {
		logout: () => {
			dispatch(actionCreators.logout());
		}
	};
};

export default connect(null, mapDisptachToProps)(DefaultLayout);
