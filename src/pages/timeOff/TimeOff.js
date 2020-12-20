import React, { useEffect, useState } from "react";
import PageDesign from "../../components/pageDesign/PageDesign";
import RequestTimeOff from "../../components/requestTimeOff/RequestTimeOff";
import history from "../../history/index";
import timeCloudAPI from "../../apis/timeCloudAPI";
import { USER_ID } from "../../utils/localStorageContact";
import Modal from "../../components/modal/Modal";
import { v4 } from "uuid";
import "./TimeOff.css";
import { countDate } from "../../utils/Utils";

const TimeOff = () => {
  const [timeOffs, setTimeOffs] = useState([]);
  const [limiteRequest, setLimitedRequest] = useState(false);

  useEffect(() => {
    timeCloudAPI()
      .get(`users/${localStorage.getItem(USER_ID)}/time-off`)
      .then((res) => {
        const temp = res.data;
        temp.sort((a, b) => {
          const startTimeA = new Date(a.timeOff.createAt);
          const startTimeB = new Date(b.timeOff.createAt);
          return startTimeB - startTimeA;
        });
        setTimeOffs(temp);
      });
  }, []);

  const createRequest = () => {
    if (countDateOff() === 12) setLimitedRequest(true);
    else
      history.push({
        pathname: "/create-request-time-off",
        state: countDateOff(),
      });
  };

  const rightHeader = () => {
    return <button onClick={createRequest}>Request time off</button>;
  };

  const onDelete = (ele) => {
    timeCloudAPI()
      .delete(`time-off/${ele.id}`)
      .then((res) => {
        setTimeOffs(timeOffs.filter((timeOff) => timeOff.id !== ele.id));
      });
  };

  const countDateOff = () => {
    let result = 0;
    timeOffs.forEach((ele) => {
      result += countDate(
        new Date(ele.timeOff.startTime),
        new Date(ele.timeOff.endTime)
      );
    });
    return result;
  };

  const renderModalContent = () => {
    return (
      <div className="time_off__modal_content">
        <p>You had used all 12 day off in this year?</p>
      </div>
    );
  };

  const onConfirm = () => {
    setLimitedRequest(false);
  };

  const renderModalActions = () => {
    return (
      <div className="discussion__model_actions">
        <button onClick={onConfirm}> OK </button>
      </div>
    );
  };

  return (
    <div className="time_off">
      <PageDesign
        title="Time Off"
        headerRight={rightHeader()}
        css={{ minHeight: "80vh" }}
      >
        <div className="time_off__limit">
          <span>{countDateOff()} </span> days used /{" "}
          <span> {12 - countDateOff()} </span> remaining
        </div>
        <div className="time_off_requests">
          {timeOffs?.map((ele) => (
            <RequestTimeOff
              key={v4()}
              data={ele}
              onDelete={() => onDelete(ele)}
              timeOffs={timeOffs}
            />
          ))}
        </div>
        {limiteRequest ? (
          <Modal
            onCloseModal={() => setLimitedRequest(false)}
            show={limiteRequest}
            title="Limited!"
            renderContent={() => renderModalContent()}
            renderAction={() => renderModalActions()}
            cssBody={{ minWidth: "35rem" }}
          />
        ) : (
          ""
        )}
      </PageDesign>
    </div>
  );
};

export default TimeOff;
