import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Input, Menu } from 'semantic-ui-react'
import classes from './NavBar.module.css';

import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';
import { openModal } from '../../modals/modalActions';
import { signOutUser } from '../../auth/authActions';
import AppName from '../../../app/layout/AppName';

const actions = 
{
	openModal,
	signOutUser
};

const mapStateToProps = state => 
{
	// console.log({state});
	
	return (
    {
		authenticated: state.auth.authenticated,
		currentUser: state.auth.currentUser
    });
}
  
class NavBar extends PureComponent 
{
	constructor(props)
	{
		super(props);

		this.state = 
		{ 
			activeItem: 'home' 
		};
	}
	
	componentDidMount()
	{
		if(this.props.location.pathname !== "/home")
		{
			this.setState({ activeItem: "" });
		}
	}

	handleItemClick = (event, { name }) =>
	{
		this.setState({ activeItem: name });
	}

	removeActiveItem = () =>
	{
		this.setState({ activeItem: "" });
	}

	handleSignIn = () => 
	{
		this.props.openModal('LoginModal');
		
		// let openModal = this.props.openModal('LoginModal');
		// console.log("OpenModal : ",this.props.openModal);
	}

	handleRegister = () => 
	{
		this.props.openModal('RegisterModal');
	}

	handleSignOut = () => 
	{
		this.props.signOutUser();

		this.props.history.push('/');
	}

	render() 
	{
		const { activeItem } = this.state
		const { authenticated, currentUser } = this.props;

		return (
			<React.Fragment>
				<Menu inverted fixed="top" className = { classes.TopMenu }>
					{/* <Container> */}
						<Menu.Item as = { Link } to="/" header>
							<img src="/assets/logo.png" alt="logo" className = { classes.Logo }/>
							&nbsp; <AppName />
						</Menu.Item>
					
						<Menu.Item
							name='home'
							as = { NavLink } 
							to="/home"
							active = { activeItem === 'home' }
							onClick = { this.handleItemClick }
						/>

						<Dropdown 
							text='Problem Set'
							pointing className='link item'
							scrolling = { false }
							onOpen = { this.removeActiveItem }
						>
							<Dropdown.Menu>
								<Dropdown.Header>Categories</Dropdown.Header>
								<Dropdown.Item as = { Link } to = {`/problems/tag`}>Search Problem by Tag</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item 
									as = { Link } 
									to = {`/problems/difficulty`}>Practice problem by difficulty level
								</Dropdown.Item>

							</Dropdown.Menu>
						</Dropdown>
						
						<Menu.Menu position='right'>
							
							{
								authenticated ? 
									<SignedInMenu 
										currentUser = { currentUser } 
										signOut = { this.handleSignOut } 
									/>
								: 
									<SignedOutMenu 
										signIn = { this.handleSignIn } 
										register = { this.handleRegister } 
										classLogin = { classes.LoginButton }
										classRegister = { classes.RegisterButton }
									/>
							}

							<Menu.Item>
								<Input icon='search' placeholder='Search user...' />
							</Menu.Item>
						</Menu.Menu>
					{/* </Container> */}
				</Menu>
			</React.Fragment>
		);
	}
}

export default withRouter(connect(mapStateToProps, actions)(NavBar));