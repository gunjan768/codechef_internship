import React from 'react'
import { Modal } from 'semantic-ui-react'
import { closeModal } from "./modalActions";
import AddNewTagForm from '../../pages/ProblemSet/Tag/util/Problems/Helper/AddNewTag/AddNewTagForm';
import { useDispatch } from 'react-redux';

const AddNewTag = props => 
{
    const disptach = useDispatch();

    const closeTheModal = () =>
    {
        disptach(closeModal());
    }

    return (
        <Modal
            // basic
            onClose = { closeTheModal }
            open = { true }
            size='mini'
        >
            <Modal.Header >Add New Tag</Modal.Header>

            <Modal.Content>
                <Modal.Description>
                    <AddNewTagForm { ...props }/>
                </Modal.Description>
            </Modal.Content>

        </Modal>
    );
}

export default AddNewTag;