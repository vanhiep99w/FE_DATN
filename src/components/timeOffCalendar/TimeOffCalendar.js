import "./TimeOffCalendar.css";
import React from "react";
import { getDaysFromNow, getStringDayInWeek } from "../../utils/Utils";
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "../avatar/Avatar";

const TimeOffCalendar = ({ user }) => {
  console.log(getDaysFromNow(15));
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
          <tr>
            <th>
              <div className="time_off_calendar__user">
                <Avatar avatarSize="3rem">
                  <div className="time_off_calendar__user_info">
                    <div className="primary_info">
                      <p>vanhiep99w</p>
                      <p className="pending">Pending</p>
                    </div>
                    <p>Developer</p>
                  </div>
                </Avatar>
              </div>
            </th>
            {getDaysFromNow(15).map((day, index) => {
              return <td key={index} className="holiday"></td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TimeOffCalendar;
