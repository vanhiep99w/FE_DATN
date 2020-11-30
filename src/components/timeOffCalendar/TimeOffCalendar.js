import "./TimeOffCalendar.css";
import React, { useState, useEffect } from "react";
import { getDaysFromNow, getStringDayInWeek } from "../../utils/Utils";
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "../avatar/Avatar";
import { connect } from "react-redux";

const TimeOffCalendar = ({ members }) => {
  const [currentMembers, setCurrentMembers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());

  useEffect(() => {
    setCurrentMembers([...members]);
  }, [members]);
  const randomStatus = (day) => {
    if (day.getDay() === 6 || day.getDay() === 0) {
      return "last_of_week";
    }
    const random = Math.random();
    if (random < 0.07) return "pending";
    if (random < 0.14) return "approve";
    if (random < 0.21) return "reject";
    // if (random < 0.27) return "holiday";
    return "";
  };
  return (
    <div className="time_off_calendar">
      <table>
        <thead className="time_off_calendar__header">
          <tr>
            <th scope="row">
              <div className="time_off_calendar__search">
                <SearchIcon />
                <input placeholder="Search people..." />
              </div>
            </th>
            {getDaysFromNow(15).map((day, index) => {
              return (
                <th key={index}>
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
                          <p className="pending">Pending</p>
                        </div>
                        <p>Developer</p>
                      </div>
                    </Avatar>
                  </div>
                </th>
                {getDaysFromNow(15).map((day, index) => {
                  return (
                    <td key={index} className={`${randomStatus(day)}`}></td>
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
