import "./AllRequest.css";
import PageDesign from "../../components/pageDesign/PageDesign";
import React, { useState, useEffect } from "react";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import { Link } from "react-router-dom";
import DropDown2 from "../../components/dropdown2/DropDown2";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import PendingRequest from "../../components/pendingRequest/PendingRequest";
import timeCloudAPI from "../../apis/timeCloudAPI";
// import RequestOther from "../../components/requestOther/RequestOther";
import Spinner from "../../components/loading/spinner/Spinner";
import { checkDayRequestIsDayOff } from "../../utils/validationUtils";

const types = ["All Request", "Pending", "Approve", "Reject"];

const AllRequest = () => {
  const maxSize = 20;
  const [page, setPage] = useState(0);
  const [selectedType, setSelectedType] = useState(types[1]);
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

  const handlerData = async () => {
    setLoading(true);
    await Promise.all([
      fetchPendingRequest(),
      fetchNonPendingRequest(maxSize, page),
    ]);
    setLoading(false);
  };

  const fetchPendingRequest = async () => {
    const res = await timeCloudAPI().get("time-off/pending");
    const temp = res.data;
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

  const changeStatusOffPendingRequest = (requestId, response, statusId) => {
    const temp = [...pendingRequest];
    const index = temp.findIndex((ele) => ele.id === requestId);
    const request = temp.splice(index, 1)[0];
    setPendingRequest(temp);
    request.response = response;
    request.status = statusId;
    setOtherRequest([...otherRequest, request]);
  };

  const editOtherRequest = () => {};

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
          isShow={showDropDown}
          onCloseHandler={() => setShowDropDown(false)}
          renderContent={renderDDContent}
        />
      </div>
    );
  };

  const renderRequest = (request) => {
    if (request.status === 1) {
      return <PendingRequest request={request} key={request.id} />;
    }
    // else return <RequestOther requestInfo={request} key={request.id} />;
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