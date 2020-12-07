import React, {useEffect, useState} from 'react';
import {months, status, countDate, checkDayOff, getTimeWriteDiscussion} from '../../utils/Utils';
import './RequestTimeOff.css';
import TimeOffActions from './timeOffActions/TimeOffActions';
import Avatar from '../../components/avatar/Avatar';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import timeCloudAPI from '../../apis/timeCloudAPI';
import {connect} from 'react-redux';
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const RequestTimeOff = (({data, user, onDelete}) => {
    console.log(data);
    const [descriptionStatus, setDescriptionStatus] = useState(false);

    const countDayOff = () => {
        return countDate(new Date(data.timeOff.startTime), new Date(data.timeOff.endTime));
        //return Math.floor(((new Date(data.timeOff.endTime)).getTime()-(new Date(data.timeOff.startTime)).getTime())/(1000 * 60 * 60 * 24)) + 1;
    }
    const onClick = () => {
        setDescriptionStatus(!descriptionStatus);
    }

    const descriptionContent = (description) => {
        if(descriptionStatus) return description;
            else {
                if(description.includes("\n")) {
                    var stringSplit = description.split("\n");
                    console.log(stringSplit);
                    return `${stringSplit[0]} \n...`;
                }
                else {
                    if(description?.length <= 150) return description;
                    else return description?.substring(0,150) + "...";
                }
            }
    }

    const statusTimeOffURL = () => {
        if(data.status === 1) return "Waiting for approval";
        else if(data.status === 2) return `${data.approver.name} approved ${getTimeWriteDiscussion(data.acceptAt)}`;
            else return `${data.approver.name} approved ${getTimeWriteDiscussion(data.acceptAt)}`;
    }
    return (
        <div
            className="request_time_off"
            onClick={onClick}
            style={{backgroundColor: descriptionStatus ? "#F6F8FD" : ""}}
        >
            <div className="request_time_off__left">
                <div className="request_time_off__left__data">
                    <p style={{backgroundColor: status[data.status - 1].color}}> {status[data.status - 1].name} </p>
                    <div className="request_time_off__left__start">
                    <div className="day_month">
                                {`${days[(new Date(data?.timeOff.startTime)).getDay()]}, ${months[(new Date(data?.timeOff.startTime)).getMonth()]}`}
                            </div>
                            <div className="date">
                                {(new Date(data?.timeOff.startTime)).getDate()}
                            </div>
                    </div>
                    <div className="request_time_off__left__end">
                        <div className="day_month">
                            {`${days[(new Date(data?.timeOff.endTime)).getDay()]}, ${months[(new Date(data?.timeOff.endTime)).getMonth()]}`}
                        </div>
                        <div className="date">
                            {(new Date(data?.timeOff.endTime)).getDate()}
                        </div>
                    </div>
                    <div className="request_time_off__center">
                        <ArrowRightAltIcon/>
                        <p> {`(${countDayOff()} days)`} </p>
                    </div>
                </div>
            </div>
            <div className="request_time_off__right">
                <div className="request_time_off__right__actions">
                    <TimeOffActions data = {data} onDelete = {onDelete} />
                </div>
                <p style={{whiteSpace:"pre-line"}}> {descriptionContent(data.timeOff.description)} </p>
                <div className="request_time_off__right__info">
                    <Avatar
                        avatar={user?.avatar}
                        avatarSize="2rem"
                        css={{
                            fontSize: "1.5rem",
                            color: "#030303"
                        }}
                    > 
                        {`${user?.name}`}
                    </Avatar>
                    <p> {` requested ${getTimeWriteDiscussion(data.timeOff.createAt)}`} </p>
                    <FiberManualRecordIcon
                        style={{
                            color: "#DDDDDD",
                            fontSize: ".8rem",
                            margin: "0 1rem"
                        }}
                    />
                    <p> {statusTimeOffURL()} </p>
                </div>
            </div>
        </div>
    )
})

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    }
}

export default connect(mapStateToProps)(RequestTimeOff);