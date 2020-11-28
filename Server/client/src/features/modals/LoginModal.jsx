import React, {Component} from 'react';
import {Modal} from 'semantic-ui-react';
import {connect} from 'react-redux';
import LoginForm from '../auth/Login/LoginForm';
import {closeModal} from "./modalActions";
import AppName from '../../app/layout/AppName';

const actions = 
{
    closeModal
};

class LoginModal extends Component 
{
    render() 
    {
        return (
            <Modal
                size='mini'
                open = { true }
                onClose = { this.props.closeModal }
            >
                <Modal.Header>Login to <AppName /></Modal.Header>

                <Modal.Content>
                    <Modal.Description>
                        <LoginForm />
                    </Modal.Description>
                </Modal.Content>
                
            </Modal>
        );
    }
}

export default connect(null, actions)(LoginModal);