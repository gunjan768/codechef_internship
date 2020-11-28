import React from 'react';
import { Menu, Image, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

const SignedInMenu = ({ signOut, currentUser: { username, userId } }) => 
{
	return (
		<Menu.Item position="right" >
			<Image 
				as = { Link }
				to = {`/profile/${userId}`} 
				avatar spaced="right" src = { "/assets/user.png" } 
			/>
			<Dropdown pointing="top left" text = { username }>
				<Dropdown.Menu>
					<Dropdown.Item as = { Link } to = {`/profile/${userId}`} text="My Profile" icon="user" />
					<Dropdown.Item as = { Link } to = {`/people`} text="My Network" icon="users" />
					<Dropdown.Item as = { Link } to = '/settings' text="Settings" icon="settings" />
					<Dropdown.Item onClick = { signOut } text="Sign Out" icon="power" />
				</Dropdown.Menu>
			</Dropdown>
		</Menu.Item>
	);
}

export default SignedInMenu;