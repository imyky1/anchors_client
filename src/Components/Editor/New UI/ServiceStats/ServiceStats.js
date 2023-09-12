import React from "react";
import "./ServiceStats.css";
import ICON1 from "./Icons/1.svg";
import ICON2 from "./Icons/2.svg";
import ICON3 from "./Icons/3.svg";
import ICON4 from "./Icons/4.svg";
import ICON5 from "./Icons/5.svg";
import { useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Moment from "moment";
import { SuperSEO } from "react-super-seo";
import "../../../Earning Potential/Predictor.css"

import ServiceContext from "../../../../Context/services/serviceContext";
import { host } from "../../../../config/config";
import { LoadTwo } from "../../../Modals/Loading";
import { toast, ToastContainer } from "react-toastify";
import { HiInformationCircle } from "react-icons/hi";
import ServiceStats2 from "./ServiceStats2";

const TooltipBox = ({ text }) => <div className="tooltip-box" style={{top:"30px"}}>{text}</div>;

const ServiceStats = (props) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { serviceInfo, getserviceinfo, compareJWT, geteventinfo, eventInfo } =
    useContext(ServiceContext);
  const [serviceType, setServiceType] = useState();
  const [approvedUser, setapprovedUser] = useState(false); // check if user searching is appropriate
  const [openLoading, setopenLoading] = useState(false);
  const [isHovered, setIsHovered] = useState({
    tip1: false,
    tip2: false,
    tip3: false,
    tip4: false,
    tip5: false,
  });

  // custom hook to get querries
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery();

  // getting data from analytics(google) data from the db
  const [bounceRate, setBounceRate] = useState(0);
  const [avgTime, setAvgTime] = useState(0);

  const [mixpaneldata, setMixpanelData] = useState({
    valueunique: 0,
    valuenotunique: 0,
  });

  const date = Moment(
    serviceType === "download"
      ? serviceInfo?.service?.date
      : eventInfo?.event?.createdOn
  )
    .format()
    .split("T")[0];

  const time =
    serviceType === "download"
      ? Moment(serviceInfo?.service?.date).format().split("T")[1].split("+")[0]
      : Moment(eventInfo?.event?.createdOn)
          .format()
          .split("T")[1]
          .split("+")[0];

  const getAnalyticsData = async () => {
    let response = await fetch(`${host}/analytics/getdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        serviceType,
        slug,
      }),
    });
    response = await response.json();
    if (response.result) {
      setBounceRate(response?.result?.bouncerate);
      setAvgTime(response?.result?.avgTime);
    }
  };
  useEffect(() => {
    setopenLoading(true);
    if (slug) {
      getAnalyticsData().then(() => {
        setopenLoading(false);
      });
    }
  }, [slug, serviceType]);

  // Checking if the user is only able to check its data not others-------------------
  useEffect(() => {
    props.progress(0);
    if (query.get("type") === "event") {
      setServiceType("event");
      geteventinfo(slug).then((e) => {
        compareJWT(e[0]?._id).then((e) => {
          if (e) {
            setapprovedUser(true);
            props.progress(100);
          } else {
            navigate("/dashboard/mycontents");
          }
        });
      });
    } else {
      setServiceType("download");
      getserviceinfo(slug).then((e) => {
        compareJWT(e[0]?._id).then((e) => {
          if (e) {
            setapprovedUser(true);
            props.progress(100);
          } else {
            navigate("/dashboard/mycontents");
          }
        });
      });
    }
  }, []);

  // mixpanel api------------------------------
  const handler = async () => {
    setopenLoading(true);
    if (serviceType === undefined) {
    } else {
      if (serviceInfo?.service || eventInfo?.event) {
        fetch(`${host}/api/stats/getStats`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
            "jwt-token": localStorage.getItem("jwtToken"),
          },
          body: JSON.stringify({
            service:
              serviceType === "download"
                ? serviceInfo?.service
                : eventInfo?.event,
            serviceType: serviceType,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setMixpanelData({
              valueunique: data?.response?.uniquevisits,
              valuenotunique: data?.response?.Totalvisits,
            });
            setopenLoading(false);
            return data?.response;
          });
      }
    }
  };

  useEffect(() => {
    handler();
  }, [serviceInfo, eventInfo]);

  if(serviceType === "event" || serviceType === "download"){
    return <ServiceStats2 progress={props?.progress}/>
  }

  return (
    <>
      <ToastContainer limit={1} />
      <LoadTwo open={openLoading} />

      {approvedUser && (
        <div className="servicestat_wrapper">
          <div className="servicestat_heading">
            <div className="servicestat_leftheading">
              <h1>
                Detailed {serviceType === "event" ? "Event" : "Service"}{" "}
                Analysis
              </h1>
              <div className="servicestat_product">
                <div className="servicestat_span1">
                  {serviceType === "event" ? "Event" : "Service"} Name:
                </div>
                <span className="servicestat_span2">
                  {serviceType === "download"
                    ? serviceInfo?.service?.sname
                    : eventInfo?.event?.sname}
                </span>
              </div>
              <div className="servicestat_product">
                <div className="servicestat_span1">
                  {serviceType === "event" ? "Event" : "Service"} Created on:
                </div>
                <span className="servicestat_span2"> {date + " " + time}</span>
              </div>
              <div className="servicestat_product">
                <div className="servicestat_span1">Amount:</div>
                <span className="servicestat_span2">
                  {serviceType === "download"
                    ? serviceInfo?.service?.isPaid
                      ? "Paid" + ` (₹ ${serviceInfo?.service?.ssp})`
                      : "Free"
                    : "₹ " + eventInfo?.event?.ssp}
                </span>
              </div>
            </div>
            <div className="servicestat_rightheading">
              <button
                className="servicestat_button"
                onClick={() => {
                  serviceType === "download"
                    ? navigate(`/dashboard/viewUserDetails/${slug}`)
                    : navigate(`/dashboard/viewUserDetails/${slug}?type=event`);
                }}
              >
                Check Users details
              </button>
            </div>
          </div>
          <div className="servicestat_breakline"></div>
          <div className="servicestat_statsboxwrap">
            <div className="servicestat_statsbox">
              <div className="servicestat_boxpa">
                <img src={ICON5} alt="c"></img>
                <div className="servicestat_boxpa_div">
                  {serviceType === "event"
                    ? "Number of Registrations"
                    : "Number of Users who accessed"}
                  <div style={{ position: "relative" }}>
                    <HiInformationCircle
                      size={20}
                      color="grey"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => {
                        setIsHovered({ ...isHovered, tip1: true });
                      }}
                      onMouseLeave={() => {
                        setIsHovered({ ...isHovered, tip1: false });
                      }}
                    />
                    {isHovered?.tip1 && (
                      <TooltipBox text={serviceType === "download" ? `Number of Users who accessed for the Service` : `Number of Users who registered for the Event`} />
                    )}
                  </div>
                </div>
                <h2>
                  {serviceType === "download"
                    ? serviceInfo?.service?.downloads
                    : eventInfo?.event?.registrations}
                </h2>
              </div>
            </div>
            <div className="servicestat_statsbox">
              <div className="servicestat_boxpa">
                <img src={ICON1} alt="c"></img>
                <div className="servicestat_boxpa_div">
                  Conversion Rate
                  <div style={{ position: "relative" }}>
                    <HiInformationCircle
                      size={20}
                      color="grey"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => {
                        setIsHovered({ ...isHovered, tip2: true });
                      }}
                      onMouseLeave={() => {
                        setIsHovered({ ...isHovered, tip2: false });
                      }}
                    />
                    {isHovered?.tip2 && (
                      <TooltipBox text={serviceType === "download" ? `No. Of Users who accessed the Service / Unique Service Page Visits ` : "No. Of Users who registered for the Event / Unique Event Page Visits "} />
                    )}
                  </div>
                </div>
                <h2>
                  {mixpaneldata?.valuenotunique !== 0
                    ? mixpaneldata?.valuenotunique
                      ? serviceType === "download"
                        ? (
                            (serviceInfo?.service?.downloads * 100) /
                            mixpaneldata?.valueunique
                          ).toFixed(2) + " %"
                        : (
                            (eventInfo?.event?.registrations * 100) /
                            mixpaneldata?.valueunique
                          ).toFixed(2) + " %"
                      : "---"
                    : "..."}
                </h2>
              </div>
            </div>
            <div className="servicestat_statsbox">
              <div className="servicestat_boxpa">
                <img src={ICON2} alt="c"></img>
                <div className="servicestat_boxpa_div">
                  Total {serviceType === "event" ? "Event" : "Service"} Page
                  Visits
                  <div style={{ position: "relative" }}>
                    <HiInformationCircle
                      size={20}
                      color="grey"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => {
                        setIsHovered({ ...isHovered, tip3: true });
                      }}
                      onMouseLeave={() => {
                        setIsHovered({ ...isHovered, tip3: false });
                      }}
                    />
                    {isHovered?.tip3 && (
                      <TooltipBox text={serviceType === "download" ? "Number of times your Service Page was checked out" : "Number of times your Event Page was checked out"} />
                    )}
                  </div>
                </div>
                <h2>{mixpaneldata?.valuenotunique ?? "---"}</h2>
              </div>
            </div>
            <div className="servicestat_statsbox">
              <div className="servicestat_boxpa">
                <img src={ICON3} alt="c"></img>
                <div className="servicestat_boxpa_div">
                  Unique {serviceType === "event" ? "Event" : "Service"} Page
                  Visits
                  <div style={{ position: "relative" }}>
                    <HiInformationCircle
                      size={20}
                      color="grey"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => {
                        setIsHovered({ ...isHovered, tip4: true });
                      }}
                      onMouseLeave={() => {
                        setIsHovered({ ...isHovered, tip4: false });
                      }}
                    />
                    {isHovered?.tip4 && (
                      <TooltipBox text={serviceType === "download" ? "Number of Unique Visits on your Service Page" : "Number of Unique Visits on your Event Page"} />
                    )}
                  </div>
                </div>
                <h2>{mixpaneldata?.valueunique ?? "---"}</h2>
              </div>
            </div>

            <div className="servicestat_statsbox">
              <div className="servicestat_boxpa">
                <img src={ICON4} alt="c"></img>
                <div className="servicestat_boxpa_div">
                  Average time Spent on{" "}
                  {serviceType === "event" ? "Event" : "Service"} Page
                  <div style={{ position: "relative" }}>
                    <HiInformationCircle
                      size={20}
                      color="grey"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => {
                        setIsHovered({ ...isHovered, tip5: true });
                      }}
                      onMouseLeave={() => {
                        setIsHovered({ ...isHovered, tip5: false });
                      }}
                    />
                    {isHovered?.tip5 && (
                      <TooltipBox text={`Average time spent by the User on your ${serviceType === "download" ? "Service" : "Event"} Page `} />
                    )}
                  </div>
                </div>
                <h2>
                  {" "}
                  {avgTime !== 0 && avgTime
                    ? `${avgTime?.toFixed(2)} s`
                    : "---"}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
      <SuperSEO title="Anchors - Service Statistics" />
    </>
  );
};

export default ServiceStats;
