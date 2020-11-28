import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const LoadingComponent = ({inverted, white}) => 
{
	if(white)
	{
		return (
			<div style = {{ position: "absolute", to: "50%", left: "50%" }}>
				<Loader active inline='centered'/>;
			</div>
		);
	}

	return (
		<Dimmer inverted = { inverted } active = { true }>
			<Loader content='Loading...'/>
		</Dimmer>
	);
}

export default LoadingComponent;