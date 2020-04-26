import React, { Component } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
// import Chip from '@material-ui/core/Chip';
// import Icon from '@material-ui/core/Icon';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
// import RefreshIcon from '@material-ui/icons/Refresh';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import RefreshIcon from '@material-ui/icons/Refresh';
import red from '@material-ui/core/colors/red';
import deepOrange from '@material-ui/core/colors/deepOrange';
import * as Yup from 'yup';
import Swal from 'sweetalert2/src/sweetalert2.js';

//
import axios from '../../../utils/axios';
import cities from '../../../utils/cities';

class Users extends Component {
	constructor(props) {
		super(props);
		this.tableRef = React.createRef();
		// this.theme = createMuiTheme({
		// 	palette: {
		// 		primary: {
		// 			main: '#689f38'
		// 		},
		// 		secondary: {
		// 			main: '#ff9100'
		// 		}
		// 	}
		// });
		this.cityList = {
			options: cities,
			getOptionLabel: (option) => option /*.name*/
		};
		this.state = {
			isLoading: false
		};
	}
	render() {
		return (
			<div style={{ maxWidth: '100%', marginBottom: '20px' }}>
				{/* <MuiThemeProvider theme={this.theme}> */}
				<MaterialTable
					isLoading={this.state.isLoading}
					title='User List'
					tableRef={this.tableRef}
					columns={[
						{
							field: 'id',
							hidden: true
						},
						{
							title: 'Role',
							field: 'roleLibelle',
							lookup: { ROLE_OPERATOR: 'Operator', ROLE_DELIVERYMAN: 'Delivery Man' },
							editable: 'onAdd',
							render: (field) => {
								return (
									<img
										style={{ height: 36, borderRadius: '50%' }}
										src={require(field.roleLibelle === 'ROLE_OPERATOR'
											? '../../../assets/img/support.png'
											: '../../../assets/img/delivery-man.png')}
									/>
								);
							}
						},
						{ title: 'First Name', field: 'firstName' },
						{ title: 'Last Name', field: 'lastName' },
						{ title: 'Email', field: 'email' },
						{
							title: 'City',
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
						{ title: 'Phone', field: 'phone' },
						{ title: 'Id Crad', field: 'idCard' },
						{ title: 'Price', field: 'price', type: 'numeric' },
						{ title: 'Active', field: 'active', type: 'boolean', initialEditValue: true },
						{ title: 'Created at', field: 'createdAt', editable: 'never', type: 'date' }
					]}
					options={{
						exportButton: true,
						sorting: true,
						actionsColumnIndex: -1
					}}
					data={(query) =>
						new Promise((resolve, reject) => {
							const offset = query.page * query.pageSize;
							const limit = query.pageSize;
							axios
								.get(`/admin/users/getAll/${offset}/${limit}`)
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
											.post('/admin/users/add', newData)
											.then(() => {
												resolve();
											})
											.catch((err) => {
												Swal.fire({
													icon: 'error',
													text: 'Email already exists !'
												});
												reject();
											});
									} else {
										Swal.fire({
											icon: 'error',
											text: 'Please check values inserted !'
										});
										reject();
									}
								});
							}),
						onRowUpdate: (newData, oldData) =>
							new Promise((resolve, reject) => {
								schemaUpdate.isValid(newData).then(function (valid) {
									if (valid) {
										delete newData.updatedAt;
										delete newData.createdAt;
										delete newData.roleLibelle;
										axios
											.post('/admin/users/update', newData)
											.then(() => {
												resolve();
											})
											.catch((err) => {
												Swal.fire({
													icon: 'error',
													text: `Email already exists !`
												});
												reject();
											});
									} else {
										Swal.fire({
											icon: 'error',
											text: `FirstName, LastName, Email are required !`
										});
										reject();
									}
								});
							})
					}}
					actions={[
						{
							icon: () => {
								return <RefreshRoundedIcon />;
							},
							tooltip: 'Refresh Data',
							isFreeAction: true,
							onClick: () => this.tableRef.current && this.tableRef.current.onQueryChange()
						},
						{
							icon: () => {
								return <VpnKeyIcon />;
							},
							tooltip: 'Send New Password',
							isFreeAction: false,
							onClick: (event, row) => {
								Swal.queue([
									{
										text: 'New generated password will be sent to the owner of this email : ' + row.email,
										confirmButtonText: 'Generate password',
										showCancelButton: true,
										showLoaderOnConfirm: true,
										icon: 'question',
										preConfirm: () => {
											return axios
												.post('/admin/users/resetPassword', {
													id: row.id,
													firstName: row.firstName,
													email: row.email
												})
												.then(() => {
													Swal.insertQueueStep({
														icon: 'success',
														text: 'Password sent successfully !'
													});
												})
												.catch(() => {
													Swal.insertQueueStep({
														icon: 'error',
														text: 'Internal Server Error !'
													});
												});
										}
									}
								]);
							}
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
				{/* </MuiThemeProvider> */}
			</div>
		);
	}
}

const schemaAdd = Yup.object().shape({
	roleLibelle: Yup.string().required(),
	firstName: Yup.string().min(3).max(20).required(),
	lastName: Yup.string().min(3).max(20).required(),
	email: Yup.string().email().required(),
	city: Yup.string().notRequired(),
	price: Yup.number().positive().notRequired(),
	idCard: Yup.string().max(8).notRequired(),
	phone: Yup.string().min(10).max(12).notRequired(),
	active: Yup.boolean().required()
});

const schemaUpdate = Yup.object().shape({
	id: Yup.number().required(),
	firstName: Yup.string().min(3).max(20).required(),
	lastName: Yup.string().min(3).max(20).required(),
	email: Yup.string().email().required(),
	city: Yup.string().notRequired().nullable(),
	price: Yup.number().positive().notRequired().nullable(),
	idCard: Yup.string().max(8).notRequired().nullable(),
	phone: Yup.string().min(10).max(12).notRequired().nullable(),
	active: Yup.boolean().required()
});

export default Users;
