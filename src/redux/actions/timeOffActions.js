import {SET_START_TIME_OFF, SET_END_TIME_OFF} from './actionType';

const setStartTimeOff = (payload) => {
    return {
        type: SET_START_TIME_OFF,
        payload
    }
}

const setEndTimeOff = (payload) => {
    return {
        type: SET_END_TIME_OFF,
        payload
    }
}

export const onSetStartTimeOff = (daySelected) => {
    return (dispatch) => {
        dispatch(setStartTimeOff(daySelected))
    }
}

export const onSetEndTimeOff = (daySelected) => {
    return (dispatch) => {
        dispatch(setEndTimeOff(daySelected));
    }
}