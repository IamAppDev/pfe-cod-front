import React, { Component, useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2/src/sweetalert2.js';
import axios from '../../../utils/axios';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Products from '../../operator/orders/Products';
import History from '../../operator/orders/History';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function Orders() {
	const tableRef = React.useRef();
	const [reload, setReload] = React.useState(false);

	React.useEffect(() => {
		if (reload) {
			tableRef.current && tableRef.current.onQueryChange();
			setReload(false);
		}
	}, [reload]);

	return (
		<div>
			<div style={{ maxWidth: '100%', marginBottom: '20px' }}>
				<MaterialTable
					title='Your orders'
					tableRef={tableRef}
					columns={[
						{ title: 'Reference', field: 'id' },
						{
							title: 'Source',
							filterComponent: () => <p>HE</p>,
							render: (rowData) => (
								<p>
									{rowData.source.name} [{rowData.source.type}]
								</p>
							)
						},
						// { title: 'Tracking', field: 'tracking' },
						{ title: 'Created at', field: 'createdAt', type: 'date' },
						{
							title: 'Customer',
							render: (rowData) => (
								<React.Fragment>
									<p>
										{rowData.customer.firstName} {rowData.customer.lastName}
										<br />
										{rowData.customer.phone}
										<br />
										{rowData.customer.address}
										<br />
										{rowData.customer.city}
									</p>
								</React.Fragment>
							)
						},
						{
							title: 'Payment Number',
							field: 'payment.ref'
						}
					]}
					options={{
						search: false,
						filtering: true,
						sorting: false,
						// exportButton: true,
						actionsColumnIndex: -1
					}}
					data={(query) =>
						new Promise((resolve, reject) => {
							let params = {};
							// if (query.orderBy) {
							// 	params.orderBy = query.orderBy.field;
							// 	params.orderDirection = query.orderDirection;
							// }
							if (query.filters) {
								for (let filter of query.filters) {
									if (filter.column.field === 'createdAt') {
										params[filter.column.field] = Date.parse(filter.value);
									} else if (filter.column.field === 'payment.ref') {
										params['paymentRef'] = filter.value;
									} else {
										params[filter.column.field] = filter.value;
									}
								}
							}

							params.offset = query.page * query.pageSize;
							params.limit = query.pageSize;

							if (params.createdAt) {
								params.createdAt =
									params.createdAt.getFullYear() +
									'-' +
									(params.createdAt.getMonth() + 1) +
									'-' +
									params.createdAt.getDate();
							}
							axios
								.get(`/admin/orders/`, { params })
								.then((res) => {
									resolve({
										data: res.data.rows,
										page: query.page,
										totalCount: res.data.count
									});
								})
								.catch(() => {
									Swal.fire({
										icon: 'error',
										text: 'Data not loaded.'
									});
									reject();
								});
						})
					}
					detailPanel={(rowData) => {
						return (
							<div style={{ width: '90%', margin: 'auto', marginTop: '20px', marginBottom: '20px' }}>
								<Products rowData={rowData} />
								<History rowData={rowData} />
							</div>
						);
					}}
					actions={[
						{
							icon: 'refresh',
							tooltip: 'Refresh Data',
							isFreeAction: true,
							onClick: () => setReload(true)
						}
						// 	{
						// 		icon: (row) => {
						// 			return <LocalShippingIcon />;
						// 			// return <ModalTracking tracking={row.id} />;
						// 		},
						// 		tooltip: 'View Tracking',
						// 		isFreeAction: false,
						// 		onClick: (event, row) => {
						// 			console.log('clicked');
						// 			if (row.tracking.length > 8) {
						// 				setOpenModal(true);
						// 				setTracking(row.tracking);
						// 				axios
						// 					.get('/operator/orders/track', row.tracking)
						// 					.then((res) => {
						// 						console.log(res);
						// 					})
						// 					.catch((err) => {
						// 						console.log(err);
						// 					});
						// 			}
						// 		}
						// 	}
					]}
				/>
			</div>
		</div>
	);
}
