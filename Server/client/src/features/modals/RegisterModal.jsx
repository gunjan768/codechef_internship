import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { closeModal } from "./modalActions";
import RegisterForm from "../auth/Register/RegisterForm";
import AppName from '../../app/layout/AppName';

const actions = 
{ 
    closeModal 
};

class RegisterModal extends Component 
{
    render() 
    {
        return (
            <Modal
                size='mini'
                open = { true }
                onClose = { this.props.closeModal }
            >
                <Modal.Header>Sign Up to  <AppName /></Modal.Header>

                <Modal.Content>
                    <Modal.Description>
                        <RegisterForm />
                    </Modal.Description>
                </Modal.Content>

            </Modal>
        );
    }
}

export default connect(null, actions)(RegisterModal);