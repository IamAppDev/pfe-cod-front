import React, { Component } from 'react';
import { Spinner } from 'reactstrap';
import axios from '../axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

export class Confirmation extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{ width: '100%', height: '100vh' }}>
				<div
					style={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '3rem',
						height: '3rem'
					}}
				>
					<Spinner type='grow' />
				</div>
			</div>
		);
	}

	componentDidMount() {
		const token = this.props.match.params.token;
		axios
			.post('/confirmation', { token })
			.then((res) => {
				if (res.status === 200) {
					MySwal.fire({ title: 'Account activated successfully !', icon: 'success' }).then(() => {
						this.props.history.replace('/login');
					});
				}
			})
			.catch((err) => {
				switch ((err.status = 404)) {
					case 404:
						MySwal.fire({ title: 'Error ! Please contact us to solve your problem.', icon: 'error' }).then(() => {
							this.props.history.replace('/login');
						});
						break;
					default:
						MySwal.fire({ title: 'Server Error ! Please try again later.', icon: 'error' }).then(() => {
							this.props.history.replace('/login');
						});
						break;
				}
			});
	}
}

export default Confirmation;
