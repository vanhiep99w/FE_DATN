import "./ActionColumn.css";
import React, { useState, useEffect } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/AssignmentTurnedIn";
import Modal from "../../../components/modal/Modal";
import timeCloudAPI from "../../../apis/timeCloudAPI";
import { convertToHour } from "../../../utils/Utils";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import history from "../../../history/index";

const ActionColumn = ({ project, onEdit, deleteProject }) => {
  const [showModal, setShowModal] = useState(false);
  const [projectUsers, setProjectUsers] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const onModalClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    let data = [];
    timeCloudAPI()
      .get(`projects/${project.id}/users`)
      .then((response) => {
        console.log(response.data);
        setProjectUsers(response.data);
        response.data.forEach((ele) => {
          timeCloudAPI()
            .get(`projects/${project.id}/users/${ele.user.id}/total-times`)
            .then((res) => {
              data.push(convertToHour(res.data));
            });
        });
      });
    setTotalTime(data);
  }, [project.id]);

  const calculateSalary = () => {
    let rate = Math.round((project.budget / billableRate()) * 10) / 10;
    console.log(rate);
    projectUsers.forEach((ele, index) => {
      timeCloudAPI().put(`projects/${project.id}/users/${ele.user.id}`, {
        salary: Math.round(totalTime[index] * ele.rate * rate)
      })
    });
  };

  const billableRate = () => {
    let result = 0;
    projectUsers.forEach((ele, index) => {
      result += totalTime[index] * ele.rate;
    });
    console.log(result);
    return Math.round(result * 10) / 10;
  };

  const renderModalAction = () => {
    return (
      <div className="action_column__button">
        <button
          onClick={() => {
            console.log(project);
            setShowModal(false);
            calculateSalary();
            timeCloudAPI().put(
              `projects/change-status/${project.id}?done=true`
            );
            deleteProject(project);
          }}
        >
          Yes
        </button>
        <button
          onClick={() => {
            setShowModal(false);
          }}
        >
          No
        </button>
      </div>
    );
  };
  return (
    <div className="visible_hover action_column">
      {!project.done && (
        <span className="projects__icon">
          <DeleteIcon
            className="projects__icon__item"
            onClick={(e) => {
              e.stopPropagation();
              // onDelete(project.id);
              setShowModal(true);
            }}
          />
        </span>
      )}
      <span className="projects__icon">
        <AttachMoneyIcon
          className="projects__icon__item"
          onClick={(e) => {
            e.stopPropagation();
            history.push({
              pathname: `projects/${project.id}/payroll`,
              state: {
                project: project,
                salary: salary,
                user: projectUsers,
                time: totalTime,
              },
            });
          }}
        />
<<<<<<< HEAD
      )}
      <AttachMoneyIcon
        style={{
          ...styleCom,
          marginRight: "5px",
          color: "#898989",
        }}
        className="projects__icon projects__icon__edit"
        onClick={(e) => {
          e.stopPropagation();
          history.push(`projects/${project.id}/payroll`);
        }}
      />
      <EditIcon
        style={{ ...styleCom, marginRight: "5px" }}
        className="projects__icon projects__icon__edit"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(project);
        }}
      />
=======
      </span>

      <span className="projects__icon">
        <EditIcon
          className="projects__icon__item"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project);
          }}
        />
      </span>
>>>>>>> develop

      <Modal
        show={showModal}
        title="Finish project!"
        renderContent={() => {
          return (
            <p className="action_column__modal_content">
              Are you sure to finish "{project.name}"?
            </p>
          );
        }}
        renderAction={renderModalAction}
        onCloseModal={onModalClose}
      />
    </div>
  );
};

export default ActionColumn;
