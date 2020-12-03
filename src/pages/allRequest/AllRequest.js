import "./AllRequest.css";
import PageDesign from "../../components/pageDesign/PageDesign";
import React, { useState } from "react";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import { Link } from "react-router-dom";
import DropDown2 from "../../components/dropdown2/DropDown2";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import PendingRequest from "../../components/pendingRequest/PendingRequest";

const types = ["All Request", "Pending", "Approve", "Reject"];

const AllRequest = () => {
  const [selectedType, setSelectedType] = useState(types[1]);
  const [showDropDown, setShowDropDown] = useState(false);
  const renderTitle = () => {
    return (
      <div className="all_request__title">
        <Link to="time-off">
          <ArrowLeftIcon />
          Back to time off
        </Link>
        <h2>All Requests</h2>
      </div>
    );
  };

  const renderDDContent = () => {
    return (
      <div className="all_request__dd_type">
        {types
          .filter((type) => type !== selectedType)
          .map((type, index) => {
            return <p key={index}>{type}</p>;
          })}
      </div>
    );
  };

  const renderHeaderRight = () => {
    return (
      <div className="all_request__title__right">
        <p onClick={() => setShowDropDown(!showDropDown)}>
          {selectedType}
          <ArrowDropDownIcon />
        </p>
        <DropDown2
          // css={{ width: "110%" }}
          isShow={showDropDown}
          onCloseHandler={() => setShowDropDown(false)}
          renderContent={renderDDContent}
        />
      </div>
    );
  };
  return (
    <PageDesign
      css={{ paddingBottom: "5rem" }}
      renderTitle={renderTitle}
      headerRight={renderHeaderRight()}
    >
      <PendingRequest />
      <PendingRequest />
      <PendingRequest />
      <PendingRequest />
      <PendingRequest />
      <PendingRequest />
    </PageDesign>
  );
};

export default AllRequest;
