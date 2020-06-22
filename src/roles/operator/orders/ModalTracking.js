/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

const ModalTracking = (props) => {
	const { buttonLabel, className } = props;

	// const [modal, setModal] = useState(props.openModal);

	const toggle = () => props.setOpenModal(!props.openModal);

	// React.useEffect(() => {
	// 	console.log('inside modal', modal);
	// }, [modal]);

	React.useEffect(() => {
		console.log(props);
	});

	return (
		<div onClick={toggle}>
			{/* <Button color='danger' onClick={toggle}>
				{buttonLabel}
			</Button> */}
			<Modal
				isOpen={props.openModal}
				toggle={toggle}
				// className={className}
				style={{
					position: 'relative',
					top: '50%',
					transform: 'translateY(-50%)'
				}}
			>
				<ModalHeader toggle={toggle}>Tracking N° : {props.tracking}</ModalHeader>
				<ModalBody>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
					consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
					pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
					est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
					labore et dolore magna aliqua.
				</ModalBody>
				<ModalFooter>
					<Button color='secondary' onClick={toggle}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default ModalTracking;
