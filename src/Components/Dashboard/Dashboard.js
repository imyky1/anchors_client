import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";
import { linkedinContext } from "../../Context/LinkedinState";
import ServiceContext from "../../Context/services/serviceContext";
import { creatorContext } from "../../Context/CreatorState";
import Moment from "moment";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Apexcharts from "./apexcharts";
import { useMemo } from "react";
import { SuperSEO } from "react-super-seo";
import { host } from "../../config/config";
import { toast } from "react-toastify";

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
  const { allCreatorInfo, getAllCreatorInfo, basicNav } =
    useContext(creatorContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState();
  const copyinvitecode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.info("Copied to clipboard", {
      position: "top-left",
      autoClose: 3000,
    });
  };
  const generateInviteCode = async () => {
    try {
      const response = await fetch(`${host}/analytics/generateCode`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
      });
      const json = await response.json();
      if (json.success) {
        setInviteCode(json.code);
      } else {
        //alert(json.error)
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (basicNav?.inviteCode) {
      setInviteCode(basicNav?.inviteCode);
    } else {
      generateInviteCode();
    }
  }, [basicNav]);
  const getfromdate = () => {
    let dateenddef = new Date();
    dateenddef.setDate(dateenddef.getDate() - 10);
    dateenddef = dateenddef.toISOString().slice(0, 10);
    return dateenddef;
  };
  const [dateRangefrom, setDateRangefrom] = useState(getfromdate());
  const [dateRangeto, setDateRangeto] = useState(
    new Date().toISOString().slice(0, 10)
  );

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
    const datestartdef = new Date().toISOString().slice(0, 10);
    let dateenddef = new Date();
    dateenddef.setDate(dateenddef.getDate() - 10);
    dateenddef = dateenddef.toISOString().slice(0, 10);

    let res = await fetch(
      `https://mixpanel.com/api/2.0/segmentation?project_id=2804309&event=Page%20Visit&from_date=${
        dateRangefrom ? dateRangefrom : datestartdef
      }&to_date=${
        dateRangeto ? dateRangeto : dateenddef
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
    if (dateRangefrom?.slice(0, 10)) {
      getuserorder({
        date: dateRangefrom?.slice(8, 10),
        month: dateRangefrom?.slice(5, 7),
        year: dateRangefrom?.slice(0, 4),
        enddate: dateRangeto?.slice(8, 10),
        endmonth: dateRangeto?.slice(5, 7),
        endyear: dateRangeto?.slice(0, 4),
      });
    }
  };
  useEffect(() => {
    wow();
    handler();
    if (dateRangefrom?.slice(0, 10)) {
      getallsubs({
        date: dateRangefrom?.slice(8, 10),
        month: dateRangefrom?.slice(5, 7),
        year: dateRangefrom?.slice(0, 4),
        enddate: dateRangeto?.slice(8, 10),
        endmonth: dateRangeto?.slice(5, 7),
        endyear: dateRangeto?.slice(0, 4),
      });
    }
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
      <div className="dashboardWrapper">
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
            <div className="modalinvitecode">
              <span>
                {firstService ? (
                  <>
                    Its high time to take first step to serve your follower ,
                    <br />
                    Start with first service
                  </>
                ) : (
                  <>
                    Its high time to take your step to serve your follower ,
                    <br />
                    Start by creating a new service
                  </>
                )}
              </span>
            </div>
            <Link to="/createservice">
              <div className="add_event">
                <i className="fa-solid fa-circle-plus fa-2x"></i>
                <h2>
                  {firstService ? (
                    <>Create First Service</>
                  ) : (
                    <>Create Service</>
                  )}
                </h2>
              </div>
            </Link>
          </div>
        </div>
        <div className="rightinvitedashboard">
          {allCreatorInfo.dob ? (
            <div className="filldetailsboxwrap">
              <h1>Invite Code</h1>
              <div className="codecopybox">
                <div className="codecopyiconbox" onClick={copyinvitecode}>
                  <ContentCopyIcon />
                </div>
                <div className="invitecodeinpopup">{inviteCode}</div>
              </div>
              <span>
                You can share your invite code with other creators. This will
                help them to join the platform sooner !
              </span>
            </div>
          ) : (
            <div className="invitecodepopupwrapper">
              <div className="filldetailsboxwrap">
                <h2>Fill your Personal Information to get your Invite code</h2>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/creator_info")}
                >
                  Fill Here
                </Button>
                <span>You can share your invite code with other creators.</span>
              </div>
            </div>
          )}
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
