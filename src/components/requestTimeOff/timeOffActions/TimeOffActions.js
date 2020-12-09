import "./TimeOffActions.css";
import React, {useState, useEffect} from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import history from '../../../history/index';
import Modal from '../../../components/modal/Modal';

const TimeOffActions = ({onDelete, data}) => {

  const [deleteStatus, setDeleteStatus] = useState(false);
  const [deleteValiable, setDeleteValiable] = useState(true);

  useEffect(() => {
    if(data.status === 2 || data.status === 3) setDeleteValiable(false);
  },[])
  const onEdit = () => {
    history.push(`/create-request-time-off/${data.id}`);
  }
  const onDeleteClick = () => {
    setDeleteStatus(true);
  }

  const renderModalContent = () => {
    return (
      <div className="time_off__modal_content">
        <p>Do you want to delete this request?</p>
      </div>
    );
  };

  const onCancel = () => {
    setDeleteStatus(false);
  }

  const renderModalActions = () => {
    return (
      <div className="delete_time_off__model_actions">
        <button onClick={onDelete}> Delete </button>
        <button onClick={onCancel}> Cancel </button>
      </div>
    );
  };

  return (
    <div className="time_off_actions">
      {
        deleteValiable ?
        <div>
          <DeleteIcon
            style={{
              fontSize: "2rem",
              padding: ".6rem",
              borderRadius: "50%",
              color: "#898989",
              boxShadow: "-1px 1px 5px rgba(0,0,0, 0.5)",
            }}
            onClick={onDeleteClick}
          />
          <EditIcon
            style={{
              fontSize: "2rem",
              padding: ".6rem",
              marginLeft: "1rem",
              borderRadius: "50%",
              color: "#898989",
              boxShadow: "-1px 1px 5px rgba(0,0,0, 0.5)",
            }}
            onClick={onEdit}
          />
        </div>
        : ""
      }
      {
          deleteStatus ?
          <Modal
            onCloseModal={() => setDeleteStatus(false)}
            show={deleteStatus}
            title="Delete!"
            renderContent={() => renderModalContent()}
            renderAction={() => renderModalActions()}
            cssBody={{ minWidth: "35rem" }}
          />
          : ""
        }
    </div>
  );
};

export default TimeOffActions;