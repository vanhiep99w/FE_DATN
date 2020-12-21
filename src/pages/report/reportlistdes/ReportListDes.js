import React, { useEffect, useState } from "react";
import "./ReportListDes.css";
import ReportItemDes from "./reportitemdes/ReportItemDes";

const ReportListDes = ({ user, descriptions }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(descriptions);
    const temp = [];
    descriptions.filter((datum) => {
      let i = temp.findIndex(
        (x) =>
          x.description === datum.description &&
          x.task.project.id === datum.task.project.id
      );
      if (i <= -1) {
        temp.push(datum);
      }
      return null;
    });
    console.log(temp);
    setData(temp);
  }, [descriptions]);

  return (
    <div className="report_list_des">
      <div className="report_list_des_header">
        <h2>Time Entry</h2>
        <h3>Categories - Projects</h3>
      </div>
      {data.reverse().map((datum) => (
        <ReportItemDes key={datum.id} user={user} data={datum} />
      ))}
    </div>
  );
};

export default ReportListDes;
