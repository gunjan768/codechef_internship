import axios from '../../../../features/api/axios';
import { FETCH_TAG } from './TagConstants';

const LIMIT = 50;

export const fetchTag = (currentSwitchState, currentPageNumber, currentUser) => 
{
    return async dispatch => 
    {   
        try 
        {
            const value = await axios.post('/tag',{currentSwitchState, currentUser, currentPageNumber});
            
            if(!value || !value.data || !value.data.data)
            throw new Error("Something went wrong");

            const { data } = value;

            dispatch({type: FETCH_TAG, payload: {data: data.data, userData: data.userData, currentPageNumber}});

            // console.log(data.length, userData.length);

            if(data.data.length < LIMIT && data.userData.length < LIMIT)
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

export const searchTag = (value, currentUser) =>
{
    return async dispatch =>
    {
        try
        {   
            const { data: { data, userData } } = await axios.post('/search_tag',{value, currentUser});

            return userData.concat(data);
        }
        catch(error)
        {
           return [];
        }
    }
}