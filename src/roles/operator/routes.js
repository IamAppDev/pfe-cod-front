import React from 'react';

const Dashboard = React.lazy(() => import('./dashboard/Dashboard'));
const Orders = React.lazy(() => import('./orders/Orders'));
const Orders2 = React.lazy(() => import('./orders/Orders2'));
const AddOrder = React.lazy(() => import('./orders/AddOrder'));
const Customers = React.lazy(() => import('./customers/Customers'));

const operatorRoutes = [
	{ path: '/dashboard', name: 'Dashboard', component: Dashboard },
	// { path: '/orders', exact: true, name: 'Orders', component: Orders },
	{ path: '/orders2', exact: true, name: 'Orders2', component: Orders2 },
	{ path: '/orders/add', exact: true, name: 'AddOrder', component: AddOrder },
	{ path: '/customers', name: 'Customers', component: Customers }
];

export default operatorRoutes;
