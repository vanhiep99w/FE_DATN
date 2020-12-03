import "./RequestTO.css";
import React, { useState } from "react";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import Avatar from "../avatar/Avatar";

const RequestTO = ({ requestInfo, children }) => {
  const [showContent, setShowContent] = useState(false);
  return (
    <div className="request_to">
      <div
        className="request_to__header"
        onClick={() => setShowContent(!showContent)}
      >
        <Avatar avatarSize="6.5rem" css={{ alignItems: "stretch" }}>
          <div className="request_to__user_info">
            <p>
              vanhiep99w
              <span className="request_to__type status_pending">Pending</span>
            </p>
            <p>
              Vacation on Aug 31 - Sep 1<span>(2 days)</span>
            </p>
            <p> Requested 1 day ago</p>
          </div>
        </Avatar>
        {children}
      </div>
      <div className={`request_to__content ${showContent ? "show" : ""}`}>
        <p className="request_to__description">{requestInfo?.description}</p>
        <div className="request_to__time">
          <p>This request:</p>
          <p>
            Aug 31 (All Day)
            <ArrowRightAltIcon />
            Sep 1 (All Day)
          </p>
          <p>Requested 1 day ago</p>
        </div>
      </div>
    </div>
  );
};

export default RequestTO;
