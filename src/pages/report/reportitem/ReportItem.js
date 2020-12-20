import React, { useState, useEffect } from "react";
import "./ReportItem.css";
import timeCloudAPI from "../../../apis/timeCloudAPI";
import { convertSecondToHour, convertSalary } from "../../../utils/Utils";
import ReportItemTask from "../../../pages/report/reportitem/reportitemtask/ReportItemTask";
import ReportItemTaskDid from "../../../pages/report/reportitem/reportitemtask/ReportItemTaskDid";
import Dropdown2 from "../../../components/dropdown2/DropDown2";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

const ReportItem = ({ project, user, isDoing }) => {
  const [tasks, setTasks] = useState([]);
  const [taskDids, setTaskDids] = useState([]);
  const [time, setTime] = useState([]);
  const [projectUser, setProjectUser] = useState(null);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;
      timeCloudAPI()
        .get(`projects/${project.id}/users/${user.id}`)
        .then((res) => {
          setProjectUser(res.data);
        });

    timeCloudAPI()
      .get(`projects/${project.id}/users/${user.id}/tasks`)
      .then((response) => {
        if (isMounted) setTasks(response.data);
        console.log(response.data);
      })
      .catch((error) => {});
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isMounted = true;
    timeCloudAPI()
      .get(`projects/${project.id}/users/${user.id}/tasks-did`)
      .then((response) => {
        if (isMounted) setTaskDids(response.data);
      })
      .catch((error) => {});
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isMounted = true;
    timeCloudAPI()
      .get(`projects/${project.id}/users/${user.id}/total-times`)
      .then((response) => {
        if (isMounted) setTime(response.data);
      })
      .catch((error) => {});
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const renderContent = () => {
    return (
      <div className="report_item__salary__content">
        <div className="report_item__salary__left">
          <p> Rate: </p>
          <p> Salary(d): </p>
        </div>
        <div className="report_item__salary__right">
          <p> {projectUser?.rate ? projectUser?.rate : "?"} </p>
          <p> {project.done ? convertSalary(projectUser?.salary) : "?"} </p>
        </div>
      </div>
    );
  };
  return (
    <div className="report_item">
      <div
        className="report_item__project"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="report_item__project_name">
          <div
            className="report_item_project_color"
            style={{
              height: "30px",
              width: "30px",
              background: `${project.color}`,
              borderRadius: "15px 50px 50px 15px",
            }}
          ></div>
          <h2>{project.name}</h2>
          <h3>({project.clientName})</h3>
          {project.done ? (
            <div
              className="report_item__project_name_isDone"
              style={{
                height: "30px",
                background: "rgb(204, 13, 13)",
                borderRadius: "15px 15px 15px 15px",
              }}
            >
              <h3>Done</h3>
            </div>
          ) : isDoing === false ? (
            <div
              className="report_item__project_name_isDone"
              style={{
                height: "30px",
                background: "rgb(74 67 67)",
                borderRadius: "15px 15px 15px 15px",
              }}
            >
              <h3>Old Project</h3>
            </div>
          ) : null}
        </div>
        {/* <p> {convertSalary(projectUser?.salary)} </p> */}

        <div className="report_item__project__right">
          <div className="report_item__salary">
            <button onClick={() => setStatus(!status)}>
              <AttachMoneyIcon
                style={{
                  fontSize: "2.5rem",
                  color: project.done ? "#f1a907" : "#7b7a76",
                }}
              />
            </button>
            <Dropdown2
              isShow={status}
              onCloseHandler={() => setStatus(false)}
              renderContent={() => renderContent()}
              css={{
                transform: "translateX(-100%) translateY(0%)",
                padding: "0",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.5)",
              }}
            />
          </div>
          <p>{convertSecondToHour(time) + "h"}</p>
        </div>
      </div>
      <div className="toggle_item">
        {tasks
          .sort((task1, task2) => (task1.name <= task2.name ? -1 : 1))
          .map((task) => (
            <ReportItemTask key={task.id} user={user} task={task} />
          ))}
        {taskDids
          .sort((task1, task2) => (task1.name <= task2.name ? -1 : 1))
          .map((task) => (
            <ReportItemTaskDid key={task.id} user={user} task={task} />
          ))}
      </div>
    </div>
  );
};

export default ReportItem;
