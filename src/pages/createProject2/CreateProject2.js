import "./CreateProject2.css";
import React, { useState, useRef, useEffect, useMemo } from "react";
import SectionDesign from "./common/sectionDesign/SectionDesign";
import GenInfo from "./genInfo/GenInfo";
import Budget from "./budget/Budget";
import TeamMembers from "./teamMembers/TeamMembers";
import Permissions from "./permissions/Permissions";
import Tasks from "./tasks/Tasks";
import timeCloudAPI from "../../apis/timeCloudAPI";
import Spinner from "../../components/loading/spinner/Spinner";
import { USER_ID } from "../../utils/localStorageContact";
import { randomColorArray, randomNumber } from "../../utils/Utils";
import { action } from "../../utils/UtilArr";
import history from "../../history";

const CreateProject2 = ({ match }) => {
  const editMode = useRef(match.params.id ? true : false);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [color, setColor] = useState(
    randomColorArray[randomNumber(randomColorArray.length)]
  );
  const [haveBudget, setHaveBudget] = useState(false);
  const [budget, setBudget] = useState("");
  const [permission, setPermission] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [manager, setManager] = useState(null);
  const [tasks, setTasks] = useState([]);
  const projectInfo = useRef(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [saving, setSaving] = useState(false);

  //! changed arr
  const [changedTeamMembers, setChangedTeamMembers] = useState([]);
  const [changedTasks, setChangedTasks] = useState([]);

  useEffect(() => {
    if (editMode.current) {
      const fetchInfo = async () => {
        setLoadingInfo(true);
        await Promise.all([
          fetchProjectInfo(match.params.id),
          fetchTeamMembers(),
          fetchTasks(),
        ]);
        setLoadingInfo(false);
      };
      fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onButtonSubmitClick = () => {
    if (editMode.current) {
      onEditProject();
    } else {
      onCreateProject();
    }
  };

  const onCreateProject = async () => {
    setSaving(true);
    const {
      data: { id },
    } = await timeCloudAPI().post("companies/52/projects", {
      color: color,
      clientName: clientName,
      name: projectName,
      projectManagerId: manager?.id,
      budget: +budget,
      permission: permission,
    });

    await Promise.all([
      ...teamMembers.map((ele) =>
        timeCloudAPI().post(`projects/${id}/users/${ele.id}`, {
          rate: ele.rate,
        })
      ),
      ...tasks.map((task) => {
        return saveTaskAndTaskMembers(task, id);
      }),
    ]);
    setSaving(false);
    history.push("/");
  };

  const saveTaskAndTaskMembers = async (task, projectId) => {
    const res = await timeCloudAPI().post(`projects/${projectId}/tasks`, {
      name: task.name,
    });
    const taskId = res.data.id;
    if (task.members) {
      const arrRequest = [
        timeCloudAPI().post(
          `tasks/${taskId}/users/${localStorage.getItem("userId")}`
        ),
        ...task.members.map((user) =>
          timeCloudAPI().post(`tasks/${taskId}/users/${user.id}`)
        ),
      ];
      await Promise.all([...arrRequest]);
    }
  };

  const fetchProjectInfo = async (projectId) => {
    await timeCloudAPI()
      .get(`projects/${match.params.id}`)
      .then((res) => {
        const { data } = res;
        projectInfo.current = data;
        setProjectName(data.name);
        setClientName(data.clientName);
        setColor(data.color);
        setHaveBudget(data.budget && true);
        setBudget(data.budget || "");
        setManager(data.projectManager);
        setPermission(data.permission);
      });
  };

  const fetchTeamMembers = async () => {
    await timeCloudAPI()
      .get(`projects/${match.params.id}/users`)
      .then((res) => {
        const temp = res.data
          .filter(
            (ele) =>
              ele.isDoing &&
              ele.user.id !== parseInt(localStorage.getItem(USER_ID))
          )
          .sort((a, b) => a.user.name.localeCompare(b.user.name));

        setTeamMembers(
          temp.map((ele) => {
            return { ...ele.user, rate: ele.rate };
          })
        );
      });
  };

  const fetchTasks = async () => {
    const res = await timeCloudAPI().get(`projects/${match.params.id}/tasks`);
    const tasks = res.data;
    const res1 = await Promise.allSettled([
      ...tasks.map((ele) => timeCloudAPI().get(`tasks/${ele.id}/users`)),
    ]);
    const temp = tasks.map((ele, index) => {
      const members = res1[index].value.data.filter(
        (user) => user.id !== parseInt(localStorage.getItem(USER_ID))
      );
      if (res1[index].status === "fulfilled") {
        return {
          ...ele,
          members,
          membersChanged: [],
        };
      } else {
        return {
          ...ele,
          members: [],
          membersChanged: [],
        };
      }
    });
    setTasks(temp);
  };

  const onEditProject = async () => {
    setSaving(true);
    await Promise.all([editProjectInfo(), editTeamMembers(), editTasks()]);
    setSaving(false);
    history.push("/projects");
  };

  const projectInfoHaveAnyChanged = () => {
    const temp = projectInfo.current;
    if (temp) {
      if (
        projectName === temp.name &&
        color === temp.color &&
        clientName === temp.clientName &&
        +budget === +temp.budget &&
        manager?.id === temp.projectManager?.id &&
        permission === temp.permission
      ) {
        return false;
      }
      return true;
    } else {
      return true;
    }
  };

  const disableButtonSubmit = () => {
    if (editMode.current) {
      if (
        projectInfoHaveAnyChanged() ||
        changedTeamMembers.length ||
        changedTasks.length
      ) {
        return false;
      }
      return true;
    } else {
      if (projectName && clientName && color && manager) {
        if (haveBudget && !budget) return true;
        return false;
      } else {
        return true;
      }
    }
  };

  const editProjectInfo = async () => {
    if (projectInfoHaveAnyChanged()) {
      await timeCloudAPI().put(`projects/${match.params.id}`, {
        clientName: clientName,
        name: projectName,
        color: color,
        projectManagerId: manager?.id,
        budget: budget,
        permission: permission,
      });
    }
  };
  const editTeamMembers = async () => {
    const projectId = match.params.id;
    if (changedTeamMembers.length) {
      await Promise.all(
        changedTeamMembers.map((ele) => {
          switch (ele.action) {
            case action.create:
              return timeCloudAPI().post(
                `projects/${projectId}/users/${ele.id}`,
                {
                  rate: ele.rate,
                }
              );
            case action.update:
              return timeCloudAPI().put(
                `projects/${projectId}/users/${ele.id}`,
                {
                  rate: ele.rate,
                }
              );
            case action.delete:
            case action.del_up:
              return timeCloudAPI().delete(
                `projects/${projectId}/users/${ele.id}`
              );
            default:
              return Promise.resolve(0);
          }
        })
      );
    }
  };

  const editTasks = async () => {
    if (changedTasks.length) {
      await Promise.all(
        changedTasks.map((ele) => {
          switch (ele.action) {
            case action.create:
              return createTask(ele);
            case action.update:
              return editTask(ele);
            case action.delete:
            case action.del_up:
              return deleteTask(ele);
            default:
              return Promise.resolve(0);
          }
        })
      );
    }
  };

  const createTask = async (task) => {
    const res = await timeCloudAPI().post(`projects/${match.params.id}/tasks`, {
      name: task.name,
    });
    const taskId = res.data.id;
    await Promise.all(
      task.members.map((ele) =>
        timeCloudAPI().post(`tasks/${taskId}/users/${ele.id}`)
      )
    );
  };
  const deleteTask = async (task) => {
    await timeCloudAPI().delete(`tasks/${task.id}`);
  };

  const editTask = async (task) => {
    await Promise.all(
      task.membersChanged.map((ele) => {
        switch (ele.action) {
          case action.create:
            return timeCloudAPI().post(`tasks/${task.id}/users/${ele.id}`);
          case action.delete:
            return timeCloudAPI().delete(`tasks/${task.id}/users/${ele.id}`);
          default:
            return Promise.resolve(0);
        }
      })
    );
  };

  return (
    <div className="create-project-2">
      <div className="create-project-2__header">
        <h1>{editMode ? "Edit project" : "Create new project"}</h1>
        {loadingInfo && (
          <div className="create-project-2__loading">
            <Spinner />
          </div>
        )}
      </div>
      <SectionDesign title="General information">
        <GenInfo
          projectName={projectName}
          setProjectName={setProjectName}
          clientName={clientName}
          setClientName={setClientName}
          color={color}
          setColor={setColor}
        />
      </SectionDesign>
      <SectionDesign title="Budget">
        <Budget
          haveBudget={haveBudget}
          setHaveBudget={setHaveBudget}
          budget={budget}
          setBudget={setBudget}
        />
      </SectionDesign>
      <SectionDesign title="Team members">
        <TeamMembers
          haveBudget={haveBudget}
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          manager={manager}
          setManager={setManager}
          changedTeamMembers={changedTeamMembers}
          setChangedTeamMembers={setChangedTeamMembers}
        />
      </SectionDesign>
      <SectionDesign title="Tasks">
        <Tasks
          tasks={tasks}
          setTasks={setTasks}
          changedTasks={changedTasks}
          setChangedTasks={setChangedTasks}
          teamMembers={teamMembers}
        />
      </SectionDesign>
      <SectionDesign title="Permissions">
        <Permissions permission={permission} setPermission={setPermission} />
      </SectionDesign>
      <SectionDesign title="">
        <div className="create-project-2__footer">
          <div className="create-project-2__footer__left">
            {saving && <Spinner />}
          </div>
          <div className="create-project-2__footer__right">
            <button
              onClick={onButtonSubmitClick}
              className={disableButtonSubmit() ? "disable" : ""}
            >
              {editMode.current ? "Update" : "Create New"}{" "}
            </button>
            <button>Cancel</button>
          </div>
        </div>
      </SectionDesign>
    </div>
  );
};

export default CreateProject2;
