import "./TimeOffAdmin.css";
import React from "react";
import PageDesign from "../../components/pageDesign/PageDesign";
import TimeOffCalendar from "../../components/timeOffCalendar/TimeOffCalendar";
import PendingRequest from "../../components/pendingRequest/PendingRequest";
import { Link } from "react-router-dom";

const TimeOffAdmin = () => {
  return (
    <div className="time_off_admin">
      <PageDesign title="TimeOff">
        <h3>Pending Requests (5)</h3>
        <PendingRequest />
        <h3>Time off calendar</h3>
        <TimeOffCalendar />
        <Link to="/all-request">Show pass Time off</Link>
      </PageDesign>
      <div className="time_off_admin__footer">
        <h3>My time off</h3>
        <p>
          <span>1</span>
          days used
          <span>/</span>
          <span>11</span>
          remaining
        </p>
      </div>
    </div>
  );
};

export default TimeOffAdmin;
