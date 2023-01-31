import React, { useContext, useEffect, useState } from "react";
import ServiceDetail from "../Service Detail/ServiceDetail";
import "./Service.css";
import ServiceContext from "../../Context/services/serviceContext";
import { LoadTwo } from "../Modals/Loading";
import { Fragment } from "react";

function Document(props) {
  const [openLoading, setOpenLoading] = useState(false);
  const context = useContext(ServiceContext);
  const { services, getallservices } = context;

  let count = 0;

  useEffect(() => {
    setOpenLoading(true);
    getallservices().then(() => {
      setOpenLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("f")
  }, [services])
  

  return (
    <>
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
        {services.res?.length !== 0 ? (
          services.res?.reverse()?.map((e, i) => {
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
    </>
  );
}

export default Document;
