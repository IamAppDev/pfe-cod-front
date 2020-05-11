import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
	Button,
	Card,
	CardBody,
	CardGroup,
	Col,
	Container,
	Form,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row
} from 'reactstrap';
import axios from '../../utils/axios';
import Auth from '../../utils/Auth';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			submitDisabled: false
		};
	}

	onHandleInputChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	onHandleSubmit = (event) => {
		this.setState({
			submitDisabled: true
		});
		event.preventDefault();
		axios
			.post('/login', {
				email: this.state.email,
				password: this.state.password
			})
			.then((res) => {
				const token = res.headers['x-auth-token'];
				const refreshToken = res.headers['x-refresh-token'];
				this.props.login(Auth.login(token, refreshToken));
				this.props.history.replace('/dashboard');
			})
			.catch((err) => {
				if (err.response) {
					switch (err.response.statusText) {
						case 'Incorrect':
							MySwal.fire({ text: 'Email/Password Incorrect(s) !', icon: 'error' });
							break;
						case 'NeedConfirmation':
							MySwal.fire({ text: 'Your account need to be confirmed !', icon: 'error' });
							break;
						case 'AccountDisabled':
							MySwal.fire({ text: 'Your account is disabled !', icon: 'error' });
							break;
						case 'DataRequired':
							MySwal.fire({ text: 'Email/Password required !', icon: 'error' });
							break;
						default:
							MySwal.fire({ text: 'Internal Server Error !', icon: 'error' });
					}
					console.log(err.response.statusText);
				} else {
					MySwal.fire({ text: 'Network Error !', icon: 'error' });
				}
				this.setState({
					submitDisabled: false
				});
			});
	};

	componentDidMount() {
		// console.log(axios.defaults);
	}

	render() {
		return (
			<div className='app flex-row align-items-center'>
				<Container>
					<Row className='justify-content-center'>
						<Col md='8'>
							<CardGroup>
								<Card className='p-4'>
									<CardBody>
										<Form onSubmit={this.onHandleSubmit}>
											<h1>Login</h1>
											<p className='text-muted'>Sign In to your account</p>
											<InputGroup className='mb-3'>
												<InputGroupAddon addonType='prepend'>
													<InputGroupText>@</InputGroupText>
												</InputGroupAddon>
												<Input
													name='email'
													onChange={(event) => this.onHandleInputChange(event)}
													type='email'
													placeholder='Email'
													autoComplete='username'
													required
												/>
											</InputGroup>
											<InputGroup className='mb-4'>
												<InputGroupAddon addonType='prepend'>
													<InputGroupText>
														<i className='icon-lock'></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input
													name='password'
													onChange={(event) => this.onHandleInputChange(event)}
													type='password'
													placeholder='Password'
													autoComplete='password'
													required
												/>
											</InputGroup>
											<Row>
												<Col xs='6'>
													<Button disabled={this.state.submitDisabled} type='submit' color='primary' className='px-4'>
														Login
													</Button>
												</Col>
												<Col xs='6' className='text-right'>
													<Button type='submit' color='link' className='px-0'>
														Forgot password?
													</Button>
												</Col>
											</Row>
										</Form>
									</CardBody>
								</Card>
								<Card className='text-white bg-primary py-5 d-md-down-none' style={{ width: '44%' }}>
									<CardBody className='text-center'>
										<div>
											<h2>Sign up</h2>
											<p>
												Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
												labore et dolore magna aliqua.
											</p>
											<Link to='/register'>
												<Button color='primary' className='mt-3' active tabIndex={-1}>
													Register Now!
												</Button>
											</Link>
										</div>
									</CardBody>
								</Card>
							</CardGroup>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		login: (payload) => {
			dispatch(actionCreators.login(payload));
		}
	};
};

export default connect(null, mapDispatchToProps)(Login);
