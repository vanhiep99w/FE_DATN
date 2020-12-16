import "./PendingRequest.css";
import React, { useState, useRef } from "react";
import timeCloudAPI from "../../apis/timeCloudAPI";
import DropDown2 from "../dropdown2/DropDown2";
import RequestTO from "../requestTO/RequestTO";
import { USER_ID } from "../../utils/localStorageContact";

const PendingRequest = ({
  request,
  changeBecomeApprove,
  changeBecomeReject,
}) => {
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

  const onRejectTimeOff = async () => {
    const res = await timeCloudAPI().put(`status-time-off/${request.id}`, {
      approverId: localStorage.getItem(USER_ID),
      response: rejectInput,
      status: 3,
    });
    return res.data;
  };
  const onApproveTimeOff = async () => {
    const res = await timeCloudAPI().put(`status-time-off/${request.id}`, {
      approverId: localStorage.getItem(USER_ID),
      response: approveInput,
      status: 2,
    });
    return res.data;
  };

  const onButtonRejectSendClickHandler = () => {
    onRejectTimeOff();
    changeBecomeReject(request.id, rejectInput);
  };
  const onButtonApproveSendClickHandler = () => {
    onApproveTimeOff();
    changeBecomeApprove(request.id, approveInput);
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
          <button
            className="approve_active"
            onClick={onButtonApproveSendClickHandler}
          >
            Approve & Send
          </button>
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
          <button
            className={rejectInput ? "reject_active" : "disable"}
            onClick={onButtonRejectSendClickHandler}
          >
            Reject & Send
          </button>
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
