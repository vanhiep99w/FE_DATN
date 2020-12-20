import "./TimeOffCalendar.css";
import React, { useState, useEffect } from "react";
import {
  equalDates,
  getDaysFromSelectedDay,
  getStringDayInWeek,
} from "../../utils/Utils";
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "../avatar/Avatar";
import { connect } from "react-redux";
import DaySelect from "./daySelect/DaySelect";
import timeCloudAPI from "../../apis/timeCloudAPI";
import { USER_ID } from "../../utils/localStorageContact";

const TimeOffCalendar = ({ members, _pendingRequest, _approveRequest }) => {
  const [currentMembers, setCurrentMembers] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [pendingRequest, setPendingRequest] = useState([]);
  const [approveRequest, setApproveRequest] = useState([]);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const now = new Date();
    setSelectedDays(getDaysFromSelectedDay(15, now));
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res1 = await timeCloudAPI().get(
      `users/${localStorage.getItem(USER_ID)}/project-user-available`
    );
    const temp = res1.data;
    const res2 = await Promise.all(
      temp.map((ele) => {
        return timeCloudAPI().get(`projects/${ele.project.id}/users`);
      })
    );
    setProjects(
      temp.map((ele, index) => {
        return { ...ele.project, members: res2[index].data };
      })
    );
  };

  useEffect(() => {
    setPendingRequest(_pendingRequest);
  }, [_pendingRequest]);
  useEffect(() => {
    setApproveRequest(_approveRequest);
  }, [_approveRequest]);

  const onChangeSelectDays = (selectedDay) => {
    setSelectedDays(getDaysFromSelectedDay(15, selectedDay));
  };

  useEffect(() => {
    setCurrentMembers([...members]);
  }, [members]);

  const checkDateBetween = (date, startDate, endDate) => {
    const temp1 = new Date(date);
    const temp2 = new Date(startDate);
    const temp3 = new Date(endDate);
    temp1.setHours(1);
    if (temp3.getHours() === 0) {
      temp3.setHours(23);
    }

    if (temp1 - temp2 >= 0 && temp3 - temp1 >= 0) {
      return true;
    }
    return false;
  };

  const checkHavePendingRequest = (member) => {
    return pendingRequest.some((ele) => ele.timeOff.user.id === member.id);
  };

  const checkDayOffMember = (day, member) => {
    if (day.getDay() === 6 || day.getDay() === 0) {
      return "last_of_week";
    }
    const temp1 = pendingRequest.filter(
      (ele) => ele.timeOff.user.id === member.id
    );
    if (temp1.length) {
      if (
        temp1.some((ele) =>
          checkDateBetween(day, ele.timeOff.startTime, ele.timeOff.endTime)
        )
      ) {
        return "pending";
      }
    }
    const temp2 = approveRequest.filter(
      (ele) => ele.timeOff.user.id === member.id
    );
    if (temp2.length) {
      if (
        temp2.some((ele) =>
          checkDateBetween(day, ele.timeOff.startTime, ele.timeOff.endTime)
        )
      ) {
        return "approve";
      }
    }
  };

  useEffect(() => {
    const temp = members.filter((member) =>
      member.user.name
        .toLocaleLowerCase()
        .includes(searchInputValue.toLocaleLowerCase())
    );
    setCurrentMembers(temp);
  }, [members, searchInputValue]);
  return (
    <div className="time_off_calendar">
      <DaySelect
        onChangeSelectDays={onChangeSelectDays}
        firstDay={selectedDays[0]}
        lastDay={selectedDays[selectedDays.length - 1]}
        projects={projects}
        setCurrentMembers={setCurrentMembers}
        members={members}
      />
      <table>
        <thead className="time_off_calendar__header">
          <tr>
            <th scope="row">
              <div className="time_off_calendar__search">
                <SearchIcon />
                <input
                  placeholder="Search people..."
                  maxLength="20"
                  value={searchInputValue}
                  onChange={(event) => setSearchInputValue(event.target.value)}
                />
              </div>
            </th>
            {selectedDays.map((day, index) => {
              return (
                <th
                  key={index}
                  className={equalDates(day, new Date()) ? "now" : ""}
                >
                  <p>{getStringDayInWeek(day)}</p>
                  <p>{day.getDate()}</p>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {currentMembers.map((member) => {
            const memberInfo = member.user;
            return (
              <tr key={member.id}>
                <th>
                  <div className="time_off_calendar__user">
                    <Avatar avatarSize="3rem" avatar={memberInfo.avatar}>
                      <div className="time_off_calendar__user_info">
                        <div className="primary_info">
                          <p>{memberInfo.name}</p>
                          {checkHavePendingRequest(member) ? (
                            <span className="status_rejected">Pending</span>
                          ) : null}
                        </div>
                        <p>Developer</p>
                      </div>
                    </Avatar>
                  </div>
                </th>
                {selectedDays.map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`${checkDayOffMember(day, member)}`}
                    ></td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="time_off_calendar__footer">
        <div className="approve"></div>
        <p>TimeOff</p>
        <div className="pending"></div>
        <p>Pending</p>
        <div className="last_of_week"></div>
        <p>Last Week</p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { members } = state.members;
  return {
    members,
  };
};
export default connect(mapStateToProps)(TimeOffCalendar);
