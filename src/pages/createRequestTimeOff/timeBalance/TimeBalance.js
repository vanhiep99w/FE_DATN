import React, {userState, userEffect} from 'react';
import './TimeBalance.css';

const TimeBalance = (() => {
    return (
        <div className="content__info">
            <h1>My time balance</h1>
            <div className="content__info__row">
                <p>Before request</p>
                <p>6</p>
            </div>
            <div className="content__info__row">
                <p>This request</p>
                <p>0</p>
            </div>
            <div className="content__info__row">
                <p>After request</p>
                <p>6</p>
            </div>
            <span> Approvers: </span>
            <span>John, Christophe</span>
        </div>
    )
})

export default TimeBalance;