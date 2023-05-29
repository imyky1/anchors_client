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

import ServiceContext from "../../../../Context/services/serviceContext";
import { host } from "../../../../config/config";
import { LoadTwo } from "../../../Modals/Loading";
import { toast, ToastContainer } from "react-toastify";

const ServiceStats = (props) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    serviceInfo,
    getserviceinfo,
    compareJWT,
    getworkshopinfo,
    workshopInfo,
  } = useContext(ServiceContext);
  const [serviceType, setServiceType] = useState();
  const [approvedUser, setapprovedUser] = useState(false); // check if user searching is appropriate
  const [openLoading, setopenLoading] = useState(false);

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
    serviceType === "download" ? serviceInfo?.date : workshopInfo?.startDate
  )
    .format()
    .split("T")[0];

  const time =
    serviceType === "download"
      ? Moment(serviceInfo?.date).format().split("T")[1].split("+")[0]
      : workshopInfo?.time?.startTime;

  const getAnalyticsData = async () => {
    let response = await fetch(`${host}/analytics/getdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        slug: serviceInfo?.slug,
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
    if (serviceInfo.slug) {
      getAnalyticsData().then(() => {
        setopenLoading(false);
      });
    }
  }, [serviceInfo?.slug]);

  // Checking if the user is only able to check its data not others-------------------
  useEffect(() => {
    props.progress(0);
    if (query.get("service") === "workshop") {
      setServiceType("workshop");
      getworkshopinfo(slug).then((e) => {
        compareJWT(e[0]).then((e) => {
          if (e) {
            setapprovedUser(true);
            props.progress(100);
          } else {
            navigate("/mycontents");
          }
        });
      });
    } else {
      setServiceType("download");
      getserviceinfo(slug).then((e) => {
        compareJWT(e[0]).then((e) => {
          if (e) {
            setapprovedUser(true);
            props.progress(100);
          } else {
            navigate("/mycontents");
          }
        });
      });
    }
  }, []);

  // mixpanel api------------------------------
  const handler = async () => {
    setopenLoading(true)
    if (serviceType === undefined) {
    } else {
      fetch(`${host}/api/stats/getStats`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify({
          service: serviceType === "download" ? serviceInfo : workshopInfo,
          serviceType: serviceType,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setMixpanelData({
            valueunique: data?.response?.uniquevisits,
            valuenotunique: data?.response?.Totalvisits,
          });
          setopenLoading(false)
        });
    }
  };

  useEffect(() => {
    toast.promise(
      handler,
      {
        pending: "Please Wait..",
        error: "Try Again by reloading the page!",
      },
      {
        position: "top-center",
        autoClose: 2000,
      }
    );

    handler();
  }, [serviceInfo, workshopInfo]);

  return (
    <>
      <ToastContainer />
      <LoadTwo open={openLoading} />

      {approvedUser && (
        <div className="servicestat_wrapper">
          <div className="servicestat_heading">
            <div className="servicestat_leftheading">
              <h1>Service Detailed analysis</h1>
              <div className="servicestat_product">
                <div className="servicestat_span1">Service Name:</div>
                <span className="servicestat_span2">
                  {serviceType === "download"
                    ? serviceInfo?.sname
                    : workshopInfo?.sname}
                </span>
              </div>
              <div className="servicestat_product">
                <div className="servicestat_span1">Service Created on:</div>
                <span className="servicestat_span2"> {date + " " + time}</span>
              </div>
              <div className="servicestat_product">
                <div className="servicestat_span1">Amount:</div>
                <span className="servicestat_span2">
                  {serviceType === "download"
                    ? serviceInfo?.isPaid
                      ? "Paid" + ` (₹ ${serviceInfo?.ssp})`
                      : "Free"
                    : "₹ " + workshopInfo?.ssp}
                </span>
              </div>
            </div>
            <div className="servicestat_rightheading">
              <button
                className="servicestat_button"
                onClick={() => {
                  serviceType === "download"
                    ? navigate(`/viewUserDetails/${slug}`)
                    : navigate(`/viewUserDetails/${slug}?service=workshop`);
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
                Total user used your service
                </div>
                <h2>
                  {serviceType === "download"
                    ? serviceInfo?.downloads
                    : workshopInfo?.registrations}
                </h2>
              </div>
            </div>
            <div className="servicestat_statsbox">
              <div className="servicestat_boxpa">
                <img src={ICON1} alt="c"></img>
                <div className="servicestat_boxpa_div">
                Conversion Rate : No. of user used this service / Unique Visits
                </div>
                <h2>
                  {mixpaneldata?.valuenotunique !== 0
                    ? serviceType === "download"
                      ? (
                          (serviceInfo?.downloads * 100) /
                          mixpaneldata?.valueunique
                        ).toFixed(2) + " %"
                      : (
                          (workshopInfo?.registrations * 100) /
                          mixpaneldata?.valueunique
                        ).toFixed(2) + " %"
                    : "---"}
                </h2>
              </div>
            </div>
            <div className="servicestat_statsbox">
              <div className="servicestat_boxpa">
                <img src={ICON2} alt="c"></img>
                <div className="servicestat_boxpa_div">Service Page visit</div>
                <h2>
                  {mixpaneldata?.valuenotunique !== 0
                    ? mixpaneldata?.valuenotunique
                    : "---"}
                </h2>
              </div>
            </div>
            <div className="servicestat_statsbox">
              <div className="servicestat_boxpa">
                <img src={ICON3} alt="c"></img>
                <div className="servicestat_boxpa_div">Unique User Visit </div>
                <h2>
                  {mixpaneldata?.valueunique !== 0
                    ? mixpaneldata?.valueunique
                    : "---"}
                </h2>
              </div>
            </div>

            <div className="servicestat_statsbox">
              <div className="servicestat_boxpa">
                <img src={ICON4} alt="c"></img>
                <div className="servicestat_boxpa_div">Average time Spent</div>
                <h2> {avgTime !== 0 ? `${avgTime.toFixed(2)} s` : "---"}</h2>
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
