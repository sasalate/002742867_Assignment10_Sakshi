import React, { useState, useEffect } from "react";
import WeatherData from "./WeatherData";
import "./index.css";
import TextField from "@material-ui/core/TextField";
var moment = require("moment");

function WeatherContainer() {
  const [completeData, setCompleteData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [cityName, setCityName] = useState("");
  const [hasError, setHasError] = useState(false);

  let display;
  if (completeData.length > 0 || hasError == false) {
    display = displayData();
  }
  function changeText(event) {
    setCityName(event.target.value);
  }

  function displayData() {
    return dailyData.map((reading, index) => (
      <WeatherData
        reading={reading}
        key={index}
        completeData={completeData}
        cityName={cityName}
      />
    ));
  }
  function refreshData() {
    const _url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&APPID=9981d1499d00835c5b72b58f4fcbfb75`;
    fetch(_url)
      .then((res) => res.json())
      .then((data) => {
        const _data = data.list.filter((reading) =>
          reading.dt_txt.includes("00:00:00")
        );
        data.list.map(function (name) {
          let _date = new Date();
          const weekday = name.dt * 1000;
          _date.setTime(weekday);
          name.day = moment(_date).format("dddd");
        });

        setCompleteData(data.list);
        setHasError(false);
        setDailyData(_data);
        localStorage.setItem("data", JSON.stringify(_data));
        setDailyData(JSON.parse(localStorage.getItem("data")) || []);
      })
      .catch((err) => {
        setCompleteData([]);
        setHasError(true);
        setDailyData([]);
      });
  }
  return (
    <div className="container-fluid">
      <br></br>
      <h2 > Weather App </h2>
      <div className="inputCard">
        <TextField
          id="outlined-name"
          label="Enter City"
          value={cityName}
          onChange={changeText}
        />
        <br></br>
        <input
          type="button"
          className="submit_button"
          value="Submit"
          onClick={refreshData}
        />
      </div>
      <br />

      <div>{display}</div>
    </div>
  );
}

export default WeatherContainer;
