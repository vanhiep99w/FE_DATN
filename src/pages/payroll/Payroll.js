import React from 'react';
import './Payroll.css';
import PageDesign from '../../components/pageDesign/PageDesign';

const PayRoll = () => {

    const headerRight = () => {
        return <p 
                    style={{
                        fontSize: "3rem",
                        fontWeight: "500",
                        color: "#0066CC",
                    }}
                > Facebook </p>
    }

    return(
        <PageDesign title="Payroll" headerRight={headerRight()}>

        </PageDesign>
    )
}

export default PayRoll;