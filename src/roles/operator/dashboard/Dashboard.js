import React, { Component, useState, useEffect } from 'react';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import {
	Badge,
	Button,
	ButtonDropdown,
	ButtonGroup,
	ButtonToolbar,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardTitle,
	Col,
	Container,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Progress,
	Row,
	Table
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import Widget from '../../shared/Widget';
import axios from '../../../utils/axios';
import { colors } from '../../shared/Colors';

export function Dashboard() {
	const [orderStates, setOrderStates] = useState({});

	useEffect(() => {
		axios
			.get('/operator/dashboard/orderStates')
			.then((res) => {
				setOrderStates(res.data);
			})
			.catch(() => {});
	}, []);

	useEffect(() => {
		console.log(orderStates);
	});

	return (
		<Row>
			<Col xs='12' lg='3'>
				<Col xs='12'>
					<Widget icon='icon-basket-loaded' backgroundColor={colors.new} header={orderStates.new} value='25' invert>
						New Orders
					</Widget>
				</Col>
				<Col xs='12'>
					<Widget
						icon='icon-basket-loaded'
						backgroundColor={colors.pending}
						header={orderStates.pending}
						value='25'
						invert
					>
						Pending Orders
					</Widget>
				</Col>
				<Col xs='12'>
					<Widget
						icon='icon-basket-loaded'
						backgroundColor={colors.confirmed}
						header={orderStates.confirmed}
						value='25'
						invert
					>
						Confirmed Orders
					</Widget>
				</Col>
				<Col xs='12'>
					<Widget
						icon='icon-basket-loaded'
						backgroundColor={colors.canceled}
						header={orderStates.canceled}
						value='25'
						invert
					>
						Canceled Orders
					</Widget>
				</Col>
			</Col>
			<Col xs='12' lg='3'>
				<Col xs='12'>
					<Widget
						icon='icon-basket-loaded'
						backgroundColor={colors.shipped}
						header={orderStates.shipped}
						value='25'
						invert
					>
						Shipped Orders
					</Widget>
				</Col>
				<Col xs='12'>
					<Widget
						icon='icon-basket-loaded'
						backgroundColor={colors.delivered}
						header={orderStates.delivered}
						value='25'
						invert
					>
						Delivered Orders
					</Widget>
				</Col>
				<Col xs='12'>
					<Widget
						icon='icon-basket-loaded'
						backgroundColor={colors.returned}
						header={orderStates.returned}
						value='90'
						invert
					>
						Returned Orders
					</Widget>
				</Col>
			</Col>
			<Col xs='12' lg='6'>
				<Pie
					options={{ maintainAspectRatio: false }}
					data={{
						datasets: [
							{
								data: [
									orderStates.new,
									orderStates.pending,
									orderStates.confirmed,
									orderStates.shipped,
									orderStates.canceled,
									orderStates.delivered,
									orderStates.returned
								],
								backgroundColor: [
									colors.new,
									colors.pending,
									colors.confirmed,
									colors.shipped,
									colors.canceled,
									colors.delivered,
									colors.returned
								]
							}
						],
						labels: ['New', 'Pending', 'Confirmed', 'Shipped', 'Canceled', 'Delivered', 'Returned']
					}}
				/>
			</Col>
		</Row>
	);
}

export default Dashboard;
