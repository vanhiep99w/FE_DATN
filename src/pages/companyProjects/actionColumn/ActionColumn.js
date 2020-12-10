import "./ActionColumn.css";
import React, { useState, useEffect } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/AssignmentTurnedIn";
import Modal from "../../../components/modal/Modal";
import timeCloudAPI from "../../../apis/timeCloudAPI";
import { convertToHour } from "../../../utils/Utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import history from '../../../history/index';
const styleCom = {
  fontSize: "3rem",
};

const ActionColumn = ({ project, onEdit, deleteProject }) => {
  const [showModal, setShowModal] = useState(false);
  const [projectUsers, setProjectUsers] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [salary, setSalary] = useState(null);
  const onModalClose = () => {
    setShowModal(false);
  };


  useEffect(() => {
    let data = [];
    timeCloudAPI()
      .get(`projects/${project.id}/users`)
      .then((response) => {
        setProjectUsers(response.data)
        response.data.forEach(ele => {
          timeCloudAPI()
            .get(`projects/${project.id}/users/${ele.user.id}/total-times`)
            .then((res) => {
              data.push(convertToHour(res.data))
            })
          
        })
    });
    setTotalTime(data);
  },[]);
  const calculateSalary = () => {
    let salary = [];
    let rate = Math.round(project.budget / billableRate());
    projectUsers.forEach((ele, index) => {
      timeCloudAPI().put(`projects/${project.id}/users/${ele.user.id}`, {
        salary: Math.round(totalTime[index] * ele.rate * rate)
      })
      console.log(totalTime[index], ele.rate, rate)
      salary.push(Math.round(totalTime[index] * ele.rate * rate));
    });
    console.log(salary);
    setSalary(salary);
  }

  const billableRate = () => {
    let result = 0;
    projectUsers.forEach((ele, index) => {
      result += totalTime[index] * ele.rate;
    })
    return result;
  }

  const renderModalAction = () => {
    return (
      <div className="action_column__button">
        <button
          onClick={() => {
            console.log(project);
            setShowModal(false);
            calculateSalary();
            timeCloudAPI().delete(`projects/${project.id}`);
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
    <>
      <AttachMoneyIcon
        style={{ ...styleCom, marginRight: "5px", color: "#dcc41c" }}
        className="projects__icon projects__icon__edit"
        onClick= {(e) => {
          e.stopPropagation();
          history.push({
            pathname: `projects/${project.id}/payroll`,
            state: {
              project: project,
              salary: salary,
              user: projectUsers,
              time: totalTime
            }
          })
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
      {!project.done && (
        <DeleteIcon
          style={{ ...styleCom }}
          className=" projects__icon projects__icon__delete"
          onClick={(e) => {
            e.stopPropagation();
            // onDelete(project.id);
            setShowModal(true);
          }}
        />
      )}

      <Modal
        show={showModal}
        title="Finish project!"
        renderContent={() => `Are you sure to finish ${project.name}?`}
        renderAction={renderModalAction}
        onCloseModal={onModalClose}
      />
    </>
  );
};

export default ActionColumn;
