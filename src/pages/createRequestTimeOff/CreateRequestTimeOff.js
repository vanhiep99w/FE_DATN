import React, {useState, useEffect, useCallback} from 'react';
import PageDesign from '../../components/pageDesign/PageDesign';
import SelectCalendar from '../../components/selectCalendar/SelectCalendar';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import TimeBalance from './timeBalance/TimeBalance';
import {connect} from 'react-redux';
import { getWeek, selectDay } from "../../redux/actions";
import { equalDates } from "../../utils/Utils";
import {onSetStartTimeOff, onSetEndTimeOff} from '../../redux/actions/index';
import timeCloudAPI from '../../apis/timeCloudAPI';
import history from '../../history/index';
import {require} from '../../utils/validationUtils';

import './CreateRequestTimeOff.css';

const CreateRequestTimeOff = (({days, getWeek, selectDay, selectedIndex, startTimeOff, endTimeOff}) => {

    const titleDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const [description, setDescription] = useState("");
    const [periodOfStartDay, setPeriodOfStartDay] = useState(0);
    const [periodOfEndDay, setPeriodOfEndDay] = useState(0);
    const [startValidation, setStartValidation] = useState(true);
    const [descriptionValidation, setDescriptionValidation] = useState(true);
    const [endValidation, setEndValidation] = useState(true);

    useEffect(() => {
        if(!startTimeOff[0]) setStartValidation(false);
        else setStartValidation(true);
        if(!endTimeOff[0]) setEndValidation(false);
        else setEndValidation(true);
        if(!description) setDescriptionValidation(false);
        else setDescriptionValidation(true);
    },[startTimeOff, endTimeOff, description]);

    const onDaySelected = (selectedDays) => {
        if (selectedDays) {
          const index = days.findIndex((ele) => equalDates(ele, selectedDays[0]));
          if (index === -1) {
            getWeek(selectedDays[0]);
          } else {
            selectDay(index);
          }
        }
      };

    const viewOptionsEndTime = () => {
        let start = new Date(startTimeOff[0]);
        let end = new Date(endTimeOff[0]);
        if(start.getTime() === end.getTime() || !endTimeOff) return false;
        return true;
      }

    const convertDate = (date) => {
        if(date) {
            return `${titleDays[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        }
        return date;
    }

    const onSubmit = () => {
        const requestTimeOff = {
            userId: localStorage.getItem("userId"),
            milisecondsStartTime: startTimeOff[0].getTime(),
            milisecondsEndTime: endTimeOff[0].getTime(),
            description: description
        }
        console.log(requestTimeOff);
        timeCloudAPI().post("time-off",requestTimeOff)
        .then((response) => {
            history.push("/time-off");
            console.log(response.data);
        })
        
    }

    const onCancel = () => {

    }

    return (
        <div className="create_request_time_off">
            <PageDesign
                title="Request Time Off"
            >
                <div className="create_request_time_off__content">
                    <div className="content__form">
                        <div className="content__form__period">
                            <div className="content__form__period__left">
                                <div className="content__form__period__start">
                                    <label > Start on: </label>
                                    <div className="input__content">
                                        <input placeholder="Pick a date..." value={convertDate(startTimeOff[0])}/>
                                        <SelectCalendar
                                            multipleSelect={false}
                                            onSelectDay={onDaySelected}
                                            conditionDisable = {() => (false)}
                                            value={[new Date()]}
                                            timeOffMode={"1"}
                                        />
                                    </div>
                                </div>
                                <div className="content__form__period__option">
                                    <input
                                        type="radio"
                                        name="radio-start"
                                        id="all-start"
                                        value={0}
                                        onChange={(e) => {setPeriodOfStartDay(e.target.value)}}
                                    /> All day <br/>
                                    <input
                                        type="radio"
                                        name="radio-start"
                                        id="half-start"
                                        value={1}
                                        onChange={(e) => {setPeriodOfStartDay(e.target.value)}}
                                    /> Half day
                                </div>
                            </div>
                            <ArrowRightAltIcon />
                            <div className="content__form__period__left">
                                <div className="content__form__period__end">
                                    <label> End on: </label>
                                    <div className="input__content">
                                        <input placeholder="Pick a date..." value={convertDate(endTimeOff[0])}/>
                                        <SelectCalendar
                                            multipleSelect={false}
                                            onSelectDay={onDaySelected}
                                            conditionDisable = {() => (false)}
                                            value={[new Date()]}
                                            timeOffMode={"2"}
                                        />
                                    </div>
                                </div>
                                {viewOptionsEndTime() ?
                                    <div className="content__form__period__option">
                                        <input
                                            type="radio"
                                            name="radio-end"
                                            id="all-end"
                                            value={0}
                                            onChange={(e) => {setPeriodOfEndDay(e.target.value)}}
                                        /> All day <br/>
                                        <input
                                            type="radio"
                                            name="radio-end"
                                            id="half-end"
                                            value={1}
                                            onChange={(e) => {setPeriodOfEndDay(e.target.value)}}
                                        /> Half day
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                        <div className="content__form__decription">
                            <label>Description</label><br/>
                            <textarea
                                rows="9"
                                cols="110"
                                placeholder="Type something ..."
                                value={description}
                                name="description"
                                onChange={(even) => {setDescription(even.target.value)}}
                            />
                        </div>
                        <button onClick={onSubmit}>Send request</button>
                        <button onClick={onCancel}>Cancel</button>
                    </div>
                    <TimeBalance />
                </div>
            </PageDesign>
        </div>
    )
})

const mapStateToProps = (state) => {
    const { days } = state.week;
    const {startTimeOff, endTimeOff} = state.timeOff;
    return {
      days,
      selectedIndex: state.week.selectedIndex,
      startTimeOff,
      endTimeOff,
    };
  };

export default connect(mapStateToProps, {
    getWeek,
    selectDay,
    onSetEndTimeOff,
    onSetStartTimeOff,
  })(CreateRequestTimeOff);