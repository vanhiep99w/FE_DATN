import "./TimeOffAdmin.css";
import React from "react";
import PageDesign from "../../components/pageDesign/PageDesign";
import TimeOffCalendar from "../../components/timeOffCalendar/TimeOffCalendar";
import PendingRequest from "../../components/pendingRequest/PendingRequest";

const TimeOffAdmin = () => {
  return (
    <PageDesign title="TimeOff">
      <PendingRequest />
      <TimeOffCalendar />
    </PageDesign>
  );
};

export default TimeOffAdmin;
