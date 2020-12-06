import "./PendingRequest.css";
import React, { useEffect, useState, useRef } from "react";
import timeCloudAPI from "../../apis/timeCloudAPI";
import DropDown2 from "../dropdown2/DropDown2";
import RequestTO from "../requestTO/RequestTO";

const PendingRequest = ({ request }) => {
  const [showDDApprove, setShowDDApprove] = useState(false);
  const [showDDReject, setShowDDReject] = useState(false);
  const [approveInput, setApproveInput] = useState("");
  const [rejectInput, setRejectInput] = useState("");

  const approveButtonRef = useRef(null);
  const rejectButtonRef = useRef(null);

  const onApproveButtonCancelClick = () => {
    setApproveInput("");
    setShowDDApprove(false);
  };
  const onRejectButtonCancelClick = () => {
    setRejectInput("");
    setShowDDReject(false);
  };

  const renderDDApproveContent = () => {
    return (
      <div className="pending_request__dd_approve">
        <label htmlFor="response_approve">Your response</label>
        <textarea
          id="response_approve"
          rows="12"
          cols="50"
          placeholder="Say something..."
          value={approveInput}
          onChange={(event) => setApproveInput(event.target.value)}
        />
        <div>
          <button className="approve_active">Approve & Send</button>
          <button onClick={onApproveButtonCancelClick}>Cancel</button>
        </div>
      </div>
    );
  };

  const renderDDRejectContent = () => {
    return (
      <div className="pending_request__dd_approve">
        <label htmlFor="response_approve">Your response</label>
        <textarea
          id="response_approve"
          rows="12"
          cols="50"
          placeholder="Say something..."
          value={rejectInput}
          onChange={(event) => setRejectInput(event.target.value)}
        />

        <div>
          <button className="reject_active">Reject & Send</button>
          <button onClick={onRejectButtonCancelClick}>Cancel</button>
        </div>
      </div>
    );
  };
  const onApproveButtonClick = () => {
    if (!showDDApprove) {
      setShowDDReject(false);
    }
    setShowDDApprove(!showDDApprove);
  };
  const onRejectButtonClick = () => {
    if (!showDDReject) {
      setShowDDApprove(false);
    }
    setShowDDReject(!showDDReject);
  };

  return (
    <RequestTO requestInfo={request}>
      <div
        className="pending_request__action"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pending_request__action__approve">
          <button
            ref={approveButtonRef}
            onClick={onApproveButtonClick}
            className={showDDApprove ? "approve_active" : ""}
          >
            Approve
          </button>
          <DropDown2
            css={{
              cursor: "inherit",
              padding: "2rem",
              transform: `translateY(102%) translateX(calc(-100% + ${approveButtonRef.current?.offsetWidth}px)) `,
            }}
            isShow={showDDApprove}
            onCloseHandler={() => setShowDDApprove(false)}
            renderContent={() => renderDDApproveContent()}
          />
        </div>
        <div className="pending_request__action__reject">
          <button
            ref={rejectButtonRef}
            onClick={onRejectButtonClick}
            className={showDDReject ? "reject_active" : ""}
          >
            Reject
          </button>
          <DropDown2
            css={{
              cursor: "inherit",
              padding: "2rem",
              transform: `translateY(102%) translateX(calc(-100% + ${rejectButtonRef.current?.offsetWidth}px)) `,
            }}
            isShow={showDDReject}
            onCloseHandler={() => setShowDDReject(false)}
            renderContent={() => renderDDRejectContent()}
          />
        </div>
      </div>
    </RequestTO>
  );
};

export default PendingRequest;
