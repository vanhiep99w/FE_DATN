import "./SelectCalendar.css";
import React, { useState, useCallback } from "react";
import EventNoteIcon from "@material-ui/icons/EventNote";
import DropDown2 from "../dropdown2/DropDown2";
import Calendar from "../calendar/Calendar";
//import {connect} from 'react-redux';
//import {onSetEndTimeOff, onSetStartTimeOff} from '../../redux/actions/index';

const SelectCalendar = ({
  multipleSelect,
  value,
  onSelectDay,
  conditionDisable,
  onSetEndTimeOff,
  onSetStartTimeOff
}) => {
  const [showDD, setShowDD] = useState(false);
  const onSelectDayHandler = useCallback(
    (selectedDays) => {
      if (!multipleSelect) setShowDD(false);
      onSelectDay(selectedDays);
    },
    [multipleSelect, onSelectDay]
  );
  return (
    <div className="select_calendar" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setShowDD(!showDD)}>
        <EventNoteIcon />
      </button>
      <DropDown2
        isShow={showDD}
        onCloseHandler={() => setShowDD(false)}
        renderContent={() => (
          <Calendar
            onSelectDay={onSelectDayHandler}
            value={value}
            multipleSelect={multipleSelect}
            conditionDisable={conditionDisable}
          />
        )}
        css={{
          transform: "translateX(0%) translateY(102%)",
          padding: "0",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      />
    </div>
  );
};

// const mapDispatchToProps = (dispatch, props) => {
//   return {
//     onSetStartTimeOff: (daySelected) => {
//       dispatch(setStartTimeOff(daySelected))
//     },
//     onSetEndTimeOff: (daySelected) => {
//       dispatch(setEndTimeOff(daySelected))
//     }
//   }
// }

export default SelectCalendar;
