export default {
	items: [
		{
			name: 'Dashboard',
			url: '/dashboard',
			icon: 'icon-speedometer'
		},
		{
			name: 'Orders',
			icon: 'icon-handbag',
			children: [
				{
					name: 'Add New Order',
					url: '/orders/add'
				},
				{
					name: 'All orders',
					url: '/orders'
				}
				// 	{
				// 		name: 'Dashboard',
				// 		url: '/dashboard',
				// 		icon: 'icon-speedometer'
				// 	}
			]
		},
		{
			name: 'Customers',
			url: '/customers',
			icon: 'icon-people'
		}
	]
};
