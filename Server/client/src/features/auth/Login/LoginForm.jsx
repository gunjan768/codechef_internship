import React, { useState } from 'react';
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/form/TextInput';
import { login } from '../authActions';
import { combineValidators, isRequired } from 'revalidate';

const actions = 
{
	login,
};

const mapStateToProps = state =>
{
	return (
	{
		loading: state.async.loading
	});
}

const validate = combineValidators(
{
	username : isRequired('username'),
	password: isRequired('password')
});

// handleSubmit() is a function of ReduxForm and it will automatically pass the value property of every inputs. You can access them 
// by their respective name property.
const LoginForm = ({login, handleSubmit, loading, invalid, submitting }) => 
{
	const [error, setError] = useState(null);
	
	const loginUserHandler = async creds =>
	{
		try
		{
			await login(creds);
		}
		catch(err)
		{
			setError(err.errors._error);
		}
	}
	
	return (
		<Form size="large" onSubmit = { handleSubmit(loginUserHandler) }>
			<Segment>
				
				<Field
					name="username"
					component = { TextInput }
					type="text"
					placeholder="Username"
				/>
				
				<Field
					name="password"
					component = { TextInput }
					type="password"
					placeholder="password"
				/>

				<Button 
					loading = { loading } 
					fluid size="large" 
					disabled = { invalid || submitting } 
					color="teal">Login
				</Button>

				{ error && <Label basic color='red' style = {{ marginTop: 5 }}>{ error }</Label> }

				<Divider horizontal>Or</Divider>

			</Segment>
		</Form>
	);
}

export default connect(mapStateToProps, actions)(reduxForm({form: 'loginForm', validate})(LoginForm));