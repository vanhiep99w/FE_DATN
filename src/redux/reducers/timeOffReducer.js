import {SET_START_TIME_OFF, SET_END_TIME_OFF} from '../actions/actionType';

const initialState = {
    startTimeOff: "",
    endTimeOff: ""
}

export default (state = initialState, {type, payload}) => {
    switch(type) {
        case SET_START_TIME_OFF:
            return {
                ...state,
                startTimeOff: payload
            };
        case SET_END_TIME_OFF:
            return {
                ...state,
                endTimeOff: payload
            }
        default :
            return state;
    }
}