import React, { Component, useState, useEffect } from 'react';
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
//
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
//
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Orders extends Component {
	constructor(props) {
		super(props);

		this.tableRef = React.createRef();

		this.state = {
			showUpdateState: false,
			dm: [],
			labelAutocomplete: 'Delivery Man',
			orderStates: [],
			selectedState: '',
			description: '',
			orderId: '',
			deliverymanId: 0
		};
	}

	handleShowUpdate = (orderState, orderId) => {
		switch (orderState) {
			case 'new':
				this.setState({
					labelAutocomplete: 'Order State',
					orderStates: ['pending', 'canceled', 'confirmed'],
					showUpdateState: true,
					orderId
				});
				break;
			case 'pending':
				this.setState({
					labelAutocomplete: 'Order State',
					orderStates: ['canceled', 'confirmed'],
					showUpdateState: true,
					orderId
				});
				break;
			default:
				this.setState({
					showUpdateState: true,
					orderId
				});
		}
	};

	handleUpdateState = () => {
		const orderObj = {
			orderId: this.state.orderId,
			orderState: this.state.selectedState,
			description: this.state.description,
			deliverymanId: this.state.deliverymanId
		};
		if (this.state.selectedState || this.state.deliverymanId) {
			axios
				.post('/operator/orders/update', orderObj)
				.then(() => {
					this.tableRef.current && this.tableRef.current.onQueryChange();
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	render() {
		let example = null;
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
										// console.log(res);
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
								<div style={{ width: '90%', margin: 'auto', marginTop: '20px', marginBottom: '20px' }}>
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
													style={{ width: '90%', margin: 'auto', marginTop: '20px', marginBottom: '20px' }}
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

														{this.state.showUpdateState ? (
															<TableRow>
																<TableCell></TableCell>
																<TableCell></TableCell>
																<TableCell>
																	<Autocomplete
																		id='combo-box-demo'
																		options={this.state.orderStates}
																		onChange={(event, val) => {
																			this.setState({
																				selectedState: val
																			});
																		}}
																		// getOptionLabel={(option) => option.title}
																		style={{ width: '300px', float: 'right' }}
																		// style={{ height: '1em' }}
																		renderInput={(params) => (
																			<TextField
																				// style={{ height: '100px' }}
																				{...params}
																				label={this.state.labelAutocomplete}
																				variant='outlined'
																			/>
																		)}
																	/>
																</TableCell>
																<TableCell>
																	<TextField
																		style={{ width: '200px', float: 'right' }}
																		id='outlined-basic'
																		label='Description'
																		variant='outlined'
																		onChange={(event) => {
																			this.setState({
																				description: event.target.value
																			});
																		}}
																		value={this.state.description}
																	/>
																</TableCell>
																<TableCell style={{ with: '150px' }}>
																	<Button onClick={this.handleUpdateState} variant='contained' color='primary'>
																		Validate
																	</Button>
																</TableCell>
															</TableRow>
														) : null}
													</TableBody>
												</Table>
												{rowData.orderHistories[rowData.orderHistories.length - 1].orderState ===
												('new' || 'pending' || 'confirmed') ? (
													<Button
														onClick={() =>
															this.handleShowUpdate(
																rowData.orderHistories[rowData.orderHistories.length - 1].orderState,
																rowData.id
															)
														}
														style={{ width: '20%', marginBottom: '10px', float: 'right' }}
														variant='contained'
													>
														Add State
													</Button>
												) : null}
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
							// {
							// 	icon: () => {
							// 		return <SettingsIcon />;
							// 	},
							// 	tooltip: 'Update State',
							// 	isFreeAction: false,
							// 	onClick: (event, row) => {
							// 		console.log('clicked ! ');
							// 		example = row;
							// 		this.setState({
							// 			open: true,
							// 			currentRow: row
							// 		});
							// 	}
							// }
						]}
					/>
				</div>
			</div>
		);
	}

	componentDidMount() {
		axios
			.get('/operator/orders/getDm')
			.then((res) => {
				this.setState({
					dm: res.data
				});
			})
			.catch(() => {
				Swal.fire({
					icon: 'error',
					text: 'Internal Server Error. Data Not Loaded !'
				});
			});
	}
}

const top100Films = [
	{ title: 'The Shawshank Redemption', year: 1994 },
	{ title: 'The Godfather', year: 1972 },
	{ title: 'The Godfather: Part II', year: 1974 },
	{ title: 'The Dark Knight', year: 2008 },
	{ title: '12 Angry Men', year: 1957 }
];

export default Orders;
