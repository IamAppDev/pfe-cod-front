import React, { Component, useState, useEffect } from 'react';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { Card, CardBody, CardHeader, Col, Progress, Row, Table } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import Widget from '../../shared/Widget';
import Widget2 from '../../shared/Widget2';
import axios from '../../../utils/axios';
import { colors } from '../../shared/Colors';

export function Dashboard() {
	const [data, setData] = useState({
		count: {},
		totalOpAndDm: [],
		totalMAD: 0,
		products: [],
		topCustomers: []
	});

	useEffect(() => {
		axios
			.get('/admin/dashboard')
			.then((res) => {
				let products = JSON.parse(res.data.products);
				// let topCustomers = products.map((e) => e[1].customer);
				products.sort((a, b) =>
					a[1].totalOrders < b[1].totalOrders ? 1 : a[1].totalOrders > b[1].totalOrders ? -1 : 0
				);
				products = products.slice(0, 10);
				setData({
					count: res.data.count,
					totalOpAndDm: res.data.totalOpAndDm,
					totalMAD: res.data.totalMAD,
					// topCustomers,
					products
				});
			})
			.catch(() => {});
	}, []);

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<div>
			<Row>
				<Col xs='12' lg='3'>
					<Col xs='12'>
						<Widget icon='icon-basket-loaded' backgroundColor={colors.new} header={data.count.new} value='25' invert>
							New Orders
						</Widget>
					</Col>
					<Col xs='12'>
						<Widget
							icon='icon-basket-loaded'
							backgroundColor={colors.pending}
							header={data.count.pending}
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
							header={data.count.confirmed}
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
							header={data.count.canceled}
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
							header={data.count.shipped}
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
							header={data.count.delivered}
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
							header={data.count.returned}
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
										data.count.new,
										data.count.pending,
										data.count.confirmed,
										data.count.shipped,
										data.count.canceled,
										data.count.delivered,
										data.count.returned
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
			{/*  */}
			<Row style={{ marginTop: 40, marginBottom: 40 }}>
				<Col xs='12' lg='6'>
					<Card>
						<CardHeader>Top 10 Products</CardHeader>
						<CardBody>
							<Table hover responsive className='table-outline mb-0 d-none d-sm-table'>
								<thead className='thead-light'>
									<tr>
										<th>Name</th>
										<th>Total Orders</th>
									</tr>
								</thead>
								<tbody>
									{data.products.map((product) => (
										<tr key={product[0]}>
											<td>
												<div>{product[1].name}</div>
												<div className='small text-muted'></div>
											</td>
											<td>
												<div>{product[1].totalOrders}</div>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</CardBody>
					</Card>
				</Col>
				<Col xs='12' lg='6'>
					{data.totalOpAndDm.map((element) => (
						<React.Fragment key={element.roleLibelle}>
							<Widget2
								dataBox={() => ({
									variant: 'facebook',
									[element.roleLibelle]: element.roleLibelleCount
								})}
							></Widget2>
						</React.Fragment>
					))}
				</Col>
			</Row>
			{/*  */}
			{/* <Row style={{ marginTop: 40, marginBottom: 40 }}>
				<Col xs='12' lg='12'>
					<Card>
						<CardHeader>Top Customers</CardHeader>
						<CardBody>
							<Table hover responsive className='table-outline mb-0 d-none d-sm-table'>
								<thead className='thead-light'>
									<tr>
										<th className='text-center'>
											<i className='icon-people'></i>
										</th>
										<th>Full Name</th>
										<th className='text-center'>City</th>
										<th>Address</th>
										<th className='text-center'>Payment Method</th>
										<th>Total Amount Spent</th>
									</tr>
								</thead>
								<tbody>
									{data.topCustomers.map((customer) => (
										<tr key={customer.id}>
											<td className='text-center'>
												<div className='avatar'>
													<img
														src={'assets/img/avatars/1.jpg'}
														className='img-avatar'
														alt='admin@bootstrapmaster.com'
													/>
													<span className='avatar-status badge-success'></span>
												</div>
											</td>
											<td>
												<div>
													{customer.firstName} {customer.lastName}
												</div>
												<div className='small text-muted'>
													<span>New</span> | Registered: Jan 1, 2015
												</div>
											</td>
											<td className='text-center'>
												<i className='flag-icon flag-icon-us h4 mb-0' title='us' id='us'></i>
											</td>
											<td>
												<div className='clearfix'>
													<div className='float-left'>
														<strong>50%</strong>
													</div>
													<div className='float-right'>
														<small className='text-muted'>Jun 11, 2015 - Jul 10, 2015</small>
													</div>
												</div>
												<Progress className='progress-xs' color='success' value='50' />
											</td>
											<td className='text-center'>
												<i className='fa fa-cc-mastercard' style={{ fontSize: 24 + 'px' }}></i>
											</td>
											<td>
												<div className='small text-muted'>Last login</div>
												<strong>10 sec ago</strong>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</CardBody>
					</Card>
				</Col>
			</Row> */}
		</div>
	);
}

export default Dashboard;
