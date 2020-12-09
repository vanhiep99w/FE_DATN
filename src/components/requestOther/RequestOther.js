import "./RequestOther.css";
import React, { useEffect, useState, useRef } from "react";
import RequestTO from "../requestTO/RequestTO";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DropDown2 from "../dropdown2/DropDown2";
import Modal from "../modal/Modal";
import Avatar from "../";

const RequestOther = ({ requestInfo }) => {
  const [showDD, setShowDD] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const buttonRef = useRef(null);

  const renderContentDD = () => {
    return (
      <div className="request-other__dd-content">
        <p onClick={() => setShowModal(true)}>Edit response</p>
        <p>{requestInfo.status === 2 ? "Reject" : "Approve"} request</p>
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

  const renderContentModal = () => {
    return (
      <div>
        <div className="request-other__modal-header">
          <div request-other__modal-header__left></div>
          <div request-other__modal-header__right></div>
        </div>
        <div className="request-other__modal-content"></div>
        <div className="request-other__modal-action"></div>
      </div>
    );
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
        title="Edit"
        show={showModal}
        onCloseModal={onCloseModal}
        renderContent={renderContentModal}
      />
    </RequestTO>
  );
};

export default RequestOther;
