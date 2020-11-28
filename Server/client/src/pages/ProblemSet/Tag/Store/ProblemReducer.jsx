import { FETCH_PROBLEM } from './ProblemConstants';

const initialState = 
{
    currentProblemArray: []
}

export const fetchProblem = (state, {payload: { data, currentPageNumber }}) => 
{
    if(currentPageNumber > 1)
    {
        return {
            currentProblemArray: [...state.currentProblemArray, ...data],
        };
    }

    return {
        currentProblemArray: [...data]
    }
}

const reducer = (state = initialState, action) => 
{
    switch(action.type) 
    {
        case FETCH_PROBLEM: 
            return fetchProblem(state, action);
      
        default:
            return state;
    }
}

export default reducer;