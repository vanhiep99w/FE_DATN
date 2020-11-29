import React, {useState, useEffect, useCallback} from 'react';
import PageDesign from '../../components/pageDesign/PageDesign';
import SelectCalendar from '../../components/selectCalendar/SelectCalendar';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import TimeBalance from './timeBalance/TimeBalance';
import {connect} from 'react-redux';
import { getWeek, selectDay } from "../../redux/actions";
import { equalDates } from "../../utils/Utils";

import './CreateRequestTimeOff.css';

const CreateRequestTimeOff = (({days, getWeek, selectDay}) => {

    const data = [new Date()];
    const onDaySelected = (selectedDays) => {
        if (selectedDays) {
          const index = days.findIndex((ele) => equalDates(ele, selectedDays[0]));
          if (index === -1) {
            console.log(1);
            getWeek(selectedDays[0]);
          } else {
            console.log(2);
            selectDay(index);
          }
        }
      };

    return (
        <div className="create_request_time_off">
            <PageDesign
                title="Request Time Off"
            >
                <div className="create_request_time_off__content">
                    <div className="content__form">
                        <form onSubmit={event=> {event.preventDefault()}}>
                            <div className="content__form__period">
                                <div className="content__form__period__left">
                                    <div className="content__form__period__start">
                                        <lable> Start on: </lable>
                                        <div className="input__content">
                                            <input placeholder="Pick a date..."/>
                                            <SelectCalendar />
                                        </div>
                                    </div>
                                    <div className="content__form__period__option">
                                        <input type="radio" name="radio" checked id="all" value="all" /> All day <br/>
                                        <input type="radio" name="radio" id="half" value="half" /> Half day
                                    </div>
                                </div>
                                <ArrowRightAltIcon />
                                <div className="content__form__period__end">
                                    <lable> End on: </lable>
                                    <div className="input__content">
                                        <input placeholder="Pick a date..."/>
                                        <SelectCalendar
                                            multipleSelect={false}
                                            onSelectDay={onDaySelected}
                                            conditionDisable = {false}
                                            value={new Date()}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="content__form__decription">
                                <lable>Description</lable><br/>
                                <textarea rows="9" cols="110" placeholder="Type something ..." />
                            </div>
                            <button>Send request</button>
                            <button>Cancel</button>
                        </form>

                    </div>
                    <TimeBalance />
                </div>
            </PageDesign>
        </div>
    )
})

const mapStateToProps = (state) => {
    const { days } = state.week;
    return {
      days,
    };
  };

export default connect(mapStateToProps, {
    getWeek,
    selectDay,
  })(CreateRequestTimeOff);