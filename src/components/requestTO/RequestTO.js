import "./RequestTO.css";
import React, { useState } from "react";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import Avatar from "../avatar/Avatar";
import {
  status,
  countDate,
  getTimeWriteDiscussion,
  getMouthAndDate,
} from "../../utils/Utils";

const RequestTO = ({ requestInfo, children }) => {
  const [showContent, setShowContent] = useState(false);
  const getStatusClass = () => {
    return `status_${status[requestInfo.status - 1].name.toLocaleLowerCase()}`;
  };

  const getDateStatus = (date) => {
    if (date.getHours() === 12) return "Half";
    return "All";
  };
  return (
    <div className="request_to">
      <div
        className="request_to__header"
        onClick={() => setShowContent(!showContent)}
      >
        <Avatar
          avatarSize="6.5rem"
          css={{ alignItems: "stretch" }}
          avatar={requestInfo.timeOff.user.avatar}
        >
          <div className="request_to__user_info">
            <div className="request_to__user_info__head">
              <p>
                {requestInfo.timeOff.user.name}
                <span className={`request_to__type ${getStatusClass()}`}>
                  {status[requestInfo.status - 1].name}
                </span>
              </p>
              <p>
                Vacation on{" "}
                {getMouthAndDate(new Date(requestInfo.timeOff.startTime))} -{" "}
                {getMouthAndDate(new Date(requestInfo.timeOff.endTime))}
                <span>
                  (
                  {countDate(
                    new Date(requestInfo.timeOff.startTime),
                    new Date(requestInfo.timeOff.endTime)
                  )}{" "}
                  days)
                </span>
              </p>
            </div>

            {!showContent && (
              <p>
                {" "}
                Requested {getTimeWriteDiscussion(requestInfo.timeOff.createAt)}
              </p>
            )}
          </div>
        </Avatar>
        {children}
      </div>
      <div className={`request_to__content ${showContent ? "show" : ""}`}>
        <p className="request_to__description">
          {requestInfo.timeOff.description}
        </p>
        <div className="request_to__time">
          <p>This requestInfo:</p>
          <p>
            {getMouthAndDate(new Date(requestInfo.timeOff.startTime))} (
            {getDateStatus(new Date(requestInfo.timeOff.startTime))} Day)
            <ArrowRightAltIcon />
            {getMouthAndDate(new Date(requestInfo.timeOff.endTime))} (
            {getDateStatus(new Date(requestInfo.timeOff.endTime))} Day)
          </p>
          <p>
            Requested {getTimeWriteDiscussion(requestInfo.timeOff.createAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestTO;
