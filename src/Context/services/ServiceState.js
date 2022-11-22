import { useState } from "react";
import ServiceContext from "./serviceContext";
import { host } from "../../config/config";

const ServiceState = (props) => {
  const servicesInitial = []; // this state is being passed as value to the notestate

  const [services, setServices] = useState(servicesInitial);
  const [serviceInfo, setServiceInfo] = useState(servicesInitial);
  const [slugCount, setSlugCount] = useState(0);

  // 1. Getting all the services for the respective creator
  const getallservices = async () => {
    const response = await fetch(`${host}/api/services/getallservices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    if (json.success) {
      setServices(json);
    } else {
      console.log("Some error Occured");
    }
  };

  // Update the service
  const updateService = async (id, data) => {
    const response = await fetch(`${host}/api/services/updateservice/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        sname: data.sname,
        sdesc: data.sdesc,
        ldesc: data.ldesc,
        isPaid: data.isPaid,
        smrp: data.smrp,
        ssp: data.ssp,
        simg: data.simg,
        surl: data.surl,
        tags: data.tags,
      }),
    });
    const json = await response.json();
    return json.success;
  };

  //  2. Getting all the services for the respective creator
  const getallservicesusingid = async (c_id) => {
    const response = await fetch(`${host}/api/services/getallservicesusingid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: c_id }),
    });
    const json = await response.json();
    if (json.success) {
      setServices(json);
    } else {
      console.log("Some error Occured");
    }
  };

  // 4. Adding services from the respective data from /createservice endpoint
  const addservice = async (
    sname,
    sdesc,
    ldesc,
    slug,
    copyURL,
    simg,
    surl,
    tags,
    stype,
    isPaid,
    smrp,
    ssp
  ) => {
    const response = await fetch(`${host}/api/services/createservice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },

      //body: JSON.stringify({ sname:sname,sdesc:sdesc,ldesc:ldesc,slug:slug,simg:simg,surl:surl,stype:stype,isPaid:isPaid,smrp:smrp,ssp:ssp }),
      body: JSON.stringify({
        sname: sname,
        sdesc: sdesc,
        ldesc: ldesc,
        slug: slug,
        copyURL: copyURL,
        tags: tags,
        simg: simg,
        surl: surl,
        stype: stype,
        isPaid: isPaid,
        smrp: smrp,
        ssp: ssp,
      }),
    });
    const json = await response.json();
    return json;
  };

  // 5. Deleting services from the respective data from /deleteservice endpoint
  const deleteService = async (id, status) => {
    const response = await fetch(`${host}/api/services/deleteservice/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({ status: status }),
    });
    const json = await response.json();
    return json.success;
  };

  // check if it is creators first service
  const checkFirstService = async () => {
    const response = await fetch(`${host}/api/services/checkforfirstservice`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    return json.success;
  };

  // Getting get service detail using id
  const getserviceusingid = async (id) => {
    const response = await fetch(
      `${host}/api/services/getserviceusingid/${id}`,
      {
        method: "GET",
      }
    );
    const json = await response.json();
    if (json.success) {
      return json.service;
    } else {
      //console.log("Some error Occured")
    }
  };

  // 6. Getting a service detail for the respective creator from /getserviceinfo endpoint
  const getserviceinfo = async (slug) => {
    const response = await fetch(
      `${host}/api/services/getserviceinfo/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    if (json.success) {
      setServiceInfo(json.service[0]);
      return [json.service[0]?.c_id, json.service[0]?._id];
    } else {
      //console.log("Some error Occured")
    }
  };

  //5. Upload files to url form
  const Uploadfile = async (data) => {
    try {
      const response = await fetch(`${host}/api/file/upload`, {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  //6. get slug count
  const getslugcount = async (slug) => {
    const response = await fetch(`${host}/api/services/getslugcount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug: slug }),
    });
    const json = await response.json();

    if (json.success) {
      setSlugCount(json.count);
    } else {
      console.log("Some error Occured");
    }
  };

  // check for copy url if it already exists
  const checkCpyUrl = async (url) => {
    const response = await fetch(`${host}/api/services/checkurl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    });
    const json = await response.json();
    return json.success;
  };

  // get service slug from redirection copy url
  const getslugfromcpyid = async (id) => {
    const response = await fetch(`${host}/api/services/getslugfromcpyid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    const json = await response.json();
    return json;
  };

  // just compare jwt token and a creator id

  const compareJWT = async (id) => {
    const response = await fetch(`${host}/api/services/comparejwt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({ id: id }),
    });
    const json = await response.json();
    return json.success;
  };

  // get pervious one hour downloads of the file'

  const getOneHourDownloads = async (id) => {
    const response = await fetch(
      `${host}/api/services/getonehourdownloads/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    return json.users;
  };
  /**WORKSHOP FETCHES FROM HERE */
  // 4. Adding services from the respective data from /createservice endpoint
  const addworkshop = async (
    sname,
    sdesc,
    ldesc,
    slug,
    copyURL,
    simg,
    tags,
    stype,
    isPaid,
    smrp,
    ssp,
    startDate,
    time,
    afterstartentry,
    maxCapacity
  ) => {
    const response = await fetch(`${host}/api/workshop/createworkshop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },

      //body: JSON.stringify({ sname:sname,sdesc:sdesc,ldesc:ldesc,slug:slug,simg:simg,surl:surl,stype:stype,isPaid:isPaid,smrp:smrp,ssp:ssp }),
      body: JSON.stringify({
        sname: sname,
        sdesc: sdesc,
        ldesc: ldesc,
        slug: slug,
        copyURL: copyURL,
        tags: tags,
        simg: simg,
        stype: stype,
        isPaid: isPaid,
        smrp: smrp,
        ssp: ssp,
        startDate: startDate,
        time: time,
        afterstartentry: afterstartentry,
        maxCapacity: maxCapacity,
      }),
    });
    const json = await response.json();
    return json;
  };

  return (
    <ServiceContext.Provider
      value={{
        getOneHourDownloads,
        compareJWT,
        updateService,
        getslugfromcpyid,
        checkCpyUrl,
        checkFirstService,
        serviceInfo,
        services,
        slugCount,
        getserviceusingid,
        getallservicesusingid,
        getallservices,
        addservice,
        deleteService,
        Uploadfile,
        getserviceinfo,
        getslugcount,
        addworkshop,
      }}
    >
      {" "}
      {/* here we use the context created and the router whch are wrapped inside the notestate can access the state passed here ith the help of use context hook */}
      {props.children}
    </ServiceContext.Provider>
  );
};

export default ServiceState;
