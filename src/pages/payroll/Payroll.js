import React, {useState, useEffect} from 'react';
import './Payroll.css';
import PageDesign from '../../components/pageDesign/PageDesign';
import Table from '../../components/table/Table';
import Avatar from '../../components/avatar/Avatar';
import male from '../../assets/images/male.png';

const PayRoll = (props) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    let result = [];
    const salary = props.history.location.state.salary;
    const tracked = props.history.location.state.time;
    props.history.location.state.user.forEach((ele, index) => {
      let temp = {
        name: ele.user.name,
        email:ele.user.email,
        avatar: ele.user.avatar,
        rate: ele.rate,
        tracked: tracked[index],
        salary: salary[index]
      }
      result.push(temp);
    });
    setData(result);
  },[])

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
          width: "40%",
          cssHeader: cssHeader,
          cssData: {
            textTransform: "capitalize",
            verticalAlign: "middle",
            cursor: "pointer",
            fontSize: "2rem",
            fontWeight: "500"
          },
          convertData: (data) => (
            <Avatar css={{alignItems: "center"}} avatar={data.avatar} avatarSize="4rem">
              <div className="payroll__user_info">
                <p> {data.name} </p>
                <p> {data.email} </p>
              </div>
               
            </Avatar>
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
          width: "20%",
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
                > {props.history.location.state.project.name} </p>
    }

    return(
        <PageDesign title="Payroll" headerRight={headerRight()}>
          <div className="payroll">
            <div className="payroll_left">
              {data ? <Table
                        columns={columns}
                        data={data}
                        skeletonLoading={data?.length ? false : true}
                      /> 
                    : null}
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
                  <p> {props.history.location.state.user.length} </p>
                  <p> {props.history.location.state.project.budget} </p>
                  <p>500(h)</p>
                </div>
            </div>
          </div>
        </PageDesign>
    )
}

export default PayRoll;