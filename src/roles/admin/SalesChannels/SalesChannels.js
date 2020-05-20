import React, { Component } from 'react';
import './SalesChannels.css';
import MaterialTable, { MTableToolbar } from 'material-table';
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
import sources from '../../../utils/enums/sources';

class SalesChannels extends Component {
	constructor(props) {
		super(props);
		this.tableRef = React.createRef();
		this.sourceList = {
			options: sources,
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
					title='Sales Channel List'
					tableRef={this.tableRef}
					columns={[
						{
							field: 'id',
							hidden: true
						},
						{ title: 'Name *', field: 'name', cellStyle: { margin: 'auto' } },
						{
							title: 'Type *',
							field: 'type',
							editComponent: (field) => {
								return (
									<Autocomplete
										defaultValue={field.rowData.type}
										field={field}
										onChange={(event, value) => {
											field.rowData.type = value;
										}}
										{...this.sourceList}
										id='debug'
										debug
										renderInput={(params) => <TextField {...params} placeholder='type' />}
									/>
								);
							}
						},
						{ title: 'Created at', field: 'createdAt', editable: 'never', type: 'date' }
					]}
					options={{
						exportButton: true,
						sorting: true,
						actionsColumnIndex: -1,
						filtering: true,
						search: false,
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
							console.log(params.filters);
							axios
								.get(`/admin/sources/getAll/${offset}/${limit}`, { params })
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
											.post('/admin/sources/add', newData)
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
										delete newData.createdAt;
										delete newData.updatedAt;
										delete newData.userId;
										delete newData.user;
										console.log(newData);
										axios
											.post('/admin/sources/update', newData)
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
											text: 'Please check values inserted !'
										});
										reject();
									}
								});
							}),
						onRowDelete: (oldData) =>
							new Promise((resolve, reject) => {
								const id = oldData.id;
								axios
									.delete('/admin/sources/delete/' + id)
									.then(() => {
										resolve();
									})
									.catch((err) => {
										let msg = 'Internal Server Error !';
										if (err.response) {
											switch (err.response.statusText) {
												case 'OrderExist':
													msg = "You can't delete a source affected to an order !";
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
				{/* </MuiThemeProvider> */}
			</div>
		);
	}
}

function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
}

const schemaAdd = Yup.object().shape({
	name: Yup.string().required(),
	type: Yup.string().required()
});

const schemaUpdate = Yup.object().shape({
	id: Yup.number().required(),
	name: Yup.string().required(),
	type: Yup.string().required()
});

export default SalesChannels;
