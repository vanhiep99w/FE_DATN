import "./TimeOffAdmin.css";
import React, { useEffect, useState } from "react";
import PageDesign from "../../components/pageDesign/PageDesign";
import TimeOffCalendar from "../../components/timeOffCalendar/TimeOffCalendar";
import PendingRequest from "../../components/pendingRequest/PendingRequest";
import { Link } from "react-router-dom";
import timeCloudAPI from "../../apis/timeCloudAPI";

const TimeOffAdmin = () => {
  const [pendingRequest, setPendingRequest] = useState([]);
  const [approveRequest, setApproveRequest] = useState([]);

  useEffect(() => {
    fetchPendingRequest();
    fetchApproveRequest();
  }, []);

  const changePendingBecomeApproveRequest = (requestId, response) => {
    const temp = [...pendingRequest];
    const index = temp.findIndex((ele) => ele.id === requestId);
    const request = temp.splice(index, 1)[0];
    setPendingRequest(temp);
    request.response = response;
    request.status = 2;
    setApproveRequest([...approveRequest, request]);
  };

  const changePendingBecomeRejectRequest = (requestId) => {
    setPendingRequest(pendingRequest.filter((ele) => ele.id !== requestId));
  };
  const fetchPendingRequest = () => {
    timeCloudAPI()
      .get("time-off/pending")
      .then((res) => {
        setPendingRequest(
          res.data.filter(
            (ele) => new Date(ele.timeOff.startTime) - new Date() >= 0
          )
        );
      });
  };
  const fetchApproveRequest = () => {
    timeCloudAPI()
      .get("time-off/approve")
      .then((res) => {
        setApproveRequest(res.data);
      });
  };

  return (
    <div className="time_off_admin">
      <PageDesign title="TimeOff">
        <h3>Pending Requests ({pendingRequest.length})</h3>
        {pendingRequest
          .sort((a1, a2) => {
            return (
              new Date(a2.timeOff.createAt) - new Date(a1.timeOff.createAt)
            );
          })
          .map((request) => {
            return (
              <PendingRequest
                request={request}
                key={request.id}
                changeBecomeApprove={changePendingBecomeApproveRequest}
                changeBecomeReject={changePendingBecomeRejectRequest}
              />
            );
          })}
        <h3>Time off calendar</h3>
        <TimeOffCalendar
          _pendingRequest={pendingRequest}
          _approveRequest={approveRequest}
        />
        <Link to="/all-request">Show pass Time off</Link>
      </PageDesign>
      <div className="time_off_admin__footer">
        {/* <h3>My time off</h3>
        <p>
          <span>1</span>
          days used
          <span>/</span>
          <span>11</span>
          remaining
        </p> */}
      </div>
    </div>
  );
};

export default TimeOffAdmin;
