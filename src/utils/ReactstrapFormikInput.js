import React from 'react';
import { Label, FormFeedback, Input } from 'reactstrap';


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

export default ReactstrapFormikInput;