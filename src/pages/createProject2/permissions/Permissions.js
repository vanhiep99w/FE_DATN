import "./Permissions.css";
import React from "react";
import DoubleButton from "../common/doubleButton/DoubleButton";

const Permissions = () => {
  const pmAndAdminSelect = () => {};

  const everyoneSelect = () => {};

  return (
    <div className="permissions">
      <div className="permissions__left">
        <p>Report</p>
      </div>
      <div className="permissions__center">
        <p>Show report to who?</p>
        <p>
          If you allow people this project's report, they can see detail budget,
          timesheet and more...
        </p>
      </div>
      <div className="permissions__right">
        <DoubleButton
          titleLeft="PM & Admin"
          titleRight="Everyone"
          onButtonLeftClick={pmAndAdminSelect}
          onButtonRightClick={everyoneSelect}
        />
      </div>
    </div>
  );
};

export default Permissions;
