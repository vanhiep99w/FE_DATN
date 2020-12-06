import React, {useState, useEffect, useRef} from 'react';
import PageDesign from '../../components/pageDesign/PageDesign';
import SelectCalendar from '../../components/selectCalendar/SelectCalendar';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import TimeBalance from './timeBalance/TimeBalance';
import timeCloudAPI from '../../apis/timeCloudAPI';
import history from '../../history/index';
import {countDate} from '../../utils/Utils';
import {withRouter} from 'react-router-dom';
import Modal from '../../components/modal/Modal';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import {require, checkDayRequestIsDayOff, checkDayRequestFail} from '../../utils/validationUtils';

import './CreateRequestTimeOff.css';

const CreateRequestTimeOff = ((props) => {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [editStatus, setEditStatus] = useState(false);

    const titleDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const [description, setDescription] = useState("");
    const [periodOfStartDay, setPeriodOfStartDay] = useState(0);
    const [periodOfEndDay, setPeriodOfEndDay] = useState(0);
    const [startValidation, setStartValidation] = useState("");
    const [descriptionValidation, setDescriptionValidation] = useState("");
    const [endValidation, setEndValidation] = useState("");
    const [dayRequest, setDayRequest] = useState(0);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [limiteRequest, setLimitedRequest] = useState(false);

    useEffect(() => {
        if(startTime && endTime) setDayRequest(countDate(startTime, endTime))
        if(startTime !== null) setStartValidation(validate([require, checkDayRequestFail, checkDayRequestIsDayOff], startTime));
        if(endTime !== null) {
            if(endTime < startTime) 
                setEndValidation("End day can't before start day!");
            else setEndValidation(validate([require, checkDayRequestFail, checkDayRequestIsDayOff], endTime));
        }
        if(description !== "") setDescriptionValidation(validate([require], description));
        
    },[startTime, endTime, description, dayRequest]);

    useEffect(() => {
        if(startValidation === undefined && endValidation === undefined && descriptionValidation === undefined) setSubmitStatus(true);
        else setSubmitStatus(false);
    },[startValidation, endValidation, descriptionValidation])

    const onSetPeriodOfDay = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        if(name === "radio-start") setPeriodOfStartDay(value);
        else setPeriodOfEndDay(value);
    }

    const validate = (validations = [], value) => {  

        for(let i =0 ;i < validations.length; i++){
          const error =  validations[i](value);
          if(error){
            return error;
          } 
        }
        return undefined;
    }

    useEffect(() => {
        if(props.match.params.id) {
            setEditStatus(true);
            timeCloudAPI().get(`time-off/${props.match.params.id}`)
            .then(res => {
                setStartTime(new Date(res.data.startTime))
                setEndTime(new Date(res.data.endTime))
                setDescription(res.data.description)
            })
        }
    },[])

    useEffect(() => {
        if(periodOfStartDay === "1") setStartTime(new Date(startTime.setHours(12)));
        if(periodOfEndDay === "1") setEndTime(new Date(endTime.setHours(12)));
    },[periodOfStartDay, periodOfEndDay]);

    const onSetStartTime = (selectedDays) => {
        if (selectedDays) {
          setStartTime(selectedDays[0])
        }
      };

    const onSetEndTime = (selectedDays) => {
    if (selectedDays) {
        setEndTime(selectedDays[0])
    }
    };

    const viewOptionsEndTime = () => {

        if(startTime?.getTime() === endTime?.getTime() || !endTime || Math.ceil(startTime?.getTime() - endTime?.getTime() === 43200000)) return false;
        return true;
      }

    const convertDate = (date) => {
        if(date) {
            return `${titleDays[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        }
        return "";
    }

    const renderModalContent = () => {
        return (
          <div className="time_off__modal_content">
            <p>{`You just have ${12 - props.history.location.state} days left!`}</p>
          </div>
        );
      };
      
      const onConfirm = () => {
        setLimitedRequest(false)
      }
      
      const renderModalActions = () => {
        return (
          <div className="limited_time_off__model_actions">
            <button onClick={onConfirm}> OK </button>
          </div>
        );
      };

    const onSubmit = () => {
        console.log(1);
        if(dayRequest + props.history.location.state > 12) setLimitedRequest(true);
        else {
            const requestTimeOff = {
                userId: localStorage.getItem("userId"),
                milisecondsStartTime: startTime.getTime(),
                milisecondsEndTime: endTime.getTime(),
                description: description
            }
            if(editStatus) {
                timeCloudAPI().put(`time-off/${props.match.params.id}`, requestTimeOff)
                .then(res => {
                    history.push("/time-off")
                    setEditStatus(false)
                })
            }
            else {
                timeCloudAPI().post("time-off",requestTimeOff)
                .then((response) => {
                    history.push("/time-off");
                })
            }
        }
    }

    const onCancel = () => {
        history.push("/time-off")
    }

    const onChange = (even) => {
        setDescription(even.target.value);
        setDescriptionValidation(validate([require], even.target.value));
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
                                        <input readOnly placeholder="Pick a date..." value={convertDate(startTime)}/>
                                        <SelectCalendar
                                            multipleSelect={false}
                                            onSelectDay={onSetStartTime}
                                            conditionDisable = {() => (false)}
                                            value={[new Date()]}
                                        />
                                    </div>
                                </div>
                                {(startValidation) ?
                                    <div className="validate_alert">
                                        <ReportProblemIcon />
                                        <p> {startValidation} </p>
                                    </div> 
                                : ""}
                                <div className="content__form__period__option">
                                    <input
                                        type="radio"
                                        name="radio-start"
                                        id="all-start"
                                        value={0}
                                        onChange={(e) => onSetPeriodOfDay(e)}
                                    /> All day <br/>
                                    <input
                                        type="radio"
                                        name="radio-start"
                                        id="half-start"
                                        value={1}
                                        onChange={(e) => onSetPeriodOfDay(e)}
                                    /> Half day
                                </div>
                            </div>
                            <ArrowRightAltIcon />
                            <div className="content__form__period__left">
                                <div className="content__form__period__end">
                                    <label> End on: </label>
                                    <div className="input__content">
                                        <input readOnly placeholder="Pick a date..." value={convertDate(endTime)}/>
                                        <SelectCalendar
                                            multipleSelect={false}
                                            onSelectDay={onSetEndTime}
                                            conditionDisable = {() => (false)}
                                            value={[new Date()]}
                                        />
                                    </div>
                                </div>
                                {(endValidation) ?
                                    <div className="validate_alert">
                                        <ReportProblemIcon />
                                        <p> {endValidation} </p>
                                    </div> 
                                : ""}
                                {viewOptionsEndTime() ?
                                    <div className="content__form__period__option">
                                        <input
                                            type="radio"
                                            name="radio-end"
                                            id="all-end"
                                            value={0}
                                            onChange={(e) => onSetPeriodOfDay(e)}
                                        /> All day <br/>
                                        <input
                                            type="radio"
                                            name="radio-end"
                                            id="half-end"
                                            value={1}
                                            onChange={(e) => onSetPeriodOfDay(e)}
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
                                onChange={(e) => onChange(e)}
                            />
                            {(descriptionValidation) ?
                                <div className="validate_alert" style={{marginTop: "0"}}>
                                    <ReportProblemIcon />
                                    <p> {descriptionValidation} </p>
                                </div> 
                            : ""}
                        </div>
                        <button
                            onClick={onSubmit}
                            style={{
                                backgroundColor: submitStatus ? "#0066CC" : "darkgray",
                            }}
                            disabled= {!submitStatus ? true : false}
                        > 
                            {editStatus ? "Update" : "Send request"} 
                        </button>
                        <button onClick={onCancel}>Cancel</button>
                    </div>
                    <TimeBalance beforeRequest ={props.history.location.state} currentRequest={dayRequest}/>
                </div>
            </PageDesign>
            {
                limiteRequest ?
                <Modal
                    onCloseModal={() => setLimitedRequest(false)}
                    show={limiteRequest}
                    title="Limited!"
                    renderContent={() => renderModalContent()}
                    renderAction={() => renderModalActions()}
                    cssBody={{ minWidth: "35rem" }}
                />
                : ""
                }
        </div>
    )
})

export default withRouter(CreateRequestTimeOff);