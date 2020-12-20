import "./Tasks.css";
import Task from "./task/Task";
import React, { useState } from "react";
import { v4 } from "uuid";
import { action, change } from "../../../utils/UtilArr";

const Tasks = ({
  tasks,
  setTasks,
  changedTasks,
  setChangedTasks,
  teamMembers,
}) => {
  const [createTaskInput, setCreateTaskInput] = useState("");

  const onCreateTask = (event) => {
    event.preventDefault();
    const temp = {
      id: v4(),
      name: createTaskInput,
      members: [],
      membersChanged: [],
    };

    const [arr, item] = change(
      action.create,
      temp,
      changedTasks,
      "name",
      "name"
    );
    setTasks([...tasks, item]);
    setChangedTasks(arr);
    setCreateTaskInput("");
  };

  const onDeleteTask = (task) => {
    setTasks(tasks.filter((ele) => ele.id !== task.id));
    setChangedTasks(change(action.delete, task, changedTasks)[0]);
  };

  const onTaskChanged = (task) => {
    setTasks(
      tasks.map((ele) => {
        if (ele.id === task.id) return task;
        return ele;
      })
    );
    const [arr, item] = change(action.update, task, changedTasks);
    if (item.action === action.update && !item.membersChanged?.length) {
      setChangedTasks(changedTasks.filter((ele) => ele.id !== item.id));
    } else {
      setChangedTasks(arr);
    }
  };

  return (
    <div className="tasks">
      <table className="tasks__table">
        <thead className="tasks__table-header">
          <tr>
            <th></th>
            <th></th>
            <th>Visible to</th>
            <th>Billable</th>
          </tr>
        </thead>
        <tfoot className="tasks__table-foot">
          <tr>
            <td></td>
            <td>
              <form onSubmit={onCreateTask}>
                <input
                  placeholder="Add more task..."
                  value={createTaskInput}
                  onChange={(event) => setCreateTaskInput(event.target.value)}
                />
              </form>
            </td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
        <tbody className="tasks__table-body">
          {tasks.map((ele) => {
            return (
              <Task
                key={ele.id}
                task={ele}
                teamMembers={teamMembers}
                onTaskChanged={onTaskChanged}
                onDeleteTask={onDeleteTask}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;
