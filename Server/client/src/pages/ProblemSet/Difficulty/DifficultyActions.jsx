import axios from '../../../features/api/axios';
import { FETCH_QUESTION } from './DifficultyConstants';

export const fetchQuestion = (difficultyLevel, pageNumber) => 
{
    return async dispatch => 
    {   
        try 
        {
            const { data: { data, totalCount } } = await axios.post('/difficulty',{difficultyLevel, pageNumber});

            dispatch({type: FETCH_QUESTION, payload: data});
            
            if(Object.keys(totalCount).length === 0)
            return 0;
            
            return totalCount[0].myCount;
        } 
        catch(error)
        {
           throw error;
        }
    }
}