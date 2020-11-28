import React, { useState } from 'react';
import { Form, Segment, Button, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../../../../../app/form/TextInput';
import { combineValidators, isRequired } from 'revalidate';
import { addNewTag } from './AddNewTagActions';

const actions = 
{
	addNewTag
};

const mapStateToProps = state =>
{
	return (
	{
		loading: state.async.loading,
		currentUser: state.auth.currentUser
	});
}

const validate = combineValidators(
{
	tagname : isRequired('tagname'),
});

// handleSubmit() is a function of ReduxForm and it will automatically pass the value property of every inputs. You can access them 
// by their respective name property.
const AddNewTagForm = ({addNewTag, handleSubmit, loading, invalid, submitting, problemCode, currentUser}) => 
{
	const [error, setError] = useState(null);
   
	const AddNewTagHandler = async creds =>
	{
		try
		{
			await addNewTag(problemCode, creds, currentUser);
		}
		catch(err)
		{
			setError(err.errors._error);
		}
	}
	
	return (
		<Form size="large" onSubmit = { handleSubmit(AddNewTagHandler) }>
			<Segment>
				
				<Field
					name="tagname"
					component = { TextInput }
					type="text"
					placeholder="Tag name..."
				/>
				
				<Button 
					loading = { loading } 
					fluid size="large" 
					disabled = { invalid || submitting } 
					color="violet">Add to chosen problem
				</Button>

				{ error && <Label basic color='red' style = {{ marginTop: 5 }}>{ error }</Label> }

			</Segment>
		</Form>
	);
}

export default connect(mapStateToProps, actions)(reduxForm({form: 'add_new_tag_form', validate})(AddNewTagForm));