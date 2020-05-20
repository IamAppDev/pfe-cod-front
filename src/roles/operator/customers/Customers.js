import React, { Component } from 'react';
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
import CSVReader from 'react-csv-reader';
import { removeExtraSpaces } from '../../../utils/TextFormat';
//
import axios from '../../../utils/axios';
import cities from '../../../utils/enums/cities';
//
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import SettingsIcon from '@material-ui/icons/Settings';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class Customers extends Component {
	constructor(props) {
		super(props);
		this.tableRef = React.createRef();
		this.cityList = {
			options: cities,
			getOptionLabel: (option) => option
		};
		this.state = {
			isLoading: false
		};
	}
	render() {
		return (
			<div>
				<div style={{ maxWidth: '100%', marginBottom: '20px' }}>
					<MaterialTable
						isLoading={this.state.isLoading}
						title='Customers with Orders you created'
						tableRef={this.tableRef}
						columns={[
							{
								field: 'id',
								hidden: true
							},
							{ title: 'First Name *', field: 'firstName' },
							{ title: 'Last Name *', field: 'lastName' },
							{ title: 'Phone *', field: 'phone', initialEditValue: '+212' },
							{
								title: 'City *',
								field: 'city',
								editComponent: (field) => {
									return (
										<Autocomplete
											defaultValue={field.rowData.city}
											field={field}
											onChange={(event, value) => {
												field.rowData.city = value;
											}}
											{...this.cityList}
											id='debug'
											debug
											renderInput={(params) => <TextField {...params} placeholder='city' />}
										/>
									);
								}
							},
							{ title: 'Address *', field: 'address' },
							// { title: 'Created By', field: 'createdBy', editable: 'never' },
							{ title: 'Created at', field: 'createdAt', editable: 'never', type: 'date' }
						]}
						options={{
							search: false,
							pageSizeOptions: [5, 10, 20, 50, 100, 200],
							sorting: true,
							filtering: true,
							actionsColumnIndex: -1,
							actionsCellStyle: { display: 'flex', justifyContent: 'center', width: '100%' }
						}}
						data={(query) =>
							new Promise((resolve, reject) => {
								const offset = query.page * query.pageSize;
								const limit = query.pageSize;
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
								axios
									.get(`/operator/customers/getAll/${offset}/${limit}`, { params })
									.then((res) => {
										console.log(res);
										resolve({
											data: res.data.rows,
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
						editable={{
							onRowAdd: (newData) =>
								new Promise((resolve, reject) => {
									schemaAdd.isValid(newData).then(function (valid) {
										if (valid) {
											axios
												.post('/operator/customers/add', newData)
												.then(() => {
													resolve();
												})
												.catch((err) => {
													let msg = 'Internal Server Error !';
													if (err.response) {
														switch (err.response.statusText) {
															case 'Exist':
																msg = 'Phone number already exists !';
																break;
															case 'DataNotValidated':
																msg = 'Please check inserted values !';
																break;
														}
													}
													Swal.fire({
														icon: 'error',
														text: msg
													});
													reject();
												});
										} else {
											Swal.fire({
												icon: 'error',
												text: 'Please check inserted values !'
											});
											reject();
										}
									});
								}),
							onRowUpdate: (newData, oldData) =>
								new Promise((resolve, reject) => {
									const newDataLight = {
										id: newData.id,
										firstName: newData.firstName,
										lastName: newData.lastName,
										phone: newData.phone,
										city: newData.city,
										address: newData.address
									};
									schemaUpdate.isValid(newData).then(function (valid) {
										if (valid) {
											removeExtraSpaces(newDataLight, 'firstName', 'lastName', 'phone', 'address');
											if (oldData.phone === newDataLight.phone) {
												delete newDataLight.phone;
											}
											axios
												.post('/operator/customers/update', newDataLight)
												.then(() => {
													resolve();
												})
												.catch((err) => {
													let msg = 'Internal Server Error !';
													if (err.response) {
														switch (err.response.statusText) {
															case 'Exist':
																msg = 'Phone number already exist !';
																break;
															case 'DataNotValidated':
																msg = 'Please check inserted values !';
																break;
														}
													}
													Swal.fire({
														icon: 'error',
														text: msg
													});
													reject();
												});
										} else {
											Swal.fire({
												icon: 'error',
												text: 'PLease check inserted values !'
											});
											reject();
										}
									});
								})
						}}
						detailPanel={(rowData) => {
							let sum = [];
							// for (let row of rowData.orderProducts) {
							// 	sum[row.id] = Math.trunc(row.product.price * row.quantity * (100 - row.discount) * 0.01);
							// }

							for (let order of rowData.orders) {
								sum[order.id] = [];
								for (let row of order.orderProducts) {
									sum[order.id][row.id] = Math.trunc(row.product.price * row.quantity * (100 - row.discount) * 0.01);
                }
                // console.log(order);
              }
              console.log(sum);
							return (
								<div style={{ width: '80%', margin: 'auto', marginTop: '20px', marginBottom: '20px' }}>
									{rowData.orders.map((order) => (
										<ExpansionPanel key={order.id}>
											<ExpansionPanelSummary
												expandIcon={<ExpandMoreIcon />}
												aria-controls='panel1a-content'
												id='panel1a-header'
											>
												<Typography>
													<strong>Reference: </strong> {order.id} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
													<strong>Order state: </strong>{' '}
													{order.orderHistories[order.orderHistories.length - 1].orderState}
												</Typography>
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
															{order.orderProducts.map((orderProduct) => (
																<TableRow key={orderProduct.id}>
																	<TableCell component='th' scope='row' align='center'>
																		{orderProduct.product.name}
																	</TableCell>
																	<TableCell align='center'>{orderProduct.product.price} MAD</TableCell>
																	<TableCell align='center'>{orderProduct.quantity}</TableCell>
																	<TableCell align='center'>{orderProduct.discount} %</TableCell>
																	<TableCell align='center'>{sum[order.id][orderProduct.id]} MAD</TableCell>
																</TableRow>
															))}
															<TableRow>
																<TableCell colSpan={3} />
																<TableCell align='center'>
																	<strong>Total</strong>
																</TableCell>
																<TableCell align='center'>
																	<strong>{sum[order.id].reduce((a, b) => a + b)} MAD</strong>
																</TableCell>
															</TableRow>
														</TableBody>
													</Table>
												</TableContainer>
											</ExpansionPanelDetails>
										</ExpansionPanel>
									))}
									{rowData.orders.length === 0 ? (
										<p style={{ textAlign: 'center' }}>
											<strong>No orders available !</strong>
										</p>
									) : null}
								</div>
							);
						}}
						actions={[
							{
								icon: () => {
									return <RefreshRoundedIcon />;
								},
								tooltip: 'Refresh Data',
								isFreeAction: true,
								onClick: () => this.tableRef.current && this.tableRef.current.onQueryChange()
							}
						]}
						icons={{
							Add: () => {
								return <AddBoxIcon />;
							},
							Edit: () => {
								return <EditIcon />;
							}
						}}
					/>
				</div>
			</div>
		);
	}
}

const schemaAdd = Yup.object().shape({
	firstName: Yup.string().required(),
	lastName: Yup.string().notRequired().nullable(),
	phone: Yup.string()
		.matches(/^\+212[5\\6\\7][0-9]{8}$/)
		.required(),
	address: Yup.string().required(),
	city: Yup.string().required()
});

const schemaUpdate = Yup.object().shape({
	id: Yup.number().required(),
	firstName: Yup.string().required(),
	lastName: Yup.string().notRequired().nullable(),
	phone: Yup.string()
		.matches(/^\+212[5\\6\\7][0-9]{8}$/)
		.required(),
	address: Yup.string().required(),
	city: Yup.string().required()
});

export default Customers;
