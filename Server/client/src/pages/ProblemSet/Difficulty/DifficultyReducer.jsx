import { FETCH_QUESTION } from './DifficultyConstants';

const initialState = 
{
    currentQuestionArray: []
}

export const fetchQuestion = (state, {payload}) => 
{
    return {
        currentQuestionArray: payload
    };
}

const reducer = (state = initialState, action) => 
{
    switch(action.type) 
    {
        case FETCH_QUESTION: 
            return fetchQuestion(state, action);
      
        default:
            return state;
    }
}

export default reducer;