import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const SensorDataChart = () => {
  const [sensorData1, setSensorData1] = useState([]);
  const [sensorData2, setSensorData2] = useState([]);
  const [alarmData, setAlarmData] = useState([]);
  const [chartDimensions, setChartDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 50, // Adjust for header/footer
  });

  const fullScreenHandle = useFullScreenHandle();

  useEffect(() => {
    const handleResize = () => {
      setChartDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 50, // Adjust for header/footer
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const generateDummyData = () => {
      const now = new Date();

      const newTemp1 = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
      const newTemp2 = Math.floor(Math.random() * (80 - 10 + 1)) + 20;

      const newPoint1 = { x: now.getTime(), y: newTemp1 };
      const newPoint2 = { x: now.getTime(), y: newTemp2 };

      setSensorData1((prevData) => [...prevData, newPoint1]);
      setSensorData2((prevData) => [...prevData, newPoint2]);

      if (newTemp1 > 70) {
        const newAlarmPoint = {
          x: now.getTime(),
          y: 0,
          color: "red",
          name: `Critical Temp Alarm: ${newTemp1}°C`,
        };
        setAlarmData((prevData) => [...prevData, newAlarmPoint]);
      }
    };

    const interval = setInterval(generateDummyData, 1000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    chart: {
      type: "line",
      zoomType: "x",
      width: chartDimensions.width,
      height: chartDimensions.height,
    },
    title: { text: "Multiple Temperature Charts" },
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
            )}<br/>Value: ${this.y}°C`;
      },
    },
    series: [
      {
        name: "Temperature Sensor 1",
        data: sensorData1,
        color: "green",
      },
      {
        name: "Temperature Sensor 2",
        data: sensorData2,
        color: "orange",
      },
      {
        name: "Alarms",
        type: "scatter",
        data: alarmData,
        marker: { symbol: "circle", radius: 5 },
      },
    ],
    credits: { enabled: false },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
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
    <div>
      <button
        onClick={fullScreenHandle.enter}
        style={{
          padding: "5px 10px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Fullscreen
      </button>

      <FullScreen handle={fullScreenHandle}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </FullScreen>
    </div>
  );
};

export default SensorDataChart;
