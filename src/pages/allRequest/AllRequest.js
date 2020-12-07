import "./AllRequest.css";
import PageDesign from "../../components/pageDesign/PageDesign";
import React, { useState, useEffect } from "react";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import { Link } from "react-router-dom";
import DropDown2 from "../../components/dropdown2/DropDown2";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import PendingRequest from "../../components/pendingRequest/PendingRequest";
import timeCloudAPI from "../../apis/timeCloudAPI";
import RequestTO from "../../components/requestTO/RequestTO";

const types = ["All Request", "Pending", "Approve", "Reject"];

const AllRequest = () => {
  const maxSize = 10;
  const [page, setPage] = useState(0);
  const [selectedType, setSelectedType] = useState(types[1]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [otherRequest, setOtherRequest] = useState([]);

  useEffect(() => {
    fetchPendingRequest();
    fetchNonPendingRequest(maxSize - pendingRequest.length, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPendingRequest = () => {
    timeCloudAPI()
      .get("time-off/pending")
      .then((res) => {
        setPendingRequest(res.data);
      });
  };

  const fetchNonPendingRequest = (limit, page) => {
    timeCloudAPI()
      .get(`status-time-off/non_pending?limit=${limit}&page=${page}`)
      .then((res) => {
        console.log(res);
        setOtherRequest(res.data);
      });
  };

  const changePendingBecomeApproveRequest = (requestId, response, statusId) => {
    const temp = [...pendingRequest];
    const index = temp.findIndex((ele) => ele.id === requestId);
    const request = temp.splice(index, 1)[0];
    setPendingRequest(temp);
    request.response = response;
    request.status = statusId;
    setOtherRequest([...otherRequest, request]);
  };

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
      {pendingRequest
        .sort((a1, a2) => {
          return new Date(a2.timeOff.createAt) - new Date(a1.timeOff.createAt);
        })
        .map((request) => {
          return <PendingRequest request={request} key={request.id} />;
        })}
      {otherRequest.map((request) => {
        return <RequestTO requestInfo={request} key={request.id} />;
      })}
    </PageDesign>
  );
};

export default AllRequest;
