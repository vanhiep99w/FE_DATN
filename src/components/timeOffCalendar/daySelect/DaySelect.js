import "./DaySelect.css";

import React from "react";
import SelectCalendar from "../../selectCalendar/SelectCalendar";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { months, equalDates } from "../../../utils/Utils";

const DaySelect = ({
  onChangeSelectDays,
  firstDay = new Date(),
  lastDay = new Date(),
}) => {
  const onButtonPreClick = () => {
    const temp = new Date(firstDay);
    temp.setDate(temp.getDate() - 15);
    onChangeSelectDays(temp);
  };
  const onButtonNextClick = () => {
    const temp = new Date(lastDay);
    temp.setDate(temp.getDate() + 1);
    onChangeSelectDays(temp);
  };
  const onSelectDayHandler = (dates) => {
    const temp = new Date(dates[0]);
    temp.setDate(temp.getDate());
    onChangeSelectDays(temp);
  };

  const onSelectNow = () => {
    if (!equalDates(firstDay, new Date())) {
      const temp = new Date();
      temp.setDate(temp.getDate());
      onChangeSelectDays(temp);
    }
  };

  const getDayInfo = (day) => {
    return `${months[day.getMonth()]} ${day.getDate()}`;
  };
  return (
    <div className="day_select">
      <div className="day_select__left">
        <div className="day_select__multiple">
          <button onClick={onButtonPreClick}>
            <NavigateBeforeIcon />
          </button>
          <span>{`${getDayInfo(firstDay)} - ${getDayInfo(lastDay)}`}</span>
          <button onClick={onButtonNextClick}>
            <NavigateNextIcon />
          </button>
        </div>
        <div className="day_select__single">
          <button onClick={onSelectNow}>Today</button>
          <SelectCalendar
            multipleSelect={false}
            value={[firstDay]}
            onSelectDay={onSelectDayHandler}
          />
        </div>
      </div>
      <div className="day_select__right">
        <div>All projects</div>
      </div>
    </div>
  );
};

export default DaySelect;
