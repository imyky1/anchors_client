import React from "react";
import { useMemo } from "react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import { creatorContext } from "../../Context/CreatorState";
import ServiceContext from "../../Context/services/serviceContext";
import { LoadTwo } from "../Modals/Loading";
import "./Details.css";
import Detail_list from "./Detail_list";

function Details(props) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getUserDetails, allUserDetails } = useContext(creatorContext);
  const {
    serviceInfo,
    getserviceinfo,
    compareJWT,
    getworkshopinfo,
    workshopInfo,
  } = useContext(ServiceContext);
  const [openLoading, setopenLoading] = useState(false);
  const [serviceType, setServiceType] = useState();

  // custom hook to get querries
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();

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

  useEffect(() => {
    setopenLoading(true);
    getUserDetails(serviceType === "download" ? serviceInfo?._id : workshopInfo?._id,serviceType).then((e) => {
      setopenLoading(false);
    });
  }, [serviceInfo]);


  return (
    <>
      <div className="details_main">
        <h2 className="header01">
          List of Users who {serviceType === "download" ? "downloaded" : "registered for"} - "{serviceType === "download" ? serviceInfo?.sname : workshopInfo?.sname}"
        </h2>
        <div className={serviceType === "download" ? "user_details_table_head" : "user_details_table_head2"}>
          <span>S.No.</span>
          <span>Name</span>
          <span>Email ID</span>
          <span>Location</span>
          {serviceType === "workshop" && <span>Amount Paid</span>}
          <span>{serviceType === "download" ? "Downloaded" : "Registered"} On</span>
        </div>
      </div>

      {openLoading && <LoadTwo open={openLoading} />}
      {allUserDetails.length > 0 ?
      <div className="user_details_data">
        {allUserDetails?.map((e, i) => {
          return <Detail_list key={i} sno={i + 1} info={e} serviceType={serviceType}/>;
        })}
      </div> : <h1 className="no_services">No user details to display</h1>}
      <SuperSEO title="Anchors - User Download Details" />
    </>
  );
}

export default Details;
