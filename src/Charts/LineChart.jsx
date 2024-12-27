import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import LineChartTable from "../Tables/LineChartTable"; // Correct path to your table component
import "../App.css";

const SensorDataChart = () => {
  const [sensorData, setSensorData] = useState([]);
  const [alarmData, setAlarmData] = useState([]);
  const [chartDimensions, setChartDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 50,
  });
  const [chartType, setChartType] = useState("line");
  const [showTable, setShowTable] = useState(false);

  const fullScreenHandle = useFullScreenHandle();

  useEffect(() => {
    const handleResize = () => {
      setChartDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 50,
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
          y: newValue, // Set the actual temperature value
          color: "red",
          name: `Alarm Triggered: ${newValue}°C`,
        };
        setAlarmData((prevData) => [...prevData, newAlarmPoint]);
      }
    };

    const interval = setInterval(generateDummyData, 6000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    chart: {
      type: chartType,
      zoomType: "x",
      width: chartDimensions.width,
      height: chartDimensions.height,
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
        if (this.series.name === "Alarms") {
          return `<b>${this.point.name}</b><br/>Time: ${Highcharts.dateFormat(
            "%Y-%m-%d %H:%M:%S",
            this.x
          )}<br/>Temperature: ${this.y}°C`;
        }
        return `Time: ${Highcharts.dateFormat(
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
        fillOpacity: chartType === "area" ? 0.3 : 0,
      },
      {
        name: "Alarms",
        type: "scatter",
        data: alarmData,
        color: "red",
        marker: { symbol: "circle", radius: 6 },
      },
    ],
    credits: {
      enabled: false,
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
          <button
            className="showtablebutton"
            onClick={() => setShowTable(!showTable)}
          >
            {showTable ? "Show Chart" : "Show Table"}
          </button>
        </div>
        {showTable ? (
          <LineChartTable sensorData={sensorData} alarmData={alarmData} />
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
