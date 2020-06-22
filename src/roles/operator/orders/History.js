import React, { Component, useState, useEffect, memo } from 'react';
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

function History({ rowData, dmList, setReload }) {
	const [orderId, setOrderId] = React.useState(rowData.id);
	const [orderStates, setOrderStates] = React.useState([]);
	const [orderState, setOrderState] = React.useState(
		rowData.orderHistories[rowData.orderHistories.length - 1].orderState
	);
	const [selectedOrderState, setSelectedOrderState] = React.useState('');
	const [labelAutoComplete, setLabelAutoComplete] = React.useState('');
	const [showUpdateState, setShowUpdateState] = React.useState(false);
	const [description, setDescription] = React.useState('');
	const [deliverymanId, setDeliverymanId] = React.useState(0);

	const handleShowUpdate = (orderState) => {
		switch (orderState) {
			case 'new':
				setLabelAutoComplete('Order State');
				setOrderStates(['pending', 'canceled', 'confirmed']);
				setShowUpdateState(true);
				break;
			case 'pending':
				setLabelAutoComplete('Order State');
				setOrderStates(['canceled', 'confirmed']);
				setShowUpdateState(true);
				break;
			case 'confirmed':
				setLabelAutoComplete('Delivery Man');
				setOrderStates(dmList);
				setShowUpdateState(true);
				break;
			default:
				setShowUpdateState(false);
		}
	};

	const handleUpdateState = () => {
		const orderObj = {
			orderId,
			orderState: selectedOrderState,
			description,
			deliverymanId
		};
		console.log(selectedOrderState);
		console.log(deliverymanId);
		if (selectedOrderState || deliverymanId !== 0) {
			console.log('go');
			axios
				.post('/operator/orders/update', orderObj)
				.then(() => {
					setReload(true);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	React.useEffect(() => {
		handleShowUpdate(orderState);
	}, []);

	return (
		<ExpansionPanel>
			<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel2a-content' id='panel2a-header'>
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

							{showUpdateState ? (
								<TableRow>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell>
										<Autocomplete
											id='combo-box-demo'
											options={orderStates}
											onChange={(event, val) => {
												if (orderState === 'confirmed' && val !== null) {
													setDeliverymanId(val.id);
												} else {
													setSelectedOrderState(val);
												}
											}}
											getOptionLabel={(option) =>
												orderState === 'confirmed'
													? `[${option.totalCurrentOrders} order(s)] ${option.firstName} ${option.lastName} => ${option.city}`
													: option
											}
											style={{ width: '300px', float: 'right' }}
											// style={{ height: '1em' }}
											renderInput={(params) => (
												<TextField
													// style={{ height: '100px' }}
													{...params}
													label={labelAutoComplete}
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
												setDescription(event.target.value);
											}}
											value={description}
										/>
									</TableCell>
									<TableCell style={{ with: '150px' }}>
										<Button onClick={handleUpdateState} variant='contained' color='primary'>
											Validate
										</Button>
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</TableContainer>
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);
}

export default memo(History);
