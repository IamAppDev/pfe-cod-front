import React from 'react';
import { Spinner } from 'reactstrap';

const Loading = () => {
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
};

export default Loading;
