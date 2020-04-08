import React, { Component } from 'react';
import {
	Button,
	Card,
	CardBody,
	// CardFooter,
	Col,
	Container,
	// Form,
	FormFeedback,
	Input,
	Label,
	// FormGroup,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row
} from 'reactstrap';
import axios from '../../../axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitDisabled: false,
			captchaValidated: false,
			showAlert: true
		};
	}

	onChangeCaptcha = () => {
		this.setState({ captchaValidated: true });
	};

	render() {
		return (
			<div className='app flex-row align-items-center'>
				<Container>
					<Row className='justify-content-center'>
						<Col md='9' lg='7' xl='6'>
							<Card className='mx-4'>
								<CardBody className='p-4'>
									<Formik
										initialValues={{
											firstName: '',
											lastName: '',
											email: '',
											password: '',
											passwordConfirmation: ''
										}}
										validationSchema={Yup.object({
											firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
											lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
											email: Yup.string().email('Invalid email address').required('Required'),
											password: Yup.string()
												.matches(
													/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
													'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One special case Character'
												)
												.required('Password is required'),
											passwordConfirmation: Yup.string()
												.required('Required')
												.oneOf([Yup.ref('password'), null], 'Passwords must match')
										})}
										onSubmit={(values, { setSubmitting, resetForm }) => {
											if (this.state.captchaValidated) {
												setSubmitting(true);
												axios
													.post('/register', {
														firstName: values.firstName,
														lastName: values.lastName,
														email: values.email,
														password: values.password
													})
													.then(() => {
														resetForm();
														setSubmitting(false);
														MySwal.fire({ title: 'Check your email to confirm your account !', icon: 'success' });
													})
													.catch((err) => {
														if (err.response.statusText === 'UniqueViolation') {
															MySwal.fire({ title: 'Email already exists !', icon: 'error' });
														} else if (err.response.statusText === 'DataNotValidated') {
															MySwal.fire({ title: 'Please check your input fields !', icon: 'error' });
														} else {
															MySwal.fire({ title: 'Internal Server Error !', icon: 'error' });
														}
														setSubmitting(false);
													});
												window.grecaptcha.reset();
												this.setState({ captchaValidated: false });
											} else {
												setSubmitting(false);
											}
										}}
									>
										{(props) => {
											return (
												<Form>
													<h1>Register</h1>
													<p className='text-muted'>Create your account</p>
													<InputGroup className='mb-3'>
														<InputGroupAddon addonType='prepend'>
															<InputGroupText>
																<i className='icon-user'></i>
															</InputGroupText>
														</InputGroupAddon>
														<Field
															type='text'
															name='firstName'
															id='firstName'
															placeholder='First Name'
															autoComplete='firstName'
															component={ReactstrapFormikInput}
														/>
													</InputGroup>
													<InputGroup className='mb-3'>
														<InputGroupAddon addonType='prepend'>
															<InputGroupText>
																<i className='icon-user'></i>
															</InputGroupText>
														</InputGroupAddon>
														<Field
															type='text'
															name='lastName'
															id='lastName'
															placeholder='Last Name'
															autoComplete='lastName'
															component={ReactstrapFormikInput}
														/>
													</InputGroup>
													<InputGroup className='mb-3'>
														<InputGroupAddon addonType='prepend'>
															<InputGroupText>@</InputGroupText>
														</InputGroupAddon>
														<Field
															type='text'
															name='email'
															id='email'
															placeholder='Email'
															autoComplete='email'
															component={ReactstrapFormikInput}
														/>
													</InputGroup>
													<InputGroup className='mb-3'>
														<InputGroupAddon addonType='prepend'>
															<InputGroupText>
																<i className='icon-lock'></i>
															</InputGroupText>
														</InputGroupAddon>
														<Field
															type='password'
															name='password'
															id='password'
															placeholder='Password'
															autoComplete='new-password'
															component={ReactstrapFormikInput}
														/>
													</InputGroup>
													<InputGroup className='mb-4'>
														<InputGroupAddon addonType='prepend'>
															<InputGroupText>
																<i className='icon-lock'></i>
															</InputGroupText>
														</InputGroupAddon>
														<Field
															type='password'
															name='passwordConfirmation'
															id='passwordConfirmation'
															placeholder='Repeat password'
															autoComplete='retape-password'
															component={ReactstrapFormikInput}
														/>
													</InputGroup>
													<InputGroup className='mb-4'>
														<ReCAPTCHA
															type='image'
															sitekey={process.env.REACT_APP_RECAPTCHA}
															onChange={this.onChangeCaptcha}
															className='mx-auto'
														/>
													</InputGroup>
													<Button className='mb-4' disabled={props.isSubmitting} type='submit' color='success' block>
														Create Account
													</Button>
												</Form>
											);
										}}
									</Formik>
								</CardBody>
								{/* <CardFooter className='p-4'>
									<Row>
										<Col xs='12' sm='6'>
											<Button className='btn-facebook mb-1' block>
												<span>facebook</span>
											</Button>
										</Col>
										<Col xs='12' sm='6'>
											<Button className='btn-twitter mb-1' block>
												<span>twitter</span>
											</Button>
										</Col>
									</Row>
								</CardFooter> */}
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

const ReactstrapFormikInput = ({ field: { ...fields }, form: { touched, errors, ...rest }, ...props }) => (
	<React.Fragment>
		<Label for={props.id} className={'label-color'}>
			{props.label}
		</Label>
		<Input {...props} {...fields} invalid={Boolean(touched[fields.name] && errors[fields.name])} />
		{touched[fields.name] && errors[fields.name] ? (
			<FormFeedback className='mx-5'>{errors[fields.name]}</FormFeedback>
		) : (
			''
		)}
	</React.Fragment>
);

export default Register;
