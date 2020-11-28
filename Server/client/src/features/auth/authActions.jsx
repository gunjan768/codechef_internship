import { SubmissionError } from 'redux-form';
import { toastr } from 'react-redux-toastr'
import { closeModal } from '../modals/modalActions';
import { SIGN_OUT_USER, LOGIN_USER, AUTH_SUCCESS, AUTH_FAIL } from './authConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import axios from '../api/axios';

export const checkAuthTimeout = expirationTime => 
{
    return dispatch => 
    {
        setTimeout(() => 
        {
            const toastrType = 'info';

            const toastrOptions = 
            {
                icon: toastrType,
                status: toastrType
            }
        
            toastr.light('Logged out', 'Your seesion has been expired. Please continue to login', toastrOptions);

            dispatch(signOutUser());
            
        }, expirationTime * 1000);
    }
}

export const signOutUser = () =>
{
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('current_user');

    return {
        type: SIGN_OUT_USER
    };
}

export const authSuccess = token => 
{
    return {
        type: AUTH_SUCCESS,
        token
    }
}

export const authFail = error => 
{
    // console.log(error);

    return {
        type: AUTH_FAIL,
        error
    }
}

export const registerUser = user => 
{
    return async dispatch => 
    {   
        try 
        {
            dispatch(asyncActionStart());

            const { error } = await axios.post("/register", user);
            
            if(error)
            {
                dispatch(asyncActionFinish());

                return toastr.error(error === "Email exists" ? error : "Something went wrong. Please try again..!!");
            }

            dispatch(asyncActionFinish());
            dispatch(closeModal());

            return toastr.success('Success!',`You have been successfully registered. Now login to continue`);
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

export const login = creds => 
{
    return async dispatch => 
    {
        try 
        {
            dispatch(asyncActionStart());

            const {data : { token }} = await axios.post("/login", creds);
            
            let expirationDate = new Date().getTime() + 3600 * 1000;
            expirationDate = new Date(expirationDate);
            
            dispatch(authCheckState(token, expirationDate));

            localStorage.setItem('token',token);
            localStorage.setItem('expirationDate',expirationDate);
            
            dispatch(closeModal());
            dispatch(asyncActionFinish());

            return toastr.success('Success!', `It's nice to see you ${creds.username}`);
        }
        catch(error) 
        {
            dispatch(authFail(error.message));
            dispatch(asyncActionError());

            toastr.error("Authentication failed. Either you are a new user or entered wrong mixture of details");

            // You can mentioned error property by the name '_error'. It will throw an error which you can catch in LoginForm.
            throw new SubmissionError(
            {
                _error: "Failed to login, please check your details"
            });
        }
    };
}

export const authCheckState = (tokenString = null, expiryDate = null) => 
{
    return async dispatch => 
    {
        let token = null;
        
        if(tokenString === null)
        {
            token = localStorage.getItem('token');
            
            let expirationDate = localStorage.getItem('expirationDate');
            let data = localStorage.getItem('current_user');

            if(!expirationDate || (Object.keys(data).length === 0 && data.constructor === Object) || !data)
            {
                dispatch(signOutUser());

                return;
            }

            expirationDate = new Date(expirationDate);

            if(data !== null)
            data = JSON.parse(data);

            if(expirationDate <= new Date()) 
            {   
                dispatch(signOutUser());
            } 
            else 
            { 
                dispatch(authSuccess(token));
                dispatch({type: LOGIN_USER, payload: data});
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
            }   

            return;
        }
        
        token = tokenString;

        if(!token) 
        {
            dispatch(signOutUser());
        } 
        else 
        {
            const { message, data: { data } } = await axios.get("/check_user",
            {
                headers: 
                {
                    authorization: `Bearer ${token}`
                }
            });

            let expirationTime = null;

            if(expiryDate !== null)
            expirationTime = expiryDate;
            else
            expirationTime = localStorage.getItem('expirationDate');

            const expirationDate = new Date(expirationTime);
            
            if(!expirationDate || expirationDate <= new Date() || message === "Auth failed") 
            {   
                dispatch(signOutUser());
            } 
            else 
            { 
                dispatch(authSuccess(token));
                dispatch({type: LOGIN_USER, payload: data});
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
                
                localStorage.setItem('current_user', JSON.stringify(data));
            }   
        }
    }
}