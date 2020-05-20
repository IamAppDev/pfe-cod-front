import React, { Component } from 'react';
import {
	Col,
	Row,
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	FormFeedback,
	FormText,
	CustomInput,
	Alert
} from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import axios from '../../../utils/axios';
import Swal from 'sweetalert2/src/sweetalert2.js';
import * as yup from 'yup';
import cities from '../../../utils/enums/cities';

export class AddOrder extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	submitOrder = () => {
		this.setState({
			showErrorAlert: false,
			showErrorAlertCustomer: false
		});
		if (!this.state.customerChecked) {
			if (this.state.customer.length > 0 && this.state.source.length > 0 && this.state.products.length > 0) {
				let products = this.state.products.map((element) => {
					return {
						productId: element.id,
						quantity: element.quantity,
						discount: element.discount
					};
				});
				let orderToAdd = {
					customerId: this.state.customer[0].id,
					sourceId: this.state.source[0].id,
					tracking: this.state.tracking,
					description: this.state.description,
					products
				};
				schema.isValid(orderToAdd).then((isValid) => {
					if (!isValid) {
						this.setState({
							showErrorAlert: true
						});
					} else {
						this.setState({
							submitButton: true
						});
						axios
							.post('/operator/orders/add', orderToAdd)
							.then(() => {
								Swal.fire({
									icon: 'success',
									text: 'Order added !'
								});
								this.setState(initialState);
							})
							.catch(() => {
								Swal.fire({
									icon: 'error',
									text: 'Internal Server Error !'
								});
							});
						this.setState({
							submitButton: false
						});
					}
				});
			} else {
				this.setState({
					showErrorAlert: true
				});
			}
		} else {
			if (this.state.source.length > 0 && this.state.products.length > 0) {
				let products = this.state.products.map((element) => {
					return {
						productId: element.id,
						quantity: element.quantity,
						discount: element.discount
					};
				});
				let orderToAdd = {
					customer: this.state.customerToCreate,
					sourceId: this.state.source[0].id,
					tracking: this.state.tracking,
					description: this.state.description,
					products
				};
				schemaWithCustomer.isValid(orderToAdd).then((isValid) => {
					if (!isValid) {
						this.setState({
							showErrorAlertCustomer: true
						});
					} else {
						this.setState({
							submitButton: true
						});
						axios
							.post('/operator/orders/addWithCustomer', orderToAdd)
							.then(() => {
								Swal.fire({
									icon: 'success',
									text: 'Order added !'
								});
								this.setState(initialState);
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
							});
						this.setState({
							submitButton: false
						});
					}
				});
			} else {
				this.setState({
					showErrorAlertCustomer: true
				});
			}
		}
	};

	componentDidMount() {
		this.loadCPs();
	}

	loadCPs = () => {
		axios
			.get('/operator/orders/getCPS')
			.then((res) => {
				this.setState({
					customerList: res.data.customers,
					productList: res.data.products,
					sourceList: res.data.sources
				});
			})
			.catch(() => {
				Swal.fire({
					icon: 'error',
					text: 'Internal Server Error ! Data not loaded.'
				});
			});
		this.setState({
			reloadCPS: false
		});
	};

	componentDidUpdate() {
		if (this.state.reloadCPS) {
			this.loadCPs();
		}
	}

	addNewCustomer = (e) => {
		this.setState({
			customerToCreate: {
				...this.state.customerToCreate,
				[e.target.name]: e.target.value
			}
		});
	};

	render() {
		let products = [];
		for (let i = 0; i < this.state.totalProducts; i++) {
			products.push(
				<Row key={i} style={{ margin: '10px' }}>
					<Label md={1}>Product</Label>
					<Col md={3}>
						<Typeahead
							clearButton
							id={i}
							onChange={(selected) => {
								let products = [...this.state.products];
								delete products[i].id;
								delete products[i].name;
								delete products[i].price;
								products[i] = { ...products[i], ...selected[0] };
								this.setState({
									products
								});
							}}
							selected={this.state.products[i].id ? [this.state.products[i]] : []}
							labelKey={(option) => `${option.name} [${option.price} MAD]`}
							options={this.state.productList}
						/>
					</Col>
					<Label md={1}>Quantity</Label>
					<Col md={3}>
						<Input
							type='number'
							name='quantity'
							id={i}
							onChange={(e) => {
								let products = [...this.state.products];
								products[e.target.id].quantity = e.target.value;
								this.setState({
									products
								});
							}}
							value={this.state.products[i].quantity}
						/>
					</Col>
					<Label md={1}>Discount</Label>
					<Col md={3}>
						<Input
							type='number'
							name='discount'
							id='discount'
							id={i}
							onChange={(e) => {
								let products = [...this.state.products];
								products[e.target.id].discount = e.target.value;
								this.setState({
									products
								});
							}}
							value={this.state.products[i].discount}
						/>
					</Col>
				</Row>
			);
		}
		let citiesOption = [];
		for (let i = 0; i < cities.length; i++) {
			citiesOption.push(
				<option key={cities[i]} value={cities[i]}>
					{cities[i]}
				</option>
			);
		}

		return (
			<div>
				<Card>
					<CardHeader>
						<strong>Add Order</strong>
					</CardHeader>
					<CardBody>
						<Form>
							<Row>
								<Col>
									<FormGroup>
										<Label>
											<CustomInput
												onChange={(e) => {
													this.setState({
														customerChecked: e.target.checked
													});
												}}
												checked={this.state.customerChecked}
												type='switch'
												id='customerSwitch'
												name='customerSwitch'
												label='Customer * Choose from existing ones or switch on to add manually'
											/>
										</Label>
										{!this.state.customerChecked ? (
											<Typeahead
												clearButton
												id='customer'
												onChange={(selected) => {
													this.setState({
														customer: selected
													});
												}}
												selected={this.state.customer}
												labelKey={(option) => `${option.firstName} ${option.lastName} ${option.phone} [${option.city}]`}
												options={this.state.customerList}
											/>
										) : (
											<div style={{ margin: '20px' }}>
												<FormGroup row>
													<Label for='firstName' sm={2}>
														First Name
													</Label>
													<Col sm={4}>
														<Input
															type='text'
															name='firstName'
															id='firstName'
															onChange={(e) => {
																this.addNewCustomer(e);
															}}
															value={this.state.customerToCreate.firstName}
														/>
													</Col>
													<Label for='lastName' sm={2}>
														Last Name
													</Label>
													<Col sm={4}>
														<Input
															type='text'
															name='lastName'
															id='lastName'
															onChange={(e) => {
																this.addNewCustomer(e);
															}}
															value={this.state.customerToCreate.lastName}
														/>
													</Col>
												</FormGroup>
												<FormGroup row>
													<Label for='phone' sm={2}>
														Phone
													</Label>
													<Col sm={4}>
														<Input
															type='text'
															name='phone'
															id='phone'
															onChange={(e) => {
																this.addNewCustomer(e);
															}}
															value={this.state.customerToCreate.phone}
														/>
													</Col>
													<Label for='city' sm={2}>
														City
													</Label>
													<Col sm={4}>
														<Typeahead
															clearButton
															id='city'
															onChange={(selected) => {
																console.log(selected);
																this.setState({
																	customerToCreate: {
																		...this.state.customerToCreate,
																		city: selected.length === 0 ? '' : selected[0]
																	}
																});
															}}
															labelKey={(option) => `${option}`}
															options={cities}
															selected={
																this.state.customerToCreate.city === '' ? [] : [this.state.customerToCreate.city]
															}
														/>
													</Col>
												</FormGroup>
												<FormGroup row>
													<Label for='address' sm={2}>
														Address
													</Label>
													<Col sm={10}>
														<Input
															type='text'
															name='address'
															id='address'
															onChange={(e) => {
																this.addNewCustomer(e);
															}}
															value={this.state.customerToCreate.address}
														/>
													</Col>
												</FormGroup>
											</div>
										)}
									</FormGroup>
								</Col>
							</Row>
							<Row style={{ marginTop: '20px' }}>
								<Col>
									<FormGroup>
										<Label for='source'>Source*</Label>
										<Typeahead
											clearButton
											id='source'
											onChange={(selected) => {
												this.setState({
													source: selected
												});
											}}
											selected={this.state.source}
											labelKey={(option) => `${option.name} [${option.type}]`}
											options={this.state.sourceList}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col md={6}>
									<FormGroup>
										<Label for='tracking'>Tracking Number</Label>
										<Input
											type='text'
											name='tracking'
											id='tracking'
											onChange={(e) => {
												this.setState({
													tracking: e.target.value
												});
											}}
											value={this.state.tracking}
										/>
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label for='description'>Description</Label>
										<Input
											type='text'
											name='description'
											id='description'
											onChange={(e) => {
												this.setState({
													description: e.target.value
												});
											}}
											value={this.state.description}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col md={12}>
									<Card style={{ margin: '5px' }}>
										<CardHeader>
											<Row>
												<Col xs={8} md={10}>
													<strong>Products*</strong>
												</Col>
												<Col xs={4} md={2}>
													<Row>
														<Col>
															<Button
																size='sm'
																color='danger'
																onClick={() => {
																	if (this.state.totalProducts > 1) {
																		let products = [...this.state.products];
																		products.pop();
																		this.setState({
																			totalProducts: this.state.totalProducts - 1,
																			products
																		});
																	}
																}}
															>
																Remove
															</Button>
														</Col>
														<Col>
															<Button
																size='sm'
																color='success'
																onClick={() => {
																	this.setState({
																		totalProducts: this.state.totalProducts + 1,
																		products: [...this.state.products, { quantity: 1, discount: 0 }]
																	});
																}}
															>
																Add
															</Button>
														</Col>
													</Row>
												</Col>
											</Row>
										</CardHeader>
										<CardBody>{products}</CardBody>
									</Card>
								</Col>
							</Row>
						</Form>
						{this.state.showErrorAlert ? (
							<Alert style={{ margin: '20px' }} color='danger'>
								<p>Please check the following:</p>
								<ul>
									<li>Customer, Source, 1 Product at least are required.</li>
									<li>Quantity: min => 1</li>
									<li>Discount: min => 0 max => 100</li>
								</ul>
							</Alert>
						) : null}
						{this.state.showErrorAlertCustomer ? (
							<Alert style={{ margin: '20px' }} color='danger'>
								<p>Please check the following:</p>
								<ul>
									<li>Customer, Source at least are required.</li>
									<li>1 Product at least is required.</li>
									<li>First Name, Phone, City, Address are required.</li>
									<li>Phone must start with: +212</li>
									<li>Quantity: min => 1</li>
									<li>Discount: min => 0 max => 100</li>
								</ul>
							</Alert>
						) : null}
					</CardBody>
					<CardFooter>
						<Row>
							<Col md={{ size: 3, offset: 4 }}>
								<Button block color='primary' onClick={this.submitOrder} disabled={this.state.submitButton}>
									<i className='icon-check'></i> Submit Order
								</Button>
							</Col>
						</Row>
					</CardFooter>
				</Card>
			</div>
		);
	}
}

