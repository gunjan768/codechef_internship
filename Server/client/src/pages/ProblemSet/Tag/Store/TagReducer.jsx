import { FETCH_TAG } from './TagConstants';

const initialState = 
{
    currentTagArray: [],
    currentUserDefinedTagArray: []
}

export const fetchTag = (state, {payload: { data, userData, currentPageNumber }}) => 
{
    if(currentPageNumber > 1)
    {
        return {
            currentTagArray: [...state.currentTagArray, ...data],
            currentUserDefinedTagArray: [...state.currentUserDefinedTagArray, ...userData]
        };
    }

    return {
        currentTagArray: [...data],
        currentUserDefinedTagArray: [...userData]
    }
}

const reducer = (state = initialState, action) => 
{
    switch(action.type) 
    {
        case FETCH_TAG: 
            return fetchTag(state, action);
      
        default:
            return state;
    }
}

export default reducer;