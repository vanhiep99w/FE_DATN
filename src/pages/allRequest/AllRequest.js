import "./AllRequest.css";
import PageDesign from "../../components/pageDesign/PageDesign";
import React, { useState, useEffect } from "react";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import { Link } from "react-router-dom";
import DropDown2 from "../../components/dropdown2/DropDown2";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import PendingRequest from "../../components/pendingRequest/PendingRequest";
import timeCloudAPI from "../../apis/timeCloudAPI";
import RequestOther from "../../components/requestOther/RequestOther";
import Spinner from "../../components/loading/spinner/Spinner";

const types = ["All Request", "Pending", "Approve", "Reject"];

const AllRequest = () => {
  const maxSize = 20;
  const [selectedType, setSelectedType] = useState(types[0]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [otherRequest, setOtherRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    handlerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setData([...pendingRequest, ...otherRequest]);
  }, [pendingRequest, otherRequest]);

  const onFilterChangeHandler = (type) => {
    setShowDropDown(false);
    setSelectedType(type);
    switch (type) {
      case types[0]:
        setData([...pendingRequest, ...otherRequest]);
        break;
      case types[1]:
        setData([...pendingRequest]);
        break;
      case types[2]:
        setData([...otherRequest.filter((ele) => ele.status === 2)]);
        break;
      case types[3]:
        setData([...otherRequest.filter((ele) => ele.status === 3)]);
        break;
      default:
        break;
    }
  };

  const handlerData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPendingRequest(),
      fetchNonPendingRequest(maxSize, 0),
    ]);
    setLoading(false);
  };

  const fetchPendingRequest = async () => {
    const res = await timeCloudAPI().get("time-off/pending");
    const temp = res.data.filter(
      (ele) => new Date(ele.timeOff.startTime) - new Date() >= 0
    );
    temp.sort((a1, a2) => {
      return new Date(a2.timeOff.createAt) - new Date(a1.timeOff.createAt);
    });
    setPendingRequest(temp);
  };

  const fetchNonPendingRequest = async (limit, page) => {
    const res = await timeCloudAPI().get(
      `status-time-off/non_pending?limit=${limit}&page=${page}`
    );
    const temp = res.data;
    temp.sort((a1, a2) => {
      return new Date(a2.timeOff.createAt) - new Date(a1.timeOff.createAt);
    });
    setOtherRequest(temp);
  };

  const changeStatusOffRequest = (request, response, statusId) => {
    let temp;
    const statusIdTemp = request.status;
    if (statusIdTemp === 1) {
      temp = [...pendingRequest];
      const index = temp.findIndex((ele) => ele.id === request.id);
      const requestTemp = temp.splice(index, 1)[0];
      setPendingRequest(temp);
      request.response = response;
      request.status = statusId;
      setOtherRequest([requestTemp, ...otherRequest]);
    } else {
      setOtherRequest(
        otherRequest.map((ele) => {
          if (ele.id === request.id)
            return { ...ele, response: response, status: statusId };
          return ele;
        })
      );
    }
  };

  const changePendingBecomeApproveRequest = (requestId, response) => {
    const temp = [...pendingRequest];
    const index = temp.findIndex((ele) => ele.id === requestId);
    const request = temp.splice(index, 1)[0];
    setPendingRequest(temp);
    request.response = response;
    request.status = 2;
    setOtherRequest([request, ...otherRequest]);
  };

  const changePendingBecomeRejectRequest = (requestId, response) => {
    const temp = [...pendingRequest];
    const index = temp.findIndex((ele) => ele.id === requestId);
    const request = temp.splice(index, 1)[0];
    setPendingRequest(temp);
    request.response = response;
    request.status = 3;
    setOtherRequest([request, ...otherRequest]);
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
            return (
              <p key={index} onClick={() => onFilterChangeHandler(type)}>
                {type}
              </p>
            );
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
          css={{ minWidth: "13rem" }}
          isShow={showDropDown}
          onCloseHandler={() => setShowDropDown(false)}
          renderContent={renderDDContent}
        />
      </div>
    );
  };

  const renderRequest = (request) => {
    if (request.status === 1) {
      return (
        <PendingRequest
          request={request}
          key={request.id}
          changeBecomeApprove={changePendingBecomeApproveRequest}
          changeBecomeReject={changePendingBecomeRejectRequest}
        />
      );
    } else
      return (
        <RequestOther
          requestInfo={request}
          key={request.id}
          onChangeStatus={changeStatusOffRequest}
        />
      );
  };
  return (
    <PageDesign
      css={{ paddingBottom: "5rem" }}
      renderTitle={renderTitle}
      headerRight={renderHeaderRight()}
    >
      {loading ? (
        <div style={{ width: "5rem", height: "5rem", margin: "0 auto" }}>
          <Spinner />
        </div>
      ) : (
        data.map((ele) => renderRequest(ele))
      )}
    </PageDesign>
  );
};

export default AllRequest;
