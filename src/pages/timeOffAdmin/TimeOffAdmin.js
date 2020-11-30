import "./TimeOffAdmin.css";
import React from "react";
import PageDesign from "../../components/pageDesign/PageDesign";
import TimeOffCalendar from "../../components/timeOffCalendar/TimeOffCalendar";
import PendingRequest from "../../components/pendingRequest/PendingRequest";
import { fetchMembers } from "../../redux/actions";
import { connect } from "react-redux";

const TimeOffAdmin = ({ fetchMembers }) => {
  // useEffect(() => {
  //   fetchMembers(52);
  // }, [fetchMembers]);
  return (
    <div className="time_off_admin">
      <PageDesign title="TimeOff">
        <h3>Pending Requests (5)</h3>
        <PendingRequest />
        <h3>Time off calendar</h3>
        <TimeOffCalendar />
        <a href="/">Show pass Time off</a>
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

export default connect(null, { fetchMembers })(TimeOffAdmin);
