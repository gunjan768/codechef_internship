import { SIGN_OUT_USER, LOGIN_USER, AUTH_SUCCESS, AUTH_FAIL } from './authConstants';

const initialState = 
{
    token: null,
    error: null,
    authenticated: false,
    currentUser: {}
}

export const loginUser = (state, { payload: { username, userId } }) => 
{
    return {
        ...state,
        authenticated: true,
        currentUser:
        {
            username,
            userId
        }
    };
}

export const signOutUser = state => 
{
    return {
        authenticated: false,
        token: null,
        currentUser: {}
    };
}

export const authSuccess = (state, {token}) => 
{
    return { 
        ...state,
        token,
        error: null,
    };
}

export const authFail = (state, action) => 
{
    return {
        error: action.error,
        authenticated: false,
        token: null,
        currentUser: null,
    };
}

const reducer = (state = initialState, action) => 
{
    switch(action.type) 
    {
        case LOGIN_USER: 
            return loginUser(state, action);
        
        case SIGN_OUT_USER: 
            return signOutUser(state, action);
        
        case AUTH_SUCCESS: 
            return authSuccess(state, action);
        
        case AUTH_FAIL: 
            return authFail(state, action);
      
        default:
            return state;
    }
}

export default reducer;