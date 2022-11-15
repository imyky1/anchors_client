import React, { useContext, useEffect,useState } from "react";
import ServiceDetail from "../Service Detail/ServiceDetail";
import "./Service.css";
import ServiceContext from "../../Context/services/serviceContext";
import { LoadTwo } from "../Modals/Loading";


function Service(props) {
  const [openLoading, setOpenLoading] = useState(true)
  const context = useContext(ServiceContext);
  const { services, getallservices } = context;

  let count = 0;



  useEffect(() => {
    getallservices().then(()=>{
    })
    setOpenLoading(false)
    // eslint-disable-next-line
  }, [services]);
  


  return (
    <>
      <div className="service_list_page">
        <h2>Service details</h2>
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

      {openLoading && <LoadTwo open={openLoading}/>}
      <div className="service_details_body">
        {services.res?.length !==0? services.res?.map((e,i) => {
            return (
              <ServiceDetail
                key={e._id}
                sno={i+1}
                service={e}
                progress={props.progress}
                downloads={500}
              />
            );
          
        }):
          <h1 className="no_services">No services to display</h1>
       }
      </div>
    </>
  );
}

export default Service;
