import React from 'react';

const Dashboard = React.lazy(() => import('./Dashboard/Dashboard'));
const Users = React.lazy(() => import('./Users/Users'));
const Stock = React.lazy(() => import('./Stock/Stock'));
const Customers = React.lazy(() => import('./Customers/Customers'));
const Orders = React.lazy(() => import('./Orders/Orders'));
const SalesChannels = React.lazy(() => import('./SalesChannels/SalesChannels'));
const Messages = React.lazy(() => import('./Messages/Messages'));
const DeliveryServices = React.lazy(() => import('./DeliveryServices/DeliveryServices'));

const adminRoutes = [
	{ path: '/dashboard', name: 'Dashboard', component: Dashboard },
	{ path: '/users', name: 'Users', component: Users },
	{ path: '/stock', name: 'Stock', component: Stock },
	{ path: '/customers', name: 'Customers', component: Customers },
	{ path: '/orders', name: 'Orders', component: Orders },
	{ path: '/salesChannels', name: 'SalesChannels', component: SalesChannels },
	{ path: '/messages', name: 'Messages', component: Messages },
	{ path: '/deliveryServices', name: 'DeliveryServices', component: DeliveryServices }
];

export default adminRoutes;
