import "./TeamMembers.css";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Member from "./member/Member";
import { action, change } from "../../../utils/UtilArr";
import { USER_ID } from "../../../utils/localStorageContact";
import SearchMembers from "../common/search-members/SearchMembers";

const TeamMembers = ({
  teamMembers,
  setTeamMembers,
  haveBudget,
  manager,
  setManager,
  members,
  changedTeamMembers,
  setChangedTeamMembers,
}) => {
  const onSelectItemHandler = (member) => {
    const [arrChanged, item] = change(
      action.create,
      member,
      changedTeamMembers
    );
    setChangedTeamMembers(arrChanged);
    setTeamMembers([...teamMembers, item]);
  };

  const onRemoveTeamMember = (member) => {
    setTeamMembers(teamMembers.filter((ele) => ele.id !== member.id));
    setChangedTeamMembers(change(action.delete, member, changedTeamMembers)[0]);
  };

  const onEditTeamMember = (member) => {
    const [arrChanged, item] = change(
      action.update,
      member,
      changedTeamMembers
    );
    setTeamMembers(
      teamMembers.map((ele) => {
        if (ele.id === member.id) return item;
        return ele;
      })
    );
    setChangedTeamMembers(arrChanged);
  };

  const onCheckBoxChanged = (checked, member) => {
    if (checked) {
      setManager(member);
    } else {
      setManager(null);
    }
  };

  const onChangeMultiplePeople = () => {
    if (teamMembers.length === members.length) {
      let temp = [...changedTeamMembers];
      teamMembers.forEach((element) => {
        temp = change(action.delete, element, temp)[0];
      });
      setChangedTeamMembers(temp);
      setTeamMembers([]);
    } else {
      let temp = [...changedTeamMembers];
      members.forEach((ele) => {
        if (!teamMembers.some((e) => e.id === ele.id)) {
          temp = change(action.create, ele, temp)[0];
        }
      });

      setChangedTeamMembers(temp);
      setTeamMembers([...members]);
    }
  };

  return (
    <div className="team-members">
      <table className="team-members__table">
        <thead>
          <tr>
            <th></th>
            <th>People</th>
            <th>Project Manager</th>
            <th style={{ visibility: haveBudget ? "initial" : "hidden" }}>
              Billable rate
            </th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <div className="team-members__footer__left">
                <SearchMembers
                  members={members}
                  onSelectItemHandler={onSelectItemHandler}
                  teamMembers={teamMembers}
                />
                <div>
                  <button onClick={onChangeMultiplePeople}>
                    {teamMembers.length === members.length
                      ? "Remove all people"
                      : "Add all people"}
                  </button>
                </div>
              </div>
            </td>
            <td colSpan="2">
              <div className="team-members__footer__right">
                <p>Need to add some one?</p>
                <p>
                  Go to <Link to="/manage">Manager</Link> to see more
                  information.
                </p>
              </div>
            </td>
          </tr>
        </tfoot>
        <tbody className="team-members__table-body">
          {teamMembers.map((ele) => {
            return (
              <Member
                key={ele.id}
                member={ele}
                haveBudget={haveBudget}
                manager={manager}
                onCheckBoxChanged={onCheckBoxChanged}
                onRemoveTeamMember={() => onRemoveTeamMember(ele)}
                onEditTeamMember={onEditTeamMember}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { members } = state.members;
  return {
    members: members
      .filter((ele) => ele.id !== +localStorage.getItem(USER_ID))
      .map((ele) => {
        return { ...ele.user, rate: "" };
      }),
  };
};

export default connect(mapStateToProps)(TeamMembers);
