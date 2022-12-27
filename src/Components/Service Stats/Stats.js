import React, { useContext,useMemo,useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ServiceContext from "../../Context/services/serviceContext";
import "./Stats.css";
import Moment from "moment";
import { SuperSEO } from "react-super-seo";

function Stats(props) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { serviceInfo, getserviceinfo, compareJWT,getworkshopinfo,workshopInfo } =
    useContext(ServiceContext);
  const [serviceType, setServiceType] = useState();

  // custom hook to get querries
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();

  useEffect(() => {
    props.progress(0);
    if(query.get("service") === "workshop"){
      setServiceType("workshop")
      getworkshopinfo(slug).then((e) => {
        compareJWT(e[0]).then((e) => {
          if (e) {
            props.progress(100);
          } else {
            navigate("/servicelist");
          }
        });
      });
    }
    else{
      setServiceType("download")
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

  const date = Moment(serviceType === "download" ? serviceInfo?.date : workshopInfo?.startDate).format().split("T")[0];
  const time = serviceType === "download" ? Moment(serviceInfo?.date).format().split("T")[1].split("+")[0] : workshopInfo?.time?.startTime

  if (serviceType === "download" ? !serviceInfo : !workshopInfo) {
    return navigate("/servicelist");
  }


  return (
    <>
    <div className="stats_mainPage">
      <section className="stats_header">
        <h1 className="header01">{serviceType === "download" ? "Service detailed Analysis" : "Event detailed Analysis"}</h1>
        <button onClick={()=>{serviceType === "download" ? navigate(`/viewusersdetials/${slug}`) : navigate(`/viewusersdetials/${slug}?service=workshop`)}}>
          <i class="fa-solid fa-user-check fa-lg"></i> &nbsp; {serviceType === "download" ? "Check Download Users" : "Check Registered Users"}
        </button>
      </section>

      <section className="stats_details">
        <div>
          <span className="stats_title">{serviceType === "download" ? "Service name :" : "Event name :"}</span>{" "}
          <span className="stats_service_desc" style={{ width: "50%" }}>
            {serviceType === "download" ? serviceInfo?.sname : workshopInfo?.sname}
          </span>
        </div>
        <div>
          <span>
            <span className="stats_title" style={{ marginBottom: "10px" }}>
              {serviceType === "download" ? "Upload date :" : " Event date :"}
            </span>
            <span className="stats_title"> {serviceType === "download" ? "Paid / Free:" : "Amount"}</span>
          </span>
          <span>
            <span
              className="stats_service_desc"
              style={{ marginBottom: "10px" }}
            >
              {date + " " + time}
            </span>
            <span className="stats_service_desc">
              {serviceType === "download" ? serviceInfo?.isPaid ? "Paid" + ` (₹ ${serviceInfo?.ssp})` : "Free" : "₹ " +workshopInfo?.ssp}
            </span>
          </span>
        </div>
      </section>

      <div className="complete_Stats">
        <section className="stats_01">
          <div style={{ backgroundColor: "#FFF2D1" }}>
            <i class="fa-solid fa-user-check fa-3x"></i>
            <div>
              <span className="stats_number">{serviceType === "download" ? serviceInfo?.downloads : workshopInfo?.registrations}</span>
              <span className="stats_texts_data">Total user {serviceType === "download" ? "downloads" : "registrations"}</span>
            </div>
          </div>
          <div style={{ backgroundColor: "#C9FFDE" }}>
            <i class="fa-solid fa-percent fa-3x"></i>
            <div>
              <span className="stats_number">71%</span>
              <span className="stats_texts_data">
                Conversion Rate ({serviceType === "download" ? "downloads" : "registrations"}/visit)
              </span>
            </div>
          </div>
        </section>
        <section className="stats_02">
          <div>
            <span className="stats_number">263</span>
            <span className="stats_texts_data2">Total {serviceType !== "download" ? "Event " : ""}Page visit</span>
          </div>
          <div>
            <span className="stats_number">71 %</span>
            <span className="stats_texts_data2">Unique Users visit</span>
          </div>
          <div>
            <span className="stats_number">71 %</span>
            <span className="stats_texts_data2">Avg time spent on page</span>
          </div>
        </section>
      </div>
    </div>
    <SuperSEO
        title="Anchors - Statistics"
      />
    </>
  );
}

export default Stats;
