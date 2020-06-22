import React, { Component, useState, useEffect, memo } from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function Products({ rowData }) {
	let sum = [];
	for (let row of rowData.orderProducts) {
		sum[row.id] = Math.trunc(row.product.price * row.quantity * (100 - row.discount) * 0.01);
	}

	return (
		<ExpansionPanel>
			<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
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
	);
}

export default memo(Products);
