import React from "react";
import Highcharts from "highcharts";
import "../CSS/LineChart.css"; // Ensure your CSS file path is correct

const LineChartTable = ({ sensorData, alarmData }) => {
  return (
    <div className="table-container">
      <table className="tablecontent">
        <thead>
          <tr>
            <th>Time</th>
            <th>Sensor Value (°C)</th>
            <th>Alarm</th>
          </tr>
        </thead>
        <tbody>
          {[...sensorData, ...alarmData].map((dataPoint, index) => (
            <tr key={index}>
              <td>
                {Highcharts.dateFormat("%Y-%m-%d, %H:%M:%S", dataPoint.x)}
              </td>
              <td>{dataPoint.y}</td>
              <td>
                {dataPoint.y > 70 ? "Alarm Triggered" : "Alarm Not Triggered"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LineChartTable;
