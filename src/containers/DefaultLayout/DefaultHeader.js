import React, { Component } from 'react';
import {
	Badge,
	UncontrolledDropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Nav,
	NavItem,
	NavLink
} from 'reactstrap';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg';
import sygnet from '../../assets/img/brand/sygnet.svg';

const propTypes = {
	children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
	onLogout = () => {
		this.props.logout();
		this.props.history.replace('/login');
	};

	render() {
		// eslint-disable-next-line
		const { children, ...attributes } = this.props;
		return (
			<React.Fragment>
				<AppSidebarToggler className='d-lg-none' display='md' mobile />
				<AppNavbarBrand
					full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
					minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
				/>
				<AppSidebarToggler className='d-md-down-none' display='lg' />

				<Nav className='ml-auto mr-4' navbar>
					<Badge color='secondary'>
						<h6>{this.props.email}</h6>
					</Badge>
					<UncontrolledDropdown nav direction='down'>
						<DropdownToggle nav>
							<img
								src={
									this.props.role === 'ROLE_ADMIN'
										? require('../../assets/img/admin.png')
										: require('../../assets/img/support.png')
								}
								className='img-avatar'
								alt='admin'
							/>
						</DropdownToggle>
						<DropdownMenu right>
							<DropdownItem header tag='div' className='text-center'>
								<strong>Account</strong>
							</DropdownItem>
							{/* <DropdownItem>
								<i className='fa fa-bell-o'></i> Updates
								<Badge color='info'>42</Badge>
							</DropdownItem>
							<DropdownItem>
								<i className='fa fa-envelope-o'></i> Messages
								<Badge color='success'>42</Badge>
							</DropdownItem>
							<DropdownItem>
								<i className='fa fa-tasks'></i> Tasks
								<Badge color='danger'>42</Badge>
							</DropdownItem>
							<DropdownItem>
								<i className='fa fa-comments'></i> Comments
								<Badge color='warning'>42</Badge>
							</DropdownItem>
							<DropdownItem header tag='div' className='text-center'>
								<strong>Settings</strong>
							</DropdownItem>
							<DropdownItem>
								<i className='fa fa-user'></i> Profile
							</DropdownItem>
							<DropdownItem>
								<i className='fa fa-wrench'></i> Settings
							</DropdownItem>
							<DropdownItem>
								<i className='fa fa-usd'></i> Payments
								<Badge color='secondary'>42</Badge>
							</DropdownItem>
							<DropdownItem>
								<i className='fa fa-file'></i> Projects
								<Badge color='primary'>42</Badge>
							</DropdownItem>
							<DropdownItem divider /> */}
							<DropdownItem>
								<i className='fa fa-user'></i> Profile
							</DropdownItem>
							<DropdownItem onClick={this.onLogout}>
								<i className='fa fa-lock'></i> Logout
							</DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
				</Nav>
			</React.Fragment>
		);
	}
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => {
			dispatch(actionCreators.logout());
		}
	};
};

export default connect(null, mapDispatchToProps)(DefaultHeader);
// export default DefaultHeader;
