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

class Stock extends Component {
	constructor(props) {
		super(props);
		this.tableRef = React.createRef();
		this.sizeList = {
			options: sizes,
			getOptionLabel: (option) => option
		};
		this.categoryList = {
			options: categories,
			getOptionLabel: (option) => option
		};
		this.colorList = {
			options: colors,
			getOptionLabel: (option) => option
		};
		this.state = {
			isLoading: false
		};
	}

	affectQuantity = async (event, product, affected) => {
		console.log('product id : ' + product.id);
		console.log('affectedId id : ' + affected.id);
		const { value: quantity } = await Swal.fire({
			text: 'Enter quanity',
			input: 'number',
			min: '0',
			heightAuto: true
		});
		if (quantity <= 0) {
			Swal.fire({
				text: `Value : ${quantity} not allowed !`,
				icon: 'error'
			});
		} else if (quantity > product.quantity) {
			Swal.fire({
				text: `You inserted ${quantity} but you have only ${product.quantity} of ${product.name} !`,
				icon: 'error'
			});
		} else {
			this.setState({
				isLoading: true
			});
			axios
				.post('/admin/products/affect', {
					affectedId: affected.id,
					productId: product.id,
					quantity
				})
				.then(() => {
					this.setState({
						isLoading: false
					});
					Swal.fire({
						text: `${quantity} of ${product.name} moved to ${affected.firstName} ${affected.lastName} at ${affected.city} !`,
						icon: 'success'
          });
          this.tableRef.current.onQueryChange();
				})
				.catch(() => {
					this.setState({
						isLoading: false
					});
					Swal.fire({
						text: `Internal Server Error !`,
						icon: 'error'
					});
				});
		}
	};

