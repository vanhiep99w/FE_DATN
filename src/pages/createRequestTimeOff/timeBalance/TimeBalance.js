import React, {useEffect, useState} from "react";
import timeCloudAPI from '../../../apis/timeCloudAPI';
import "./TimeBalance.css";

const TimeBalance = ({beforeRequest, currentRequest}) => {

  const [approver, setApprover] = useState(null);

  useEffect(() => {
    timeCloudAPI().get(`time-off/approver`)
    .then(res => {
      setApprover(res.data)
    })
  },[])

  const nameApprover = () => {
    let result = "";
    if(approver) approver.forEach((ele, index) => {
      if(index === approver.length - 1) result += ele.name;
      else result += ele.name + ", "
    })
    return result;
  }

  return (
    <div className="content__info">
      <h1>My time balance</h1>
      <div className="content__info__row">
        <p>Before request</p>
        <p> {beforeRequest} </p>
      </div>
      <div className="content__info__row">
        <p>This request</p>
        <p> {currentRequest} </p>
      </div>
      <div className="content__info__row">
        <p>After request</p>
        <p> {12 - (beforeRequest + currentRequest)} </p>
      </div>
      <span> Approvers: </span>
      <span> {nameApprover()} </span>
    </div>
  );
};

export default TimeBalance;
