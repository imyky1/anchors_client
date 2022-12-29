import React, { useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ServiceContext from "../../Context/services/serviceContext";
import "./Stats.css";
import Moment from "moment";
import { SuperSEO } from "react-super-seo";

function Stats(props) {
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

  // custom hook to get querries
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const [resapi, setres] = useState(null);
  const query = useQuery();

  useEffect(() => {
    handler();
  }, [serviceType === "download" ? serviceInfo : workshopInfo]);

  useEffect(() => {
    props.progress(0);
    if (query.get("service") === "workshop") {
      setServiceType("workshop");
      getworkshopinfo(slug).then((e) => {
        compareJWT(e[0]).then((e) => {
          if (e) {
            props.progress(100);
          } else {
            navigate("/servicelist");
          }
        });
      });
    } else {
      setServiceType("download");
      getserviceinfo(slug).then((e) => {
        compareJWT(e[0]).then((e) => {
          if (e) {
            props.progress(100);
          } else {
            navigate("/servicelist");
          }
        });
      });
    }
  }, []);

  const [mixpaneldata, setMixpanelData] = useState({
    valueunique: -1,
    valuenotunique: -1,
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

  if (serviceType === "download" ? !serviceInfo : !workshopInfo) {
    return navigate("/servicelist");
  }

  // mixpanel api

  const handler = async () => {
    var value = 0;
    var value2 = 0;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: "Basic MDg3MmMzNTAyODBiMTdiNzk0YjVjOWM5NTRjZTAwZjc6",
      },
    };
    if (
      mixpaneldata.valueunique === -1 && serviceType === "download"
        ? serviceInfo
        : workshopInfo
    ) {
      console.log("ran wow");
      const dateservice =
        serviceType === "download"
          ? new Date(
              new Date(serviceInfo?.date).setDate(
                new Date(serviceInfo?.date).getDate() - 1
              )
            )
              .toISOString()
              .slice(0, 10)
          : new Date(
              new Date(workshopInfo?.date).setDate(
                new Date(workshopInfo?.date).getDate() - 1
              )
            )
              .toISOString()
              .slice(0, 10);

      let res = await fetch(
        `https://mixpanel.com/api/2.0/segmentation?project_id=2804309&event=Page%20Visit&from_date=${dateservice}&to_date=${new Date()
          .toISOString()
          .slice(
            0,
            10
          )}&where=properties%5B%22%24current_url%22%5D%20in%20%5B%22https%3A%2F%2Fwww.anchors.in%2F${
          serviceType === "download" ? "s" : "w"
        }%2F${slug}%22%5D&type=unique&format=csv`,
        options
      );
      let resnotunique = await fetch(
        `https://mixpanel.com/api/2.0/segmentation?project_id=2804309&event=Page%20Visit&from_date=${dateservice}&to_date=${new Date()
          .toISOString()
          .slice(
            0,
            10
          )}&where=properties%5B%22%24current_url%22%5D%20in%20%5B%22https%3A%2F%2Fwww.anchors.in%2F${
          serviceType === "download" ? "s" : "w"
        }%2F${slug}%22%5D&format=csv`,
        options
      );

      const helper = await res.text();
      const lines = helper.split(/\r?\n/);
      const helper2 = await resnotunique.text();
      const lines2 = helper2.split(/\r?\n/);
      var csvData2 = [];

      var csvData = [];
      for (let i = 1; i < lines.length - 1; i++) {
        csvData[i - 1] = lines[i].split(",");
      }

      for (let i = 1; i < lines2.length - 1; i++) {
        csvData2[i - 1] = lines2[i].split(",");
      }

      for (let i = 0; i < csvData.length; i++) {
        value = +value + +parseInt(csvData[i][1]);
      }
      for (let i = 0; i < csvData2.length; i++) {
        value2 = +value2 + +parseInt(csvData2[i][1]);
      }

      setMixpanelData({
        valueunique: value,
        valuenotunique: value2,
      });
    }
  };

  return (
    <>
      <div className="stats_mainPage">
        <section className="stats_header">
          <h1 className="header01">
            {serviceType === "download"
              ? "Service detailed Analysis"
              : "Event detailed Analysis"}
          </h1>
          <button
            onClick={() => {
              serviceType === "download"
                ? navigate(`/viewusersdetails/${slug}`)
                : navigate(`/viewusersdetails/${slug}?service=workshop`);
            }}
          >
            <i class="fa-solid fa-user-check fa-lg"></i> &nbsp;{" "}
            {serviceType === "download"
              ? "Check Download Users"
              : "Check Registered Users"}
          </button>
        </section>

        <section className="stats_details">
          <div>
            <span className="stats_title">
              {serviceType === "download" ? "Service name :" : "Event name :"}
            </span>{" "}
            <span className="stats_service_desc" style={{ width: "50%" }}>
              {serviceType === "download"
                ? serviceInfo?.sname
                : workshopInfo?.sname}
            </span>
          </div>
          <div>
            <span>
              <span className="stats_title" style={{ marginBottom: "10px" }}>
                {serviceType === "download" ? "Upload date :" : " Event date :"}
              </span>
              <span className="stats_title">
                {" "}
                {serviceType === "download" ? "Paid / Free:" : "Amount"}
              </span>
            </span>
            <span>
              <span
                className="stats_service_desc"
                style={{ marginBottom: "10px" }}
              >
                {date + " " + time}
              </span>
              <span className="stats_service_desc">
                {serviceType === "download"
                  ? serviceInfo?.isPaid
                    ? "Paid" + ` (₹ ${serviceInfo?.ssp})`
                    : "Free"
                  : "₹ " + workshopInfo?.ssp}
              </span>
            </span>
          </div>
        </section>

        <div className="complete_Stats">
          <section className="stats_01">
            <div style={{ backgroundColor: "#FFF2D1" }}>
              <i class="fa-solid fa-user-check fa-3x"></i>
              <div>
                <span className="stats_number">
                  {serviceType === "download"
                    ? serviceInfo?.downloads
                    : workshopInfo?.registrations}
                </span>
                <span className="stats_texts_data">
                  Total user{" "}
                  {serviceType === "download" ? "downloads" : "registrations"}
                </span>
              </div>
            </div>
            <div style={{ backgroundColor: "#C9FFDE" }}>
              <i class="fa-solid fa-percent fa-3x"></i>
              <div>
                <span className="stats_number">
                  {mixpaneldata?.valuenotunique !== 0
                    ? serviceType === "download"
                      ? (
                          (serviceInfo?.downloads * 100) /
                          mixpaneldata?.valueunique
                        ).toFixed(2)
                      : (
                          (workshopInfo?.registrations * 100) /
                          mixpaneldata?.valueunique
                        ).toFixed(2) + "%"
                    : "---"}
                </span>
                <span className="stats_texts_data">
                  Conversion Rate (
                  {serviceType === "download" ? "downloads" : "registrations"}
                  /visit)
                </span>
              </div>
            </div>
          </section>
          <section className="stats_02">
            <div>
              <span className="stats_number">
                {mixpaneldata?.valuenotunique !== 0
                  ? mixpaneldata?.valuenotunique
                  : "---"}
              </span>
              <span className="stats_texts_data2">
                Total {serviceType !== "download" ? "Event " : ""}Page visit
              </span>
            </div>
            <div>
              <span className="stats_number">
                {mixpaneldata?.valueunique !== 0
                  ? mixpaneldata?.valueunique
                  : "---"}
              </span>
              <span className="stats_texts_data2">Unique User visits</span>
            </div>
            {/* <div>
              <span className="stats_number">71 %</span>
              <span className="stats_texts_data2">Avg time spent on page</span>
            </div> */}
          </section>
        </div>
      </div>
      <SuperSEO title="Anchors - Statistics" />
    </>
  );
}

export default Stats;
