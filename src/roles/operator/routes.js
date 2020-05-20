import React from 'react';

const Dashboard = React.lazy(() => import('./dashboard/Dashboard'));
// const Users = React.lazy(() => import("./Users/Users"));
// const Stock = React.lazy(() => import("./Stock/Stock"));
const Orders = React.lazy(() => import('./orders/Orders'));
const AddOrder = React.lazy(() => import('./orders/AddOrder'));
const Customers = React.lazy(() => import('./customers/Customers'));
// const SalesChannels = React.lazy(() => import("./SalesChannels/SalesChannels"));
// const Messages = React.lazy(() => import("./Messages/Messages"));
// const DeliveryServices = React.lazy(() => import("./DeliveryServices/DeliveryServices"));

const operatorRoutes = [
	{ path: '/dashboard', name: 'Dashboard', component: Dashboard },
	{ path: '/orders', exact: true, name: 'Orders', component: Orders },
	{ path: '/orders/add', exact: true, name: 'AddOrder', component: AddOrder },
	{ path: '/customers', name: 'Customers', component: Customers }
	//   { path: "/stock", name: "Stock", component: Stock },
	//   { path: "/orders", name: "Orders", component: Orders },
	//   { path: "/customers", name: "Customers", component: Customers },
	//   { path: "/salesChannels", name: "SalesChannels", component: SalesChannels },
	//   { path: "/messages", name: "Messages", component: Messages },
	//   { path: "/deliveryServices", name: "DeliveryServices", component: DeliveryServices }
];

export default operatorRoutes;
