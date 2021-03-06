import "./CreateProject.css";
import React, { useState, useEffect, useRef, useMemo } from "react";
import CreateProjectForm from "./createProjectForm/CreateProjectForm";
import SectionForm from "./sectionForm/SectionForm";
import TeamMembers from "./teamMembers/TeamMembers";
import TasksForm from "./tasksForm/TasksForm";
import timeCloudAPI from "../../apis/timeCloudAPI";
import history from "../../history";
import { withRouter } from "react-router-dom";
import Spinner from "../../components/loading/spinner/Spinner";

import { connect } from "react-redux";
import { randomNumber, randomColorArray } from "../../utils/Utils";
import { USER_ID } from "../../utils/localStorageContact";
import Modal from "../../components/modal/Modal";

const CreateProject = ({ match, members }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [projectForm, setProjectForm] = useState({
    projectName: "",
    clientName: "",
    budget: "",
    projectColor: randomColorArray[randomNumber(randomColorArray.length)],
  });
  const [validate, setValidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // * Edit mode state
  const [listTasks, setListTasks] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const projectInfo = useRef();
  const editingMode = useRef(match.params.id ? true : false);
  const [changedMembers, setChangedMembers] = useState([]);
  const [changedTasks, setChangedTasks] = useState([]);
  const [changedListTaskMember, setChangedListTaskMember] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (editingMode.current) {
        const res = await timeCloudAPI().get(
          `projects/${match.params.id}/tasks`
        );
        const tasks = res.data;
        const res1 = await Promise.allSettled([
          ...tasks.map((ele) => timeCloudAPI().get(`tasks/${ele.id}/users`)),
        ]);
        const temp = tasks.map((ele, index) => {
          const users = res1[index].value.data.filter(
            (user) => user.id !== parseInt(localStorage.getItem(USER_ID))
          );
          if (res1[index].status === "fulfilled") {
            return {
              ...ele,
              users,
            };
          } else {
            return {
              ...ele,
              users: [],
            };
          }
        });
        setListTasks(temp);
      }
    };
    fetchTasks();
  }, [match.params.id, setListTasks]);

  useEffect(() => {
    if (editingMode.current) {
      const temp = listTasks.map((ele) => {
        const { users } = ele;
        return {
          ...ele,
          users: selectedMembers.filter((mem) =>
            users.some((user) => user.id === mem.id)
          ),
        };
      });
      setCreatedTasks(temp);
    }
  }, [listTasks, selectedMembers]);

  useEffect(() => {
    if (editingMode.current) {
      timeCloudAPI()
        .get(`projects/${match.params.id}/users`)
        .then((res) => {
          setListUsers(
            res.data
              .filter(
                (ele) =>
                  ele.isDoing &&
                  ele.user.id !== parseInt(localStorage.getItem(USER_ID))
              )
              .map((ele) => {
                return { ...ele.user, rate: ele.rate };
              })
          );
        });
    }
  }, [match.params.id, setListUsers]);

  useEffect(() => {
    if (editingMode.current && members.length) {
      const temp = listUsers.map((user) => {
        const temp = members.find(
          (member) =>
            member.id === user.id && user.id !== localStorage.getItem(USER_ID)
        );
        return { ...temp, rate: user.rate };
      });
      setSelectedMembers(temp);
    }
  }, [listUsers, members]);

  useEffect(() => {
    if (editingMode.current) {
      timeCloudAPI()
        .get(`projects/${match.params.id}`)
        .then((res) => {
          const { data } = res;
          projectInfo.current = data;
          setProjectForm({
            projectName: data.name,
            clientName: data.clientName,
            projectColor: data.color,
            budget: data.budget,
          });
          setSelectedManager(data.projectManager);
        });
    }
  }, [match.params.id]);

  const saveTaskAndTaskMembers = async (task, projectId) => {
    const res = await timeCloudAPI().post(`projects/${projectId}/tasks`, {
      name: task.name,
    });
    const taskId = res.data.id;
    if (task.users) {
      const arrRequest = [
        timeCloudAPI().post(
          `tasks/${taskId}/users/${localStorage.getItem("userId")}`
        ),
        ...task.users.map((user) =>
          timeCloudAPI().post(`tasks/${taskId}/users/${user.id}`)
        ),
      ];
      await Promise.allSettled([...arrRequest]);
    }
  };

  const onCreateProject = async () => {
    setIsSaving(true);
    try {
      const { projectName, clientName, projectColor, budget } = projectForm;
      const {
        data: { id },
      } = await timeCloudAPI().post("companies/52/projects", {
        color: projectColor,
        clientName: clientName,
        name: projectName,
        projectManagerId: selectedManager?.id,
        budget: +budget,
      });
      console.log(selectedMembers);
      await Promise.allSettled([
        ...selectedMembers.map((ele) =>
          timeCloudAPI().post(`projects/${id}/users/${ele.id}`, {
            rate: ele.rate,
          })
        ),
        ...createdTasks.map((task) => {
          return saveTaskAndTaskMembers(task, id);
        }),
      ]);
      setIsSaving(false);
      history.push("/timer");
    } catch (error) {
      console.log(error);
    }
  };
  const onEditProject = async () => {
    setIsSaving(true);
    const { id } = projectInfo.current;
    const arrRequest = [];
    // * api save project
    arrRequest.push(
      timeCloudAPI().put(`projects/${id}`, {
        clientName: projectForm.clientName,
        name: projectForm.projectName,
        color: projectForm.projectColor,
        projectManagerId: selectedManager.id,
        budget: projectForm.budget,
      })
    );

    const deleteTasks = [];
    const otherTasks = [];
    const addedTasks = createdTasks.filter((ele) => !ele.createdBy);
    listTasks.forEach((task) => {
      if (!createdTasks.find((ele) => ele.id === task.id)) {
        deleteTasks.push(task);
      } else {
        otherTasks.push(task);
      }
    });

    // * api tasks
    arrRequest.push(
      ...addedTasks.map((task) => saveTaskAndTaskMembers(task, id))
    );
    arrRequest.push(
      ...deleteTasks.map((task) => timeCloudAPI().delete(`tasks/${task.id}`))
    );

    otherTasks.forEach((task) => {
      const { users } = createdTasks.find((ele) => ele.id === task.id);
      const addedTaskUser = users.filter(
        (user) => !task.users.find((ele) => ele.id === user.id)
      );
      const deletedTaskUser = task.users.filter(
        (user) => !users.find((ele) => ele.id === user.id)
      );
      // * api change user each task
      arrRequest.push(
        ...addedTaskUser.map((user) =>
          timeCloudAPI().post(`tasks/${task.id}/users/${user.id}`)
        )
      );
      arrRequest.push(
        ...deletedTaskUser.map((user) =>
          timeCloudAPI().delete(`tasks/${task.id}/users/${user.id}`)
        )
      );
    });
    arrRequest.push(
      ...deleteTasks.map((ele) => timeCloudAPI().delete(`tasks/${ele.id}`))
    );
    arrRequest.push(
      ...addedTasks.map((ele) =>
        timeCloudAPI().post(`projects/${match.params.id}/tasks`, {
          name: ele.name,
        })
      )
    );

    const deletedMembers = listUsers.filter(
      (user) => !selectedMembers.find((member) => member.id === user.id)
    );
    const addedMembers = selectedMembers.filter(
      (member) => !listUsers.find((user) => member.id === user.id)
    );
    // * api deleteMembers and addedMembers
    arrRequest.push(
      ...deletedMembers.map((mem) =>
        timeCloudAPI().delete(`projects/${id}/users/${mem.id}`)
      )
    );
    arrRequest.push(
      ...addedMembers.map((mem) =>
        timeCloudAPI().post(`projects/${id}/users/${mem.id}`, {
          rate: mem.rate,
        })
      )
    );

    Promise.allSettled(arrRequest).then((res) => {
      setIsSaving(false);
      history.push("/projects");
    });
  };

  const checkHaveAnyChange = useMemo(() => {
    if (editingMode.current) {
      const temp =
        projectForm.clientName === projectInfo.current?.clientName &&
        projectForm.projectName === projectInfo.current?.name &&
        projectForm.projectColor === projectInfo.current?.color &&
        selectedManager?.id === projectInfo.current?.projectManager?.id &&
        !changedMembers.length &&
        !changedTasks.length &&
        !changedListTaskMember.length;

      return validate?.projectName || validate?.clientName || temp;
    } else {
      return validate?.projectName || validate?.clientName;
    }
  }, [
    changedListTaskMember,
    changedMembers,
    changedTasks,
    projectForm,
    selectedManager,
    validate,
  ]);
  const renderAction = () => {
    return (
      <div className="create_project__modal_action">
        <button onClick={() => history.goBack()}>Yes</button>
        <button onClick={() => setShowModal(false)}>No</button>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="create_project__modal_content">
        <p>Cancel will discard all your changed! </p>
        <p>Are you sure?</p>
      </div>
    );
  };

  const onCancelProject = () => {
    setShowModal(true);
  };
  return (
    <div className="create_project">
      <SectionForm title="General Information">
        <CreateProjectForm
          projectForm={projectForm}
          setProjectForm={setProjectForm}
          error={validate}
          setError={setValidate}
        />
      </SectionForm>
      <SectionForm title="Team Members">
        <TeamMembers
          selectedManager={selectedManager}
          setSelectedManager={setSelectedManager}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          changedList={changedMembers}
          setChangedList={setChangedMembers}
        />
      </SectionForm>
      <SectionForm title="Tasks">
        <TasksForm
          selectedMembers={selectedMembers}
          selectedTasks={createdTasks}
          setSelectedTasks={setCreatedTasks}
          changedList={changedTasks}
          setChangedList={setChangedTasks}
          changedList2={changedListTaskMember}
          setChangedList2={setChangedListTaskMember}
        />
      </SectionForm>
      <div className="create_project__bottom">
        <div className="create_project__spinner">
          {isSaving ? <Spinner /> : null}
        </div>
        <div className="create_project__button">
          {!isSaving ? (
            <button
              className="create_project__button__cancel"
              onClick={onCancelProject}
              style={{}}
            >
              Cancel
            </button>
          ) : null}
          <button
            className="create_project__button__create_new"
            onClick={editingMode.current ? onEditProject : onCreateProject}
            disabled={checkHaveAnyChange}
            style={{
              cursor: checkHaveAnyChange ? "initial" : "pointer",
              color: checkHaveAnyChange ? "darkgray" : "white",
            }}
          >
            {editingMode.current ? "Save" : "Create New"}
          </button>
        </div>
      </div>
      <Modal
        title={editingMode.current ? "Edit Project" : "Create Project"}
        show={showModal}
        onCloseModal={() => setShowModal(false)}
        renderContent={renderContent}
        renderAction={renderAction}
        cssBody={{ minWidth: "25rem" }}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { members } = state.members;
  return {
    members,
  };
};

export default connect(mapStateToProps)(withRouter(CreateProject));
