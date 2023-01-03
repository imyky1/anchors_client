import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { linkedinContext } from "../../Context/LinkedinState";
import ServiceContext from "../../Context/services/serviceContext";
import { creatorContext } from "../../Context/CreatorState";
import Moment from "moment";
import { TextField } from "@mui/material";

import Apexcharts from "./apexcharts";
import { useMemo } from "react";
import { SuperSEO } from "react-super-seo";

function Dashboard() {
  const { loginInfo, getStatus } = useContext(linkedinContext);
  const [firstService, setFirstService] = useState(false);
  const [userloading, setuserloading] = useState(true);
  const [userorderdates, setuserorderdates] = useState({
    date: [],
    value: [],
  });
  const [uniqsss, setuniqsss] = useState([]);
  const {
    checkFirstService,
    getallsubscriber,
    totalsubscount,
    getallsubs,
    getuserorder,
    alluserorder,
  } = useContext(ServiceContext);
  const { getAllCreatorInfo, basicNav } = useContext(creatorContext);
  const navigate = useNavigate();
  const [dateRangefrom, setDateRangefrom] = useState("2022-11-20");
  const [dateRangeto, setDateRangeto] = useState("2022-11-30");
  const [subscumul, setsubscumul] = useState({
    date: [],
    value: [],
  });
  const handleinputfromdate = (e) => {
    setDateRangefrom(e.target.value);
  };
  const handleinputtodate = (e) => {
    setDateRangeto(e.target.value);
  };
  useEffect(() => {
    getAllCreatorInfo();
    checkFirstService().then((e) => {
      if (!e) {
        setFirstService(false);
      } else if (e) {
        setFirstService(true);
      }
    });
    getStatus(localStorage.getItem("jwtToken")).then((data) => {
      if (data === 0) {
        navigate("/waitlist");
      }
    });
  }, []);

  // api

  const [mixpaneldata, setMixpanelData] = useState({
    date: [],
    value: [],
  });

  const handler = async () => {
    var date = [];
    var value = [];
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: "Basic MDg3MmMzNTAyODBiMTdiNzk0YjVjOWM5NTRjZTAwZjc6",
      },
    };
    let res = await fetch(
      `https://mixpanel.com/api/2.0/segmentation?project_id=2804309&event=Page%20Visit&from_date=${
        dateRangefrom ? dateRangefrom : "2022-11-20"
      }&to_date=${
        dateRangeto ? dateRangeto : "2022-11-30"
      }&where=properties%5B%22%24current_url%22%5D%20in%20%5B%22https%3A%2F%2Fwww.anchors.in%2Fc%2F${
        basicNav.slug
      }%22%5D&type=unique&format=csv`,
      options
    );
    const helper = await res.text();
    const lines = helper.split(/\r?\n/);
    var csvData = [];
    for (let i = 1; i < lines.length - 1; i++) {
      csvData[i - 1] = lines[i].split(",");
    }
    for (let i = 0; i < csvData.length; i++) {
      date.push(Moment(csvData[i][0]).format("DD/MM"));
      value.push(csvData[i][1]);
    }

    setMixpanelData({
      date: date,
      value: value,
    });
  };
  const wow = () => {
    getuserorder({
      date: dateRangefrom?.slice(8, 10) ? dateRangefrom?.slice(8, 10) : 20,
      month: dateRangefrom?.slice(5, 7) ? dateRangefrom?.slice(5, 7) : 11,
      year: dateRangefrom?.slice(0, 4) ? dateRangefrom?.slice(0, 4) : 2022,
      enddate: dateRangeto?.slice(8, 10) ? dateRangeto?.slice(8, 10) : 31,
      endmonth: dateRangeto?.slice(5, 7) ? dateRangeto?.slice(5, 7) : 11,
      endyear: dateRangeto?.slice(0, 4) ? dateRangeto?.slice(0, 4) : 2022,
    });
  };
  useEffect(() => {
    wow();
    handler();
    getallsubs({
      date: dateRangefrom?.slice(8, 10) ? dateRangefrom?.slice(8, 10) : 20,
      month: dateRangefrom?.slice(5, 7) ? dateRangefrom?.slice(5, 7) : 11,
      year: dateRangefrom?.slice(0, 4) ? dateRangefrom?.slice(0, 4) : 2022,
      enddate: dateRangeto?.slice(8, 10) ? dateRangeto?.slice(8, 10) : 31,
      endmonth: dateRangeto?.slice(5, 7) ? dateRangeto?.slice(5, 7) : 11,
      endyear: dateRangeto?.slice(0, 4) ? dateRangeto?.slice(0, 4) : 2022,
    });
  }, [dateRangefrom, dateRangeto, basicNav]);

  var temparr = [];
  useEffect(() => {
    if (alluserorder.length) {
      alluserorder.map((e) => {
        return temparr.push(Moment(e).format("DD/MM"));
      });
      var uniqs = temparr.reduce((acc, val) => {
        acc[val] = acc[val] === undefined ? 1 : (acc[val] += 1);
        return acc;
      }, {});
      var cumsum = [];
      var datesum = [];
      Object.values(uniqs).map((e) => cumsum.push(e));
      Object.keys(uniqs).map((e) => datesum.push(e));

      setuserorderdates({
        date: datesum,
        value: cumsum,
      });
    } else {
    }
  }, [alluserorder]);
  var datefound = [];
  useEffect(() => {
    for (let index = getallsubscriber?.length - 1; index >= 0; index--) {
      let e = getallsubscriber[index];
      datefound.push(Moment(e?.subscribedOn).format("DD/MM"));
    }
    var uniqs = datefound.reduce((acc, val) => {
      acc[val] = acc[val] === undefined ? 1 : (acc[val] += 1);
      return acc;
    }, {});

    var cumsum = [];
    var datesum = [];
    Object.values(uniqs).map((e) => cumsum.push(e));
    Object.keys(uniqs).map((e) => datesum.push(e));

    //console.log(Object.keys(object2).length);

    const cumulativeSum = (
      (sum) => (value) =>
        (sum += value)
    )(totalsubscount.totalItems - totalsubscount.free);
    cumsum = cumsum.map(cumulativeSum);
    setsubscumul({
      date: datesum,
      value: cumsum,
    });
  }, [getallsubscriber, dateRangefrom, dateRangeto]);

  return (
    <>
      <div className="dashboard">
        <div className="user_section">
          <h1 className="dashboard_header1">
            Welcome{" "}
            {localStorage.getItem("isDev") === "true"
              ? "Builders"
              : loginInfo?.name
              ? loginInfo?.name
              : basicNav?.name}
            ,
          </h1>
          <span>
            {firstService ? (
              <>
                Its high time to take first step to serve your follower ,<br />
                Start with first service
              </>
            ) : (
              <>
                Its high time to take your step to serve your follower ,<br />
                Start by creating a new service
              </>
            )}
          </span>
          <Link to="/createservice">
            <div className="add_event">
              <i className="fa-solid fa-circle-plus fa-2x"></i>
              <h2>
                {firstService ? <>Create First Service</> : <>Create Service</>}
              </h2>
            </div>
          </Link>
        </div>
      </div>
      <div className="daterangeselect">
        <h1 className="dashboard_header1">Resource Analytics</h1>

        <div className="rangeselect_wrapper">
          <TextField
            label="from Date"
            variant="outlined"
            onChange={handleinputfromdate}
            value={dateRangefrom}
            placeholder="from Date"
            onFocus={(e) => {
              e.target.type = "date";
            }}
          />
          <TextField
            label="to Date"
            variant="outlined"
            onChange={handleinputtodate}
            value={dateRangeto}
            placeholder="to Date"
            onFocus={(e) => {
              e.target.type = "date";
            }}
          />
        </div>
      </div>
      <div className="linegraph_wrapper">
        <div className="chart_one">
          <Apexcharts
            titletext="Your Profile Views"
            xdata={mixpaneldata.date}
            ydata={mixpaneldata.value}
            cursortext="Unique Visits"
          />
        </div>

        <div className="chart_two">
          <Apexcharts
            titletext="Subscriber Count"
            xdata={subscumul.date}
            ydata={subscumul.value}
            cursortext="Subscribers Count"
          />
        </div>
      </div>
      <div className="chart_three">
        <Apexcharts
          titletext="Overall Services Downloads"
          xdata={userorderdates.date}
          ydata={userorderdates.value}
          cursortext="Downloads"
          property
        />
      </div>
      <SuperSEO title="Anchors - Dashboard" />
    </>
  );
}

export default Dashboard;
