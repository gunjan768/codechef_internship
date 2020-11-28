import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { reducer as FormReducer } from 'redux-form';
import modalsReducer from '../../features/modals/modalReducer';
import authReducer from '../../features/auth/authReducer';
import asyncReducer from '../../features/async/asyncReducer';
import difficultyReducer from '../../pages/ProblemSet/Difficulty/DifficultyReducer';
import tagReducer from '../../pages/ProblemSet/Tag/Store/TagReducer';
import ProblemReducer from '../../pages/ProblemSet/Tag/Store/ProblemReducer';

const rootReducer = combineReducers(
{
    toastr: toastrReducer,
    modals: modalsReducer,
    auth: authReducer,
    async: asyncReducer,
    form: FormReducer,
    difficulty: difficultyReducer,
    tag: tagReducer,
    problem: ProblemReducer
});

export default rootReducer;