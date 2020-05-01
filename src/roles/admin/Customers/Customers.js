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
						title='Customer List'
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
							{ title: 'Created By', field: 'createdBy', editable: 'never' },
							{ title: 'Created at', field: 'createdAt', editable: 'never', type: 'date' }
						]}
						options={{
							search: false,
							exportButton: true,
							exportAllData: true,
							exportFileName: 'customers',
							pageSizeOptions: [5, 10, 20, 50, 100, 200],
							sorting: true,
							actionsColumnIndex: -1
						}}
						data={(query) =>
							new Promise((resolve, reject) => {
								const offset = query.page * query.pageSize;
								const limit = query.pageSize;
								axios
									.get(`/admin/customers/getAll/${offset}/${limit}`)
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
												.post('/admin/customers/add', newData)
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
									schemaUpdate.isValid(newData).then(function (valid) {
										delete newData.createdBy;
										delete newData.createdAt;
										if (valid) {
											delete newData.createdAt;
											const updatedData = { ...newData };
											removeExtraSpaces(updatedData, 'firstName', 'lastName', 'phone', 'address');
											if (oldData.phone === newData.phone) {
												delete updatedData.phone;
											}
											axios
												.post('/admin/customers/update', updatedData)
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
								}),
							onRowDelete: (oldData) =>
								new Promise((resolve, reject) => {
									const id = oldData.id;
									axios
										.delete('/admin/customers/delete/' + id)
										.then(() => {
											resolve();
										})
										.catch((err) => {
											let msg = 'Internal Server Error !';
											if (err.response) {
												switch (err.response.statusText) {
													case 'OrderExist':
														msg = "You can't delete a customer having already an order !";
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
		.required()
		.notRequired(),
	address: Yup.string().required(),
	city: Yup.string().required()
});

export default Customers;
