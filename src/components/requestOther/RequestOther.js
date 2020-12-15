import "./RequestOther.css";
import React, { useEffect, useState, useRef } from "react";
import RequestTO from "../requestTO/RequestTO";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DropDown2 from "../dropdown2/DropDown2";
import Modal from "../modal/Modal";
import Avatar from "../avatar/Avatar";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { getMouthAndDate, status } from "../../utils/Utils";
import { USER_ID } from "../../utils/localStorageContact";
import timeCloudAPI from "../../apis/timeCloudAPI";

const RequestOther = ({ requestInfo, onChangeStatus }) => {
  const [showDD, setShowDD] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const buttonRef = useRef(null);
  const [statusData, setStatusData] = useState(requestInfo.status);
  const [response, setResponse] = useState(requestInfo.response);

  const renderContentDD = () => {
    return (
      <div className="request-other__dd-content">
        <p onClick={() => setShowModal(true)}>Edit response</p>
      </div>
    );
  };

  const onCloseDD = () => {
    setShowDD(false);
  };
  const onCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handlerClose = (event) => {
      if (event.target !== buttonRef.current) {
        onCloseDD();
      }
    };
    window.addEventListener("click", handlerClose);
    return () => {
      window.removeEventListener("click", handlerClose);
    };
  });
  const getStatusClass = () => {
    return `status_${status[statusData - 1].name.toLocaleLowerCase()}`;
  };

  const onUpdateRequest = () => {
    timeCloudAPI().put(`status-time-off/${requestInfo.id}`, {
      approverId: localStorage.getItem(USER_ID),
      response: response,
      status: statusData,
    });
    onChangeStatus(requestInfo, response, statusData);
    setShowModal(false);
  };

  const renderActionModal = () => {
    return (
      <div className="request-other__modal-action">
        <div className="request-other__modal-action__left">
          <button onClick={onButtonChangeStatusClick}>
            Change to {statusData === 2 ? "Reject" : "Approve"}
          </button>
        </div>
        <div className="request-other__modal-action__right">
          <button onClick={onUpdateRequest}>Save</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </div>
    );
  };

  const renderContentModal = () => {
    return (
      <div className="request-other__modal">
        <div className="request-other__modal-header">
          <div className="request-other__modal-header__left">
            <Avatar
              avatarSize="3.5rem"
              css={{ alignItems: "stretch" }}
              avatar={requestInfo.timeOff.user.avatar}
            >
              <div className="request-other__user-info">
                <p>{requestInfo.timeOff.user.name}</p>
                <p>{requestInfo.timeOff.user.email}</p>
              </div>
            </Avatar>
          </div>
          <div className="request-other__modal-header__center">
            <p>
              {getMouthAndDate(new Date(requestInfo.timeOff.startTime))}
              <ArrowRightAltIcon />
              {getMouthAndDate(new Date(requestInfo.timeOff.endTime))}
            </p>
          </div>
          <div className="request-other__modal-header__right">
            <span className={` ${getStatusClass()}`}>
              {status[statusData - 1].name}
            </span>
          </div>
        </div>
        <div className="request-other__modal-content">
          <div className="request-other__modal-content__left">
            <label>Request</label>
            <textarea
              rows="15"
              cols="40"
              value={requestInfo.timeOff.description}
              readOnly
              disabled
            />
          </div>
          <div className="request-other__modal-content__right">
            <label>Response</label>
            <textarea
              rows="15"
              cols="40"
              value={response}
              onChange={(event) => setResponse(event.target.value)}
            />
          </div>
        </div>
      </div>
    );
  };

  const onButtonChangeStatusClick = () => {
    setStatusData(statusData === 2 ? 3 : 2);
  };

  const onButtonActionClick = (event) => {
    event.stopPropagation();
    setShowDD(!showDD);
  };
  return (
    <RequestTO requestInfo={requestInfo}>
      <div className="request-other__left">
        <button onClick={onButtonActionClick} ref={buttonRef}>
          <MoreHorizIcon />
        </button>
        <DropDown2
          css={{ boxShadow: "1px 3px 8px rgba(0, 0, 0, 0.4)" }}
          isShow={showDD}
          onCloseHandler={onCloseDD}
          renderContent={renderContentDD}
        />
      </div>
      <Modal
        cssBody={{ backgroundColor: "#f8f8f8" }}
        title="Edit request"
        show={showModal}
        onCloseModal={onCloseModal}
        renderContent={renderContentModal}
        renderAction={renderActionModal}
        closeWhenClickOutSide={false}
      />
    </RequestTO>
  );
};

export default RequestOther;