let schema = yup.object().shape({
	customerId: yup.number().required(),
	sourceId: yup.number().required().positive().integer().required(),
	tracking: yup.string(),
	description: yup.string(),
	products: yup
		.array()
		.of(
			yup.object().shape({
				productId: yup.number().required().positive().integer().required(),
				quantity: yup.number().required().positive().integer().min(1).required(),
				discount: yup.number().required().positive().integer().min(0).max(100).required()
			})
		)
		.min(1)
		.required()
});

let schemaWithCustomer = yup.object().shape({
	customer: yup.object().shape({
		firstName: yup.string().required(),
		lastName: yup.string().min(0),
		phone: yup
			.string()
			.matches(/^\+212[5\\6\\7][0-9]{8}$/)
			.required(),
		city: yup.mixed().oneOf(cities).required(),
		address: yup.string().required()
	}),
	sourceId: yup.number().required().positive().integer().required(),
	tracking: yup.string(),
	description: yup.string(),
	products: yup
		.array()
		.of(
			yup.object().shape({
				productId: yup.number().required().positive().integer().required(),
				quantity: yup.number().required().positive().integer().min(1).required(),
				discount: yup.number().required().positive().integer().min(0).max(100).required()
			})
		)
		.min(1)
		.required()
});

const initialState = {
	totalProducts: 1, // number of product line input
	products: [{ quantity: 1, discount: 0 }],
	defaultProduct: [{}],
	customer: [], // selected customer
	source: [], // selected source
	tracking: '', // inserted tracking
	description: '', // inserted description
	productList: [], // loaded
	customerList: [], // loaded
	sourceList: [], // loaded
	customerChecked: false, // enable add customer manually
	showErrorAlert: false,
	showErrorAlertCustomer: false,
	submitButton: false,
	customerToCreate: {
		firstName: '',
		lastName: '',
		phone: '+212',
		city: '',
		address: ''
	},
	reloadCPS: true
};

export default AddOrder;
