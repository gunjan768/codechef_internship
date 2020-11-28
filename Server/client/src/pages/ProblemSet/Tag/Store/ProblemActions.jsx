import axios from '../../../../features/api/axios';
import { FETCH_PROBLEM } from './ProblemConstants';

const LIMIT = 20;

export const fetchProblem = (currentTagArray, currentUser, currentPageNumber) => 
{
    return async dispatch => 
    {   
        try 
        {
            const { data: { data } } = await axios.post('/problem',{currentTagArray, currentPageNumber, currentUser});
            
            dispatch({type: FETCH_PROBLEM, payload: { data, currentPageNumber } });

            if(data.length < LIMIT)
            return false;

            return true;
        } 
        catch(error)
        {
            console.log({error});

            return false;
        }
    }
}