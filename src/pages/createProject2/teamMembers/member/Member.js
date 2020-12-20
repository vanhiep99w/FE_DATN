import "./Member.css";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState, useEffect } from "react";
import Avatar from "../../../../components/avatar/Avatar";
import Checkbox from "../../../../components/checkbox/Checkbox";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { v4 } from "uuid";

const Member = ({
  member,
  manager,
  onCheckBoxChanged,
  haveBudget,
  onRemoveTeamMember,
  onEditTeamMember,
}) => {
  const [rateInput, setRateInput] = useState("");
  const onBlurRateInputHandler = () => {
    if (rateInput !== member.rate) {
      const temp = { ...member };
      temp.rate = rateInput;
      onEditTeamMember(temp);
    }
  };

  useEffect(() => {
    if (member.rate) {
      setRateInput(member.rate);
    } else {
      setRateInput("");
    }
  }, [member]);
  return (
    <tr>
      <td>
        <button
          className="team-members__delete_item"
          onClick={onRemoveTeamMember}
        >
          <CloseIcon />
        </button>
      </td>
      <td>
        <Avatar
          avatarSize="3.8rem"
          css={{ alignItems: "stretch" }}
          avatar={member.avatar}
        >
          <div className="team-members__member-info">
            <p>{member.name}</p>
            <p>{member.email}</p>
          </div>
        </Avatar>
      </td>
      <td>
        <div className="team-members__project_manager">
          <Checkbox
            checked={member.id === manager?.id}
            showUnCheck={true}
            css={{ padding: 0 }}
            id={v4()}
            onCheckboxChanged={(event) =>
              onCheckBoxChanged(event.target.checked, member)
            }
          />
        </div>
      </td>
      <td>
        <div
          className="team-members__rate"
          style={{ display: haveBudget ? "initial" : "none" }}
        >
          <label>
            <AttachMoneyIcon />
          </label>
          <input
            type="number"
            value={rateInput}
            onChange={(event) => setRateInput(event.target.value)}
            onBlur={(event) => onBlurRateInputHandler(event.target.value)}
          />
        </div>
      </td>
    </tr>
  );
};

export default Member;
