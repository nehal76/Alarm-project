import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import "../App.css";

const SensorDataChart = () => {
  const [sensorData, setSensorData] = useState([]);
  const [alarmData, setAlarmData] = useState([]);
  const [chartDimensions, setChartDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 50, // Adjust height as needed (e.g., minus header height)
  });
  const [chartType, setChartType] = useState("line"); // Default is line chart
  const [showTable, setShowTable] = useState(false); // State to toggle table visibility

  const fullScreenHandle = useFullScreenHandle();

  useEffect(() => {
    const handleResize = () => {
      setChartDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 50, // Adjust this value based on your design
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const generateDummyData = () => {
      const now = new Date(); // Current timestamp
      const newValue = Math.floor(Math.random() * (100 - 20 + 1)) + 20; // Random value between 20 and 100

      const newSensorPoint = { x: now.getTime(), y: newValue };
      setSensorData((prevData) => [...prevData, newSensorPoint]);

      if (newValue > 70) {
        const newAlarmPoint = {
          x: now.getTime(),
          y: 0,
          color: "red",
          name: `Alarm Triggered: Value ${newValue}°C`,
        };
        setAlarmData((prevData) => [...prevData, newAlarmPoint]);
      }
    };

    const interval = setInterval(generateDummyData, 10000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    chart: {
      type: chartType, // Dynamically set chart type (line or area)
      zoomType: "x",
      width: chartDimensions.width, // Dynamically set width
      height: chartDimensions.height, // Dynamically set height
    },
    title: { text: "Temperature Monitoring Chart" },
    xAxis: { type: "datetime", title: { text: "Time" } },
    yAxis: {
      title: { text: "Temperature (°C)" },
      min: 0,
      max: 100,
      labels: {
        formatter: function () {
          return `${this.value}°C`;
        },
      },
    },
    tooltip: {
      formatter: function () {
        return this.series.name === "Alarms"
          ? `<b>${this.point.name}</b><br/>Time: ${Highcharts.dateFormat(
              "%Y-%m-%d %H:%M:%S",
              this.x
            )}`
          : `Time: ${Highcharts.dateFormat(
              "%Y-%m-%d %H:%M:%S",
              this.x
            )}<br/>Temperature: ${this.y}°C`;
      },
    },
    series: [
      {
        name: "Sensor Data",
        data: sensorData,
        color: "blue",
        fillOpacity: chartType === "area" ? 0.3 : 0, // Set fill opacity only for area chart
      },
      {
        name: "Alarms",
        type: "scatter",
        data: alarmData,
        marker: { symbol: "circle", radius: 5 },
      },
    ],
    credits: {
      enabled: false, // Removes Highcharts.com watermark
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 600,
          },
          chartOptions: {
            legend: {
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        {/* Dropdown Menu */}
        {/* <div
        className="dropdown"
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          zIndex: 1000,
        }}
      >
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          customize
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li>
            <a className="dropdown-item" href="#">
              Action
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Another action
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Something else here
            </a>
          </li>
        </ul>
      </div> */}

        {/* Chart Controls */}
        <div></div>

        <div className="container">
          <button
            className="switchbutton"
            onClick={() => setChartType(chartType === "line" ? "area" : "line")}
          >
            Switch to {chartType === "line" ? "Area" : "Line"} Chart
          </button>

          <button className="fullscreenbutton" onClick={fullScreenHandle.enter}>
            Fullscreen
          </button>

          {/* Button to toggle between chart and table */}
          <button
            className="showtablebutton"
            onClick={() => setShowTable(!showTable)}
            style={{}}
          >
            {showTable ? "Show Chart" : "Show Table"}
          </button>
        </div>

                                   {/* Conditionally render chart or table */}

        {showTable ? (
          <table className="tablecontent" >
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
                  <td>{dataPoint.y>70 ? "Alarm triggerd" : "Alrm not triggered"}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <FullScreen handle={fullScreenHandle}>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </FullScreen>
        )}
      </div>
    </>
  );
};

export default SensorDataChart;
