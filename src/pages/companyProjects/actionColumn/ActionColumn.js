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
    timeCloudAPI()
      .get(`projects/${project.id}/users`)
      .then((response) => {
        setProjectUsers(response.data);
        Promise.all(
          response.data.map((ele) => {
            return timeCloudAPI().get(
              `projects/${project.id}/users/${ele.user.id}/total-times`
            );
          })
        ).then((res) => {
          setTotalTime(
            res.map((ele, index) => {
              return {
                id: response.data[index].user.id,
                time: convertToHour(ele.data),
              };
            })
          );
        });
      });
  }, [project.id]);

  const calculateSalary = () => {
    let rate = Math.round((project.budget / billableRate()) * 10) / 10;
    projectUsers.forEach((ele, index) => {
      timeCloudAPI().put(`projects/${project.id}/users/${ele.user.id}`, {
        salary: Math.round(totalTime[index].time * ele.rate * rate),
      });
    });
  };

  const billableRate = () => {
    let result = 0;
    projectUsers.forEach((ele, index) => {
      let temp = totalTime.filter((element) => element.id === ele.user.id);
      result += temp[0].time * ele.rate;
    });
    return Math.round(result * 10) / 10;
  };

  const renderModalAction = () => {
    return (
      <div className="action_column__button">
        <button
          onClick={() => {
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
          Cancel
        </button>
      </div>
    );
  };
  return (
    <div className="visible_hover action_column">
      {project.permissionProject || (
        <>
          {!project.done && (
            <span className="projects__icon">
              <DeleteIcon
                className="projects__icon__item"
                onClick={(e) => {
                  e.stopPropagation();
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
                    salary: null,
                    user: projectUsers,
                    time: totalTime,
                  },
                });
              }}
            />
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
        </>
      )}

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
