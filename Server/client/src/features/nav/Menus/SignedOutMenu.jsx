import React from 'react';
import { Menu, Button } from 'semantic-ui-react';

const SignedOutMenu = ({signIn, register, classLogin, classRegister}) => 
{
	return (
		<Menu.Item position="right">
			<Button 
				onClick = { signIn } 
				inverted = { true }
				color='green'
				content="Login"
				className = { classLogin }
			/>
			<Button 
				onClick = { register } 
				inverted = { true }
				color="orange"
				content="Register" 
				style = {{ marginLeft: '0.5em' }} 
				className = { classRegister }
			/>
		</Menu.Item>
	);
}

export default SignedOutMenu;