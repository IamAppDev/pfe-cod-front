import React, { Component } from 'react';
import axios from '../../../utils/axios';

export class Dashboard extends Component {
    handleTestToken = () => {
		axios
			.post('/admin')
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log('done !');
			});
	};

	render() {
		return (
			<div>
				<h1>dashboard</h1>
				<button onClick={this.handleTestToken}>TEST HEEEERE :D</button>
			</div>
		);
	}
}

export default Dashboard;