	render() {
		return (
			<div>
				<div style={{ maxWidth: '100%', marginBottom: '20px' }}>
					<MaterialTable
						isLoading={this.state.isLoading}
						title='Product List'
						tableRef={this.tableRef}
						columns={[
							{
								field: 'id',
								hidden: true
							},
							{ title: 'Name *', field: 'name' },
							{ title: 'Price *', field: 'price', type: 'numeric' },
							{ title: 'Quantity *', field: 'quantity', type: 'numeric' },
							{ title: 'Weight', field: 'weight', type: 'numeric' },
							{
								title: 'Size',
								field: 'size',
								editComponent: (field) => {
									return (
										<Autocomplete
											defaultValue={field.rowData.size}
											field={field}
											onChange={(event, value) => {
												field.rowData.size = value;
											}}
											{...this.sizeList}
											renderInput={(params) => <TextField {...params} placeholder='Size' />}
										/>
									);
								}
							},
							{
								title: 'Color',
								field: 'color',
								editComponent: (field) => {
									return (
										<Autocomplete
											defaultValue={field.rowData.color}
											field={field}
											onChange={(event, value) => {
												field.rowData.color = value;
											}}
											{...this.colorList}
											renderInput={(params) => <TextField {...params} placeholder='Color' />}
										/>
									);
								}
							},
							{
								title: 'Category',
								field: 'category',
								editComponent: (field) => {
									return (
										<Autocomplete
											defaultValue={field.rowData.category}
											field={field}
											onChange={(event, value) => {
												field.rowData.category = value;
											}}
											{...this.categoryList}
											renderInput={(params) => <TextField {...params} placeholder='Category' />}
										/>
									);
								}
							}
						]}
						options={{
							search: false,
							exportButton: true,
							exportAllData: true,
							exportFileName: 'customers',
							pageSize: 5,
							pageSizeOptions: [5, 10, 20, 50, 100],
							sorting: false,
							actionsColumnIndex: -1
						}}
						data={(query) =>
							new Promise((resolve, reject) => {
								const offset = query.page * query.pageSize;
								const limit = query.pageSize;
								axios
									.get(`/admin/products/getAll/${offset}/${limit}`)
									.then((res) => {
										// console.log(res.data);
										// console.log(res.data.usersStock);
										resolve({
											data: res.data.productList,
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
									console.log(newData);
									schemaAdd.isValid(newData).then(function (valid) {
										if (valid) {
											removeExtraSpaces(newData, 'name');
											axios
												.post('/admin/products/add', newData)
												.then(() => {
													resolve();
												})
												.catch((err) => {
													let msg = 'Internal Server Error !';
													if (err.response) {
														switch (err.response.statusText) {
															case 'Exist':
																msg = 'Name already exists !';
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
									schemaUpdate.isValid(newData).then(function (valid) {
										delete newData.stocks;
										delete newData.createdAt;
										if (valid) {
											removeExtraSpaces(newData, 'name');
											axios
												.post('/admin/products/update', newData)
												.then(() => {
													resolve();
												})
												.catch((err) => {
													let msg = 'Internal Server Error !';
													if (err.response) {
														switch (err.response.statusText) {
															case 'Exist':
																msg = 'Name already exist !';
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
								}),
							onRowDelete: (oldData) =>
								new Promise((resolve, reject) => {
									const id = oldData.id;
									axios
										.delete('/admin/products/delete/' + id)
										.then(() => {
											resolve();
										})
										.catch((err) => {
											let msg = 'Internal Server Error !';
											if (err.response) {
												switch (err.response.statusText) {
													case 'Exist':
														msg = "You can't delete a product affected to a delivery man !";
														break;
												}
											}
											Swal.fire({
												icon: 'error',
												text: msg
											});
											reject();
										});
								})
						}}
						detailPanel={(rowData) => {
							return (
								<div width='100%'>
									<TableContainer component={Paper}>
										<Table
											style={{ width: '80%', margin: 'auto', marginTop: '20px', marginBottom: '20px' }}
											size='small'
											aria-label='a dense table'
										>
											<TableHead>
												<TableRow>
													<TableCell align='center'></TableCell>
													<TableCell align='center'>Full Name</TableCell>
													<TableCell align='center'>City</TableCell>
													<TableCell align='center'>Quantity</TableCell>
													<TableCell align='center'>Action</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{rowData.theStock.map((row) => (
													<TableRow key={row.id}>
														<TableCell>
															<img
																style={{ height: 36, borderRadius: '50%' }}
																src={require('../../../assets/img/delivery-man.png')}
															/>
														</TableCell>
														<TableCell component='th' scope='row' align='center'>
															{row.firstName + ' ' + row.lastName}
														</TableCell>
														<TableCell align='center'>{row.city}</TableCell>
														<TableCell align='center'>{row.quantity}</TableCell>
														<TableCell align='center'>
															<Button
																onClick={(event) => this.affectQuantity(event, rowData, row)}
																size='small'
																variant='contained'
																color='default'
															>
																+
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</div>
							);
						}}
						onRowClick={(event, rowData, togglePanel) => togglePanel()}
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

function createData(name, calories, fat, carbs, protein) {
	return { name, calories, fat, carbs, protein };
}

const rows = [
	createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
	createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
	createData('Eclair', 262, 16.0, 24, 6.0),
	createData('Cupcake', 305, 3.7, 67, 4.3),
	createData('Gingerbread', 356, 16.0, 49, 3.9)
];

const schemaAdd = Yup.object().shape({
	name: Yup.string().required(),
	price: Yup.number().positive().required(),
	quantity: Yup.number().positive().required(),
	weight: Yup.number().positive().notRequired().nullable(),
	size: Yup.string().required().notRequired().nullable(),
	color: Yup.string().required().notRequired().nullable(),
	category: Yup.string().required().notRequired().nullable()
});

const schemaUpdate = Yup.object().shape({
	id: Yup.number().required(),
	name: Yup.string().required(),
	price: Yup.number().positive().required(),
	quantity: Yup.number().positive().required(),
	weight: Yup.number().positive().notRequired().nullable(),
	size: Yup.string().required().notRequired().nullable(),
	color: Yup.string().required().notRequired().nullable(),
	category: Yup.string().required().notRequired().nullable()
});

export default Stock;
