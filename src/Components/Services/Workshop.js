import React, { useContext, useEffect, useState } from "react";
import WorkshopDetail from "../Service Detail/WorkshopDetail";
import "./Service.css";
import ServiceContext from "../../Context/services/serviceContext";
import { LoadTwo } from "../Modals/Loading";
import { Fragment } from "react";

function Workshop(props) {
  const [openLoading, setOpenLoading] = useState(true);
  const context = useContext(ServiceContext);
  const { workshops, getallworkshops } = context;

  let count = 0;

  useEffect(() => {
    getallworkshops().then(() => {});
    setOpenLoading(false);
    // eslint-disable-next-line
  }, [workshops]);

  return (
    <>
      <div className="service_list_page">
        <div className="services_table_headtwo">
          <span>S.No.</span>
          <span>Event Name</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Created on</span>
          <span>Image</span>
          <span>Registrations</span>
          <span>Max Capacity</span>
          <span>Date & Time</span>
          <span>Action</span>
          <span>MeetLink</span>
        </div>
      </div>
      {openLoading && <LoadTwo open={openLoading} />}
      <div className="service_details_body">
        {workshops.res?.length !== 0 ? (
          workshops.res?.map((e, i) => {
            return (
              <Fragment key={i}>
                {e.stype === 1 ? (
                  <WorkshopDetail
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
          <h1 className="no_services">No Workshops/events to display</h1>
        )}
      </div>
    </>
  );
}

export default Workshop;
