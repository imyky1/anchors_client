import React, { useContext, useEffect, useState } from "react";
import ServiceDetail from "../Service Detail/ServiceDetail";
import "./Service.css";
import ServiceContext from "../../Context/services/serviceContext";
import { LoadTwo } from "../Modals/Loading";
import { Fragment } from "react";
import { SuperSEO } from "react-super-seo";

function Document(props) {
  const [openLoading, setOpenLoading] = useState(false);
  const context = useContext(ServiceContext);
  const { services, getallservices } = context;
  const [revArray, setrevArray] = useState([]);

  let count = 0;

  useEffect(() => {
    setOpenLoading(true);
    getallservices().then(async () => {
      setOpenLoading(false);
    });
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    setrevArray(services?.res?.reverse())

  }, [services])
  




  return (
    <>
      <h1 className="header01">Service details</h1>
      <div className="service_list_page">
        <div className="services_table_head">
          <span>S.No.</span>
          <span>Service Name</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Uploaded on</span>
          <span>Image</span>
          <span>Downloads</span>
          <span>Email</span>
          <span>Link</span>
          <span>Action</span>
          <span>Status</span>
        </div>
      </div>

      {openLoading && <LoadTwo open={openLoading} />}
      <div className="service_details_body">
        {revArray?.length !== 0 ? (
          revArray?.map((e, i) => {
            return (
              <Fragment key={i}>
                {e.stype === 0 ? (
                  <ServiceDetail
                    key={e._id}
                    sno={i + 1}
                    service={e}
                    progress={props.progress}
                    downloads={500}
                  />
                ) : (
                  ""
                )}
              </Fragment>
            );
          })
        ) : (
          <h1 className="no_services">No services to display</h1>
        )}
      </div>
      <SuperSEO title="Anchors - Services" />

    </>
  );
}

export default Document;
