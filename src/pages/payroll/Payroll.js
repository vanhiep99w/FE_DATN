import React from 'react';
import './Payroll.css';
import PageDesign from '../../components/pageDesign/PageDesign';
import Table from '../../components/table/Table';
import Avatar from '../../components/avatar/Avatar';
import male from '../../assets/images/male.png';

const PayRoll = () => {

  const data = [
    {
      name: "Son",
      rate: 1,
      salary: 10000000,
      tracked: 30
    },
    {
      name: "Hiep",
      rate: 1,
      salary: 10000000,
      tracked: 35
    },
    {
      name: "Quan",
      rate: 1,
      salary: 10000000,
      tracked: 33
    },
    {
      name: "Hong",
      rate: 1.2,
      salary: 15000000,
      tracked: 40
    }
  ]

  const cssHeader = {
    textAlign: "left",
    fontWeight: "650",
    color: "black",
    marginBottom: "2rem",
  }
    const columns = {
        members: {
          key: "members",
          label: "members",
          width: "30%",
          cssHeader: cssHeader,
          cssData: {
            textTransform: "capitalize",
            verticalAlign: "middle",
            cursor: "pointer",
            fontSize: "2rem",
            fontWeight: "500"
          },
          convertData: (data) => (
            <Avatar css={{alignItems: "center"}} avatar={male} avatarSize="4rem"> {data.name} </Avatar>
          ),
        },
        rate: {
          key: "rate",
          label: "rate",
          width: "20%",
          cssHeader: cssHeader,
          cssData: {
            verticalAlign: "middle",
            cursor: "pointer",
            fontSize: "2rem",
            fontWeight: "500"
          },
          convertData: (data) => data.rate,
        },
        tracked: {
          key: "tracked",
          label: "Tracked(h)",
          width: "30%",
          cssHeader: cssHeader,
          cssData: {
            verticalAlign: "middle",
            cursor: "pointer",
            fontSize: "2rem",
            fontWeight: "500"
          },
          convertData: (data) => data.tracked,
        },
        salary: {
          key: "salary",
          label: "salary",
          width: "20%",
          cssHeader: cssHeader,
          cssData: {
            verticalAlign: "middle",
            cursor: "pointer",
            fontSize: "2rem",
            fontWeight: "500"
          },
          convertData: (data) => data.salary,
        },
      };

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
          <div className="payroll">
            <div className="payroll_left">
              <Table
                columns={columns}
                data={data}
                skeletonLoading={data.length ? false : true}
              />
            </div>
            <div className="payroll_right">
                <div className="payroll_right__lable">
                  <p>Created by:</p>
                  <p>Members: </p>
                  <p>Budget:</p>
                  <p>Tracked: </p>
                </div>
                <div className="payroll_right__value">
                  <p>Van hiep</p>
                  <p>5</p>
                  <p>1000000000</p>
                  <p>500(h)</p>
                </div>
            </div>
          </div>
        </PageDesign>
    )
}

export default PayRoll;