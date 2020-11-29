import "./PendingRequest.css";
import React from "react";
import Avatar from "../avatar/Avatar";

const PendingRequest = () => {
  return (
    <div className="pending_request">
      <Avatar avatarSize="6.5rem" css={{ alignItems: "stretch" }}>
        <div className="pending_request__user_info">
          <p>vanhiep99w</p>
          <p>
            Vacation on Aug 31 - Sep 1<span>(2 days)</span>
          </p>
          <p> Requested 1 day ago</p>
        </div>
      </Avatar>
    </div>
  );
};

export default PendingRequest;
