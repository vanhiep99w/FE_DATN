import "./Task.css";
import CloseIcon from "@material-ui/icons/Close";
import Checkbox from "../../../../components/checkbox/Checkbox";

import React from "react";
import Tag from "../../../../components/tag/Tag";
import SearchMembers from "../../common/search-members/SearchMembers";
import { v4 } from "uuid";
import { action, change } from "../../../../utils/UtilArr";

const Task = ({ task, teamMembers, onTaskChanged, onDeleteTask }) => {
  const onAddMember = (member) => {
    let temp = [...task.membersChanged];
    if (task.action === action.update || !task.action) {
      temp = change(action.create, member, task.membersChanged)[0];
    }
    onTaskChanged({
      ...task,
      members: [...task.members, member],
      membersChanged: temp,
    });
  };

  const onDeleteMember = (memberId, member) => {
    let temp = [...task.membersChanged];
    if (task.action === action.update || !task.action) {
      temp = change(action.delete, member, task.membersChanged)[0];
    }
    onTaskChanged({
      ...task,
      members: task.members.filter((ele) => ele.id !== memberId),
      membersChanged: temp,
    });
  };

  const onAddAllPeople = () => {
    let temp = [...task.membersChanged];
    teamMembers.forEach((ele) => {
      if (!task.members.some((e) => e.id === ele.id)) {
        temp = change(action.create, ele, temp)[0];
      }
    });

    onTaskChanged({
      ...task,
      members: [...teamMembers],
      membersChanged: temp,
    });
  };

  const onRemoveAllPeople = () => {
    let temp = [...task.membersChanged];
    teamMembers.forEach((element) => {
      temp = change(action.delete, element, temp)[0];
    });
    onTaskChanged({
      ...task,
      members: [],
      membersChanged: temp,
    });
  };

  const onCheckboxAllSelect = (event) => {
    if (event.target.checked) {
      onAddAllPeople();
    } else {
      onRemoveAllPeople();
    }
  };

  return (
    <tr>
      <td className="tasks__delete-item">
        <button onClick={() => onDeleteTask(task)}>
          <CloseIcon />
        </button>
      </td>
      <td className="tasks__name-task">{task.name}</td>
      <td>
        <div className="tasks__members">
          <div>
            <Checkbox
              checked={teamMembers.length === task.members.length}
              showUnCheck={true}
              css={{ padding: 0 }}
              onCheckboxChanged={onCheckboxAllSelect}
              id={v4()}
            />
            All
          </div>
          <Tag
            data={task.members.filter((ele) =>
              teamMembers.some((e) => e.id === ele.id)
            )}
            convertData={(item) => item.name}
            onRemoveItem={onDeleteMember}
          >
            <SearchMembers
              members={teamMembers}
              teamMembers={task.members}
              onSelectItemHandler={onAddMember}
            />
          </Tag>
        </div>
      </td>
      <td className="tasks__billable">
        <Checkbox showUnCheck={true} css={{ padding: 0 }} id={v4()} />
      </td>
    </tr>
  );
};

export default Task;
