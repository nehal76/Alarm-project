import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const SensorDataChart = () => {
  const [sensorData, setSensorData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [alarmData, setAlarmData] = useState([]);

  useEffect(() => {
    const generateDummyData = () => {
      const now = new Date(); // Current timestamp

      // Generate random temperature and humidity values
      const newTemp = Math.floor(Math.random() * (100 - 20 + 1)) + 20; // Random temp (20-100)
      const newHumidity = Math.floor(Math.random() * (100 - 30 + 1)) + 30; // Random humidity (30-100)

      // Add new data points
      const newTempPoint = { x: now.getTime(), y: newTemp };
      const newHumidityPoint = { x: now.getTime(), y: newHumidity };

      setSensorData((prevData) => [...prevData, newTempPoint]);
      setHumidityData((prevData) => [...prevData, newHumidityPoint]);

      // Check for temperature alarm condition
      if (newTemp > 70) {
        const newAlarmPoint = {
          x: now.getTime(),
          y: 0,
          color: "red",
          name: `Critical Temp Alarm: ${newTemp}°C`,
        };
        setAlarmData((prevData) => [...prevData, newAlarmPoint]);
      }
    };

    const interval = setInterval(generateDummyData, 5000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    chart: { type: "line", zoomType: "x" },
    title: { text: "Temperature and Humidity Monitoring" },
    xAxis: { type: "datetime", title: { text: "Time" } },
    yAxis: [
      {
        title: { text: "Temperature (°C)" },
        min: 0,
        max: 100,
        labels: {
          formatter: function () {
            return `${this.value}°C`;
          },
        },
      },
      {
        title: { text: "Humidity (%)" },
        min: 0,
        max: 100,
        opposite: true, // Display on the right side
        labels: {
          formatter: function () {
            return `${this.value}%`;
          },
        },
      },
    ],
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
            )}
            <br/>Value: ${this.y}${
              this.series.name === "Temperature" ? "°C" : "%"
            }`;
      },
    },
    series: [
      {
        name: "Temperature",
        data: sensorData,
        color: "blue",
        yAxis: 0, // Use the left Y-axis
      },
      {
        name: "Humidity",
        data: humidityData,
        color: "green",
        yAxis: 1, // Use the right Y-axis
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
            maxWidth: 1000,
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
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default SensorDataChart;
