import { ADD_NEW_TAG } from './AddNewTagConstants';

const initialState = null;

export const noUse = state => 
{
    return {
       ...state
    };
}

const reducer = (state = initialState, action) => 
{
    switch(action.type) 
    {
        case ADD_NEW_TAG: 
            return noUse(state, action);
        
        default:
            return state;
    }
}

export default reducer;