import React, { useState } from "react";
import {
  months,
  status,
  countDate,
  getTimeWriteDiscussion,
} from "../../utils/Utils";
import "./RequestTimeOff.css";
import TimeOffActions from "./timeOffActions/TimeOffActions";
import Avatar from "../../components/avatar/Avatar";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { connect } from "react-redux";
import MessageIcon from '@material-ui/icons/Message';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import DropDown2 from '../../components/dropdown2/DropDown2';
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const RequestTimeOff = ({ data, user, onDelete, timeOffs }) => {
  console.log(data);
  const [descriptionStatus, setDescriptionStatus] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);

  const countDayOff = () => {
    return countDate(
      new Date(data.timeOff.startTime),
      new Date(data.timeOff.endTime)
    );
    //return Math.floor(((new Date(data.timeOff.endTime)).getTime()-(new Date(data.timeOff.startTime)).getTime())/(1000 * 60 * 60 * 24)) + 1;
  };
  const onClick = () => {
    setDescriptionStatus(!descriptionStatus);
  };

  const descriptionContent = (description) => {
    if (descriptionStatus) return description;
    else {
      if (description.includes("\n")) {
        var stringSplit = description.split("\n");
        const temp = 50 * stringSplit.length;
        if (temp > 150) {
          return `${stringSplit[0]}\n${stringSplit[1]}\n...`;
        } else {
          return description;
        }
      } else {
        if (description?.length <= 150) return description;
        else return description?.substring(0, 150) + "...";
      }
    }
  };

  const statusTimeOffURL = () => {
    if (data.status === 1) return "Waiting for approval";
    else if (data.status === 2)
      return `${data.approver.name} approved ${getTimeWriteDiscussion(
        data.acceptAt
      )}`;
    else
      return `${data.approver.name} approved ${getTimeWriteDiscussion(
        data.acceptAt
      )}`;
  };

  const renderContent = () => {
    return <div
              className="response__content"
              style={{
                backgroundColor: descriptionStatus ? "#F6F8FD" : "#FFFFF"
              }}
          >
      <ArrowDropUpIcon
        style={{
          color: "#2496F7",
          fontSize: "3rem",
        }}
      />
      <p> {data.response} </p>
      
    </div>
  }

  return (
    <div
      className="request_time_off"
      onClick={onClick}
      style={{ backgroundColor: descriptionStatus ? "#F6F8FD" : "" }}
    >
      <div className="request_time_off__left">
        <div className="request_time_off__left__data">
          <p style={{ backgroundColor: status[data.status - 1].color }}>
            {" "}
            {status[data.status - 1].name}{" "}
          </p>
          <div className="request_time_off__left__start">
            <div className="day_month">
              {`${days[new Date(data?.timeOff.startTime).getDay()]}, ${
                months[new Date(data?.timeOff.startTime).getMonth()]
              }`}
            </div>
            <div className="date">
              {new Date(data?.timeOff.startTime).getDate()}
            </div>
          </div>
          <div className="request_time_off__left__end">
            <div className="day_month">
              {`${days[new Date(data?.timeOff.endTime).getDay()]}, ${
                months[new Date(data?.timeOff.endTime).getMonth()]
              }`}
            </div>
            <div className="date">
              {new Date(data?.timeOff.endTime).getDate()}
            </div>
          </div>
          <div className="request_time_off__left__center">
            <ArrowRightAltIcon />
            <p> {`(${countDayOff()} days)`} </p>
          </div>
        </div>
      </div>
      <div className="request_time_off__center">
        <p style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>
          {descriptionContent(data.timeOff.description)}
        </p>
        <div className="request_time_off__center__info">
          <Avatar
            avatar={user?.avatar}
            avatarSize="2rem"
            css={{
              fontSize: "1.5rem",
              color: "#030303",
            }}
          >
            {`${user?.name}`}
          </Avatar>
          <p>
            {" "}
            {` requested ${getTimeWriteDiscussion(data.timeOff.createAt)}`}{" "}
          </p>
          <FiberManualRecordIcon
            style={{
              color: "#DDDDDD",
              fontSize: ".8rem",
              margin: "0 1rem",
            }}
          />
          <p> {statusTimeOffURL()} </p>
          <div className="request_time_off_response">
            {
              data.response ? 
                <MessageIcon
                  style={{
                    fontSize: "2rem",
                    color: "#2496F7",
                    marginLeft: "1rem"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setResponseStatus(!responseStatus)
                  }}
                />
              : ""
            }
            <DropDown2
              isShow= {responseStatus}
              onCloseHandler={() => setResponseStatus(false)}
              renderContent={() => renderContent()}
              css={{
                transform: "translateX(0%) translateY(102%)",
                padding: "0",
                overflow: "hidden",
                boxShadow: "none"
              }}
            />
          </div>
          
        </div>
      </div>

      <div className="request_time_off__right">
        <TimeOffActions data={data} onDelete={onDelete} timeOffs={timeOffs}/>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(RequestTimeOff);
