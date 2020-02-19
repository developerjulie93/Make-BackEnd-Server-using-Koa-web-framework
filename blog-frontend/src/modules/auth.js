import {createAction, handleActions} from 'redux-actions';
import produce from 'immer';
import {takeLatest} from 'redux-saga/effects';
import createRequestSaga, {createRequestActionTypes} from '../lib/createRequestSaga';
import *as authAPI from '../lib/api/auth';

//action types
const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes(
    'auth/REGISTER',
);
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes(
    'auth/LOGIN',
);

//create action function
export const changeField = createAction(
    CHANGE_FIELD,
    ({form, key, value}) => ({
        form, //register, login
        key, //username, password, passwordConfirm
        value,
    }),
);
export const initializeForm = createAction(
    INITIALIZE_FORM,
    form => form,
);
export const register = createAction(
    REGISTER,
    ({username, password}) => ({username, password,})
);
export const login = createAction(
    LOGIN,
    ({username, password}) => ({username, password})
);

//create saga
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);

//generator function
export function* authSaga(){
    yield takeLatest(REGISTER, registerSaga);
    yield takeLatest(LOGIN, loginSaga);
}
//set initial value
const initialState = {
    register:{
        username: '',
        password: '',
        passwordConfirm: '',
    },
    login:{
        username: '',
        password: '',
    },
    auth: null,
    authError: null,
};

//create reducer
const auth = handleActions(
    {
       [CHANGE_FIELD]: (state, {payload: {form, key, value}}) =>
            produce(state, draft => {
                draft[form][key] = value;
            }),
       [INITIALIZE_FORM]: (state, {payload: form}) =>({
            ...state,
            [form]: initialState[form],
            authError: null,
            }), 
        [REGISTER_SUCCESS]: (state, {payload: auth}) =>({
            ...state,
            authError: null,
            auth,
            }),
        [REGISTER_FAILURE]: (state, {payload: error}) =>({
            ...state,
            authError: error,
            }),
        [LOGIN_SUCCESS]: (state, {payload: auth}) =>({
            ...state,
            authError: null,
            auth,
            }),
        [LOGIN_FAILURE]: (state, {payload: error}) =>({
            ...state,
            authError: error,
            }),   
    },
    initialState,
);

export default auth;

