import "./DaySelect.css";

import React, { useState, useEffect } from "react";
import SelectCalendar from "../../selectCalendar/SelectCalendar";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { months, equalDates } from "../../../utils/Utils";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import DropDown2 from "../../dropdown2/DropDown2";
import { v4 } from "uuid";

const DaySelect = ({
  onChangeSelectDays,
  firstDay = new Date(),
  lastDay = new Date(),
  projects,
  setCurrentMembers,
  members,
}) => {
  const [listProjects, setListProjects] = useState(false);
  const [projectSelected, setProjectSelected] = useState("");
  const [showDDProject, setShowDDProject] = useState(false);

  useEffect(() => {
    const projectDefault = { id: v4(), name: "All project", default: true };
    setListProjects([projectDefault, ...projects]);
    setProjectSelected(projectDefault);
  }, [projects]);

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

  const onSelectProject = (project) => {
    setProjectSelected(project);
    if (project.default) {
      setCurrentMembers(members);
    } else {
      setCurrentMembers(
        members.filter((ele) =>
          project.members.some((e) => e.user.id === ele.id)
        )
      );
    }
    setShowDDProject(false);
  };

  const renderContentDD = () => {
    return (
      <div className="day-select__dd">
        {listProjects
          .filter((ele) => ele.id !== projectSelected.id)
          .map((ele) => {
            return (
              <p onClick={() => onSelectProject(ele)} key={ele.id}>
                {ele.name}
              </p>
            );
          })}
      </div>
    );
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
        <span>Project:</span>
        <div className="day_select__right__dd">
          <span onClick={() => setShowDDProject(!showDDProject)}>
            {projectSelected.name} <ArrowDropDownIcon />{" "}
          </span>
          <DropDown2
            isShow={showDDProject}
            onCloseHandler={() => setShowDDProject(false)}
            renderContent={renderContentDD}
            css={{ transform: "translateY(102%) translateX(-5%)" }}
          />
        </div>
      </div>
    </div>
  );
};

export default DaySelect;
