import React, { Component, useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import Swal from 'sweetalert2/src/sweetalert2.js';
import axios from '../../../utils/axios';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Products from './Products';
import History from './History';
import ModalTracking from './ModalTracking';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function Orders2() {
	const [dmList, setDmList] = React.useState([]);
	const tableRef = React.useRef();
	const [reload, setReload] = React.useState(false);
	const [openModal, setOpenModal] = React.useState(false);
	const [tracking, setTracking] = React.useState('');

	React.useEffect(() => {
		if (reload) {
			tableRef.current && tableRef.current.onQueryChange();
			setReload(false);
		}
	}, [reload]);

	return (
		<div>
			<ModalTracking openModal={openModal} setOpenModal={setOpenModal} tracking={tracking} />
			<div style={{ maxWidth: '100%', marginBottom: '20px' }}>
				<MaterialTable
					title='Your orders'
					tableRef={tableRef}
					columns={[
						{ title: 'Reference', field: 'id', editable: 'never' },
						{
							title: 'Source',
							render: (rowData) => (
								<p>
									{rowData.source.name} [{rowData.source.type}]
								</p>
							),
							editable: 'never'
						},
						{ title: 'Tracking', field: 'tracking' },
						{ title: 'Created at', field: 'createdAt', type: 'date', editable: 'never' },
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
						}
					]}
					options={{
						search: false,
						filtering: true,
						actionsColumnIndex: -1
					}}
					editable={{
						onRowUpdate: (newData, oldData) =>
							new Promise((resolve, reject) => {
								axios
									.post('/operator/orders/updateTracking', {
										orderId: newData.id,
										tracking: newData.tracking
									})
									.then(() => {
										resolve();
									})
									.catch(() => {
										reject();
									});
							})
					}}
					data={(query) =>
						new Promise((resolve, reject) => {
							let params = {};
							if (query.orderBy) {
								params.orderBy = query.orderBy.field;
								params.orderDirection = query.orderDirection;
							}
							if (query.filters) {
								params.filters = [];
								for (let filter of query.filters) {
									params.filters.push({
										field: filter.column.field,
										// value: filter.value
										value: filter.column.filed === 'createdAt' ? Date.parse(filter.value) : filter.value
										// value: filter.column.filed === 'createdAt' ? filter.value : formatDate(filter.value)
									});
								}
							}
							const offset = query.page * query.pageSize;
							const limit = query.pageSize;
							axios
								.all([
									axios.get(`/operator/orders/getAll/${offset}/${limit}`, { params }),
									axios.get('/operator/orders/getDm')
								])
								.then(
									axios.spread((res1, res2) => {
										resolve({
											data: res1.data.orderList,
											page: query.page,
											totalCount: res1.data.count
										});
										setDmList(res2.data);
									})
								)
								.catch(() => {
									Swal.fire({
										icon: 'error',
										text: 'Error ! Data not loaded.'
									});
									reject();
								});
						})
					}
					detailPanel={(rowData) => {
						return (
							<div style={{ width: '90%', margin: 'auto', marginTop: '20px', marginBottom: '20px' }}>
								<Products rowData={rowData} />
								<History rowData={rowData} dmList={dmList} setReload={setReload} />
							</div>
						);
					}}
					actions={[
						{
							icon: 'refresh',
							tooltip: 'Refresh Data',
							isFreeAction: true,
							onClick: () => setReload(true)
						},
						{
							icon: (row) => {
								return <LocalShippingIcon />;
								// return <ModalTracking tracking={row.id} />;
							},
							tooltip: 'View Tracking',
							isFreeAction: false,
							onClick: (event, row) => {
								console.log('clicked');
								if (row.tracking.length > 8) {
									setOpenModal(true);
									setTracking(row.tracking);
									axios
										.get('/operator/orders/track', row.tracking)
										.then((res) => {
											console.log(res);
										})
										.catch((err) => {
											console.log(err);
										});
								}
							}
						}
					]}
				/>
			</div>
		</div>
	);
}
