import { SubmissionError } from 'redux-form';
import { toastr } from 'react-redux-toastr'
import { closeModal } from '../../../../../../../features/modals/modalActions';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../../../../../../../features/async/asyncActions';
import axios from '../../../../../../../features/api/axios';


export const addNewTag = (problemCode, { tagname }, currentUser) => 
{
    return async dispatch => 
    {   
        try 
        {
            dispatch(asyncActionStart());

            const { data: { message } } = await axios.post("/add_new_tag", {problemCode, tagname, currentUser});
            
            if(message)
            {
                dispatch(asyncActionFinish());

                toastr.error(message === "Tag exists" ? message : "Something went wrong. Please try again..!!");

                throw new Error(message);
            }

            dispatch(asyncActionFinish());
            dispatch(closeModal());

            toastr.success('Success!',`You have successfully added a new tag ${tagname}`);

            return;
        } 
        catch(error)
        {
            dispatch(asyncActionError());
            
            throw new SubmissionError(
            {
                _error: error.message
            });
        }
    }
}