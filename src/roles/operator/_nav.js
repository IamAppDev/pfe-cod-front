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
				// {
				// 	name: 'All orders',
				// 	url: '/orders'
				// },
				{
					name: 'All orders2',
					url: '/orders2'
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
