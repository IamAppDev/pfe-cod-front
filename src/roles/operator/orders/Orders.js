import React, { Component } from 'react';
// import ServerTable from 'react-strap-table';
import MaterialTable from 'material-table';
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import * as Yup from 'yup';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { removeExtraSpaces, removeExtraSpacesFromStr } from '../../../utils/TextFormat';
//
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
//
import axios from '../../../utils/axios';
import colors from '../../../utils/enums/colors';
import categories from '../../../utils/enums/categories';
import sizes from '../../../utils/enums/sizes';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import SettingsIcon from '@material-ui/icons/Settings';

class Orders extends Component {
	constructor(props) {
		super(props);

		this.tableRef = React.createRef();
	}

	render() {
		return (
			<div>
				<div style={{ maxWidth: '100%', marginBottom: '20px' }}>
					<MaterialTable
						title='Your orders'
						tableRef={this.tableRef}
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
									// setTimeout(() => {
									// 	{
									// 		const data = this.state.data;
									// 		const index = data.indexOf(oldData);
									// 		data[index] = newData;
									// 		this.setState({ data }, () => resolve());
									// 	}
									// 	resolve();
									// }, 1000);
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
									.get(`/operator/orders/getAll/${offset}/${limit}`, { params })
									.then((res) => {
										console.log(res);
										resolve({
											data: res.data.orderList,
											page: query.page,
											totalCount: res.data.count
										});
									})
									.catch(() => {
										Swal.fire({
											icon: 'error',
											text: 'Internal Server Error !'
										});
										reject();
									});
							})
						}
						detailPanel={(rowData) => {
							let sum = [];
							for (let row of rowData.orderProducts) {
								sum[row.id] = Math.trunc(row.product.price * row.quantity * (100 - row.discount) * 0.01);
							}
							return (
								<div style={{ width: '80%', margin: 'auto', marginTop: '20px', marginBottom: '20px' }}>
									<ExpansionPanel>
										<ExpansionPanelSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls='panel1a-content'
											id='panel1a-header'
										>
											<Typography align='right'>Product(s)</Typography>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
											<TableContainer component={Paper}>
												<Table
													style={{ width: '80%', margin: 'auto', marginTop: '20px', marginBottom: '20px' }}
													size='small'
													aria-label='a dense table'
												>
													<TableHead>
														<TableRow>
															<TableCell align='center'>
																<strong>
																	<i>Product</i>
																</strong>
															</TableCell>
															<TableCell align='center'>
																<strong>
																	<i>Price</i>
																</strong>
															</TableCell>
															<TableCell align='center'>
																<strong>
																	<i>Quantity</i>
																</strong>
															</TableCell>
															<TableCell align='center'>
																<strong>
																	<i>Discount</i>
																</strong>
															</TableCell>
															<TableCell align='center'>
																<strong>
																	<i>Sum</i>
																</strong>
															</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{rowData.orderProducts.map((orderProduct) => (
															<TableRow key={orderProduct.id}>
																<TableCell component='th' scope='row' align='center'>
																	{orderProduct.product.name}
																</TableCell>
																<TableCell align='center'>{orderProduct.product.price} MAD</TableCell>
																<TableCell align='center'>{orderProduct.quantity}</TableCell>
																<TableCell align='center'>{orderProduct.discount} %</TableCell>
																<TableCell align='center'>{sum[orderProduct.id]} MAD</TableCell>
															</TableRow>
														))}
														<TableRow>
															<TableCell colSpan={3} />
															<TableCell align='center'>
																<strong>Total</strong>
															</TableCell>
															<TableCell align='center'>
																<strong>{sum.reduce((a, b) => a + b)} MAD</strong>
															</TableCell>
														</TableRow>
													</TableBody>
												</Table>
											</TableContainer>
										</ExpansionPanelDetails>
									</ExpansionPanel>
									<ExpansionPanel>
										<ExpansionPanelSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls='panel2a-content'
											id='panel2a-header'
										>
											<Typography>History</Typography>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
											<TableContainer component={Paper}>
												<Table
													style={{ width: '80%', margin: 'auto', marginTop: '20px', marginBottom: '20px' }}
													size='small'
													aria-label='a dense table'
												>
													<TableHead>
														<TableRow>
															<TableCell align='center'></TableCell>
															<TableCell align='center'>
																<i>
																	<strong>User</strong>
																</i>
															</TableCell>
															<TableCell align='center'>
																<i>
																	<strong>Order State</strong>
																</i>
															</TableCell>
															<TableCell align='center'>
																<i>
																	<strong>Description</strong>
																</i>
															</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{rowData.orderHistories.map((row) => (
															<TableRow key={row.id}>
																<TableCell>
																	<img
																		style={{ height: 36, borderRadius: '50%' }}
																		src={
																			row.user.roleLibelle === 'ROLE_OPERATOR'
																				? require('../../../assets/img/support.png')
																				: require('../../../assets/img/delivery-man.png')
																		}
																	/>
																</TableCell>
																<TableCell component='th' scope='row' align='center'>
																	{row.user.firstName + ' ' + row.user.lastName + ' ' + row.user.city}
																</TableCell>
																<TableCell align='center'>{row.orderState}</TableCell>
																<TableCell align='center'>{row.description}</TableCell>
															</TableRow>
														))}
													</TableBody>
												</Table>
											</TableContainer>
										</ExpansionPanelDetails>
									</ExpansionPanel>
								</div>
							);
						}}
						actions={[
							{
								icon: 'refresh',
								tooltip: 'Refresh Data',
								isFreeAction: true,
								onClick: () => this.tableRef.current && this.tableRef.current.onQueryChange()
							},
							{
								icon: () => {
									return <LocalShippingIcon />;
								},
								tooltip: 'View Tracking',
								isFreeAction: false,
								onClick: (event, row) => {
									fetch('https://apidojo-17track-v1.p.rapidapi.com/track?timeZoneOffset=0&codes=' + row.tracking, {
										method: 'GET',
										headers: {
											'x-rapidapi-host': 'apidojo-17track-v1.p.rapidapi.com',
											'x-rapidapi-key': '73f386492bmshf6334794dd62414p170ad8jsnbff091bb4cc2'
										}
									})
										.then((response) => {
											console.log(response);
										})
										.catch((err) => {
											console.log(err);
										});
								}
							}
							// {
							// 	icon: () => {
							// 		return <SettingsIcon />;
							// 	},
							// 	tooltip: 'Update State',
							// 	isFreeAction: false
							// }
						]}
					/>
				</div>
			</div>
		);
	}
}

export default Orders;
