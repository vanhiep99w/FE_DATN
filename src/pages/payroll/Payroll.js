import React, { useState, useEffect } from "react";
import "./Payroll.css";
import PageDesign from "../../components/pageDesign/PageDesign";
import Table from "../../components/table/Table";
import Avatar from "../../components/avatar/Avatar";
import timeCloudAPI from "../../apis/timeCloudAPI";
import { convertToHour } from "../../utils/Utils";
const PayRoll = (props) => {
  const [data, setData] = useState([]);
  const [project, setProject] = useState(null);
  const [totalTimeProject, setTotalTimeProject] = useState(0);
  // console.log(props);

  useEffect(() => {
    timeCloudAPI()
      .get(`projects/${props.match.params.id}/total-times`)
      .then((res) => {
        setTotalTimeProject(res.data);
      });
    timeCloudAPI()
      .get(`projects/${props.match.params.id}`)
      .then((res) => {
        setProject(res.data);
      });
    timeCloudAPI()
      .get(`projects/${props.match.params.id}/users`)
      .then((res) => {
        Promise.all(
          res.data.map((ele) => {
            return timeCloudAPI().get(
              `projects/${props.match.params.id}/users/${ele.user.id}/total-times`
            );
          })
        ).then((res1) => {
          setData(
            res1.map((item, index) => {
              return {
                user: res.data[index],
                time: item.data,
              };
            })
          );
        });
      });
  });

  console.log(data);
  const cssHeader = {
    textAlign: "left",
    fontWeight: "650",
    color: "black",
    marginBottom: "2rem",
  };
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
        fontWeight: "500",
      },
      convertData: (data) => (
        <Avatar
          css={{ alignItems: "center" }}
          avatar={data.user.user.avatar}
          avatarSize="4rem"
        >
          <div className="payroll__user_info">
            <p> {data.user.user.name} </p>
            <p> {data.user.user.email} </p>
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
        fontWeight: "500",
      },
      convertData: (data) => data.user.rate,
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
        fontWeight: "500",
      },
      convertData: (data) => {
        if (project.done) return convertToHour(data.time);
        else return "?";
      },
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
        fontWeight: "500",
      },
      convertData: (data) => {
        if (project.done) return data.user.salary;
        else return "?";
      },
    },
  };

  const headerRight = () => {
    return (
      <p
        style={{
          fontSize: "3rem",
          fontWeight: "500",
          color: "#0066CC",
        }}
      >
        {" "}
        {project?.name}{" "}
      </p>
    );
  };

  return (
    <PageDesign title="Payroll" headerRight={headerRight()}>
      <div className="payroll">
        <div className="payroll_left">
          {data ? (
            <Table
              columns={columns}
              data={data}
              skeletonLoading={data ? false : true}
            />
          ) : null}
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
            <p> {data?.length} </p>
            <p> {project?.budget} </p>
            <p> {convertToHour(totalTimeProject)} </p>
          </div>
        </div>
      </div>
    </PageDesign>
  );
};

export default PayRoll;
