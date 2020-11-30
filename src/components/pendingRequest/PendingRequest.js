import "./PendingRequest.css";
import React, { useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import timeCloudAPI from "../../apis/timeCloudAPI";
import { connect } from "react-redux";
import { checkAuth } from "../../redux/actions";

const PendingRequest = ({ checkAuth }) => {
  const [test, setTest] = useState(null);
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    checkAuth().then(() => {
      timeCloudAPI()
        .get("time-off/8")
        .then((res) => setTest(res.data));
    });
  }, [checkAuth]);

  return (
    <div className="pending_request">
      <div
        className="pending_request__header"
        onClick={() => setShowContent(!showContent)}
      >
        <Avatar avatarSize="6.5rem" css={{ alignItems: "stretch" }}>
          <div className="pending_request__user_info">
            <p>vanhiep99w</p>
            <p>
              Vacation on Aug 31 - Sep 1<span>(2 days)</span>
            </p>
            <p> Requested 1 day ago</p>
          </div>
        </Avatar>
        <div
          className="pending_request__action"
          onClick={(event) => event.stopPropagation()}
        >
          <button>Approve</button>
          <button>Reject</button>
        </div>
      </div>
      <div className={`pending_request__content ${showContent ? "show" : ""}`}>
        <p className="pending_request__description">{test?.description}</p>
        <div className="pending_request__time">
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

export default connect(null, { checkAuth })(PendingRequest);
