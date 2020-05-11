import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	children: PropTypes.node
};

const defaultProps = {};

class DefaultFooter extends Component {
	render() {
		// eslint-disable-next-line
		const { children, ...attributes } = this.props;

		return (
			<React.Fragment>
				<span>
					<strong>AUTO COD</strong> &copy; 2020.
				</span>
				<span className='ml-auto'>
					Powered by <a href='https://www.linkedin.com/in/yassine-bouhouta-aa6511154/'>Pro Dev 2020</a>
				</span>
			</React.Fragment>
		);
	}
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
