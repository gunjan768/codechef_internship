import { MODAL_CLOSE, MODAL_OPEN } from './modalConstants';
import { createReducer } from '../../app/util/reducerUtil';

const initialState = null;

export const openModal = (state, payload) => 
{
    const { modalType, modalProps } = payload;

    // console.log("modalReducer : ",modalProps);
    // console.log("modalReducer : ",modalType);

    return { modalType, modalProps };
}

export const closeModal = (state, payload) => 
{
    return null;
}

export default createReducer(initialState, 
{
    [MODAL_OPEN]: openModal,
    [MODAL_CLOSE]: closeModal
})