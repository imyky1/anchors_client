import { useState } from "react";
import ServiceContext from "./serviceContext";
import { host } from "../../config/config";

const ServiceState = (props) => {
  const servicesInitial = []; // this state is being passed as value to the notestate
  const eventInitial = [];
  const [services, setServices] = useState(servicesInitial);
  const [events, setEvents] = useState(eventInitial);
  const [latestEvents, setLatestEvents] = useState(eventInitial);
  const [eventInfo, setEventInfo] = useState(eventInitial);
  const [getallsubscriber, setgetallsubs] = useState({});
  const [totalsubscount, setTotalSubscount] = useState({});
  const [serviceInfo, setServiceInfo] = useState(servicesInitial);
  const [slugCount, setSlugCount] = useState(0);
  const [alluserorder, setalluserorder] = useState([]);

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
        tags: data.Tags,
        allowDownload: data.allowDownload,
        noOfPages: data.noOfPage,
        status: data.status,
      }),
    });
    const json = await response.json();
    return json;
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

  // 4. Adding Basic services from the respective data from /createBasicService endpoint
  const addBasicService = async (
    serviceID,
    sname,
    sdesc,
    ldesc,
    tags,
    stype,
    isPaid,
    smrp,
    ssp,
    allowDownload,
    noOfPage,
    simg,
    mobileSimg,
    surl,
    slug,
  ) => {
    const response = await fetch(`${host}/api/services/createBasicService`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },

      body: JSON.stringify({
        serviceID,
        sname: sname,
        sdesc: sdesc,
        ldesc: ldesc,
        slug,
        tags: tags,
        simg,
        mobileSimg,
        surl,
        stype: stype,
        isPaid: isPaid,
        smrp: smrp,
        ssp: ssp,
        allowDownload,
        noOfPages: noOfPage,
      }),
    });
    const json = await response.json();
    return json;
  };

  // 4. Adding services from the respective data from /createservice endpoint
  const addFinalService = async (
    serviceID,
    ldesc,
    allowDownload,
    noOfPage,
    status
  ) => {
    const response = await fetch(`${host}/api/services/createFinalService`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },

      body: JSON.stringify({
        serviceID,
        ldesc: ldesc,
        allowDownload,
        noOfPages: noOfPage,
        status,
      }),
    });
    const json = await response.json();
    return json;
  };

  // 5. changing staus of services from the respective data from /deleteservice endpoint
  const deleteService = async (id, status, serviceType) => {
    const response = await fetch(`${host}/api/services/deleteservice/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        status: status,
        serviceType: serviceType ? serviceType : "document",
      }),
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
      setServiceInfo({ service: json.service, creator: json.creator });
      return [json.service.c_id, json.service._id];
    } else {
      //console.log("Some error Occured")
    }
  };

  //5. Upload files to url form and save it in the server itself
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

  //5. Upload video files to url form on aws s3
  const UploadVideo = async (data) => {
    try {
      const response = await fetch(`${host}/api/file/upload/s3/videos`, {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  //5. Upload banners to url form on aws s3
  const UploadBanners = async (data) => {
    try {
      const response = await fetch(`${host}/api/file/upload/s3/banners`, {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  //5. Upload docs  to url form on aws s3
  const UploadDocuments = async (data) => {
    try {
      const response = await fetch(`${host}/api/file/upload/s3/docs`, {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  //6. get slug count for services
  const getslugcount = async (slug,exceptID = null) => {
    const response = await fetch(`${host}/api/services/getslugcount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug: slug, exceptID }),
    });
    const json = await response.json();

    if (json.success) {
      setSlugCount(json.count);
      return json.count;
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


  // Service transaction details

  const getTransactionServiceDetails=async(serviceID)=>{
    const response=await fetch(`${host}/api/services/transaction/${serviceID}`,{method: "GET",
    headers: {
      "Content-Type": "application/json",
      "jwt-token": localStorage.getItem("jwtToken"),

    },
  })
  const json = await response.json();
  return json;

  }



  /*---------Event FETCHES FROM HERE ----------------------------------------------------------------------------------------------------- */

  // 4. Adding events from the respective data from /createevent endpoint
  const addEvent = async (
    sname,
    sdesc,
    ldesc,
    slug,
    simg,
    tags,
    stype,
    isPaid,
    smrp,
    ssp,
    startDate,
    time, // in object {startTime:"",endTime:""}
    benefits,
    maxCapacity,
    meetlink,
    videoLink,
    speakerDetails
  ) => {
    console.log(simg);
    const response = await fetch(`${host}/api/event/createEvent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },

      //body: JSON.stringify({ sname:sname,sdesc:sdesc,ldesc:ldesc,slug:slug,simg:simg,surl:surl,stype:stype,isPaid:isPaid,smrp:smrp,ssp:ssp }),
      body: JSON.stringify({
        sname,
        sdesc,
        ldesc,
        slug,
        simg,
        tags,
        stype,
        isPaid,
        smrp,
        ssp,
        startDate,
        time, // in object {startTime:"",endTime:""}
        benefits,
        maxCapacity,
        meetlink,
        videoLink,
        speakerDetails,
      }),
    });
    const json = await response.json();
    return json;
  };

  //6. get slug count dor event
  const getslugcountEvent = async (slug) => {
    const response = await fetch(`${host}/api/event/getslugcount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug: slug }),
    });
    const json = await response.json();

    if (json.success) {
      setSlugCount(json.count);
      return json.count;
    } else {
      console.log("Some error Occured");
    }
  };

  // 1. Getting all the services for the respective creator
  const getallevents = async () => {
    const response = await fetch(`${host}/api/event/getallevent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    if (json.success) {
      setEvents(json);
    } else {
      console.log("Some error Occured");
    }
  };

  //5. Upload event video files to url form on aws s3
  const UploadEventVideo = async (data) => {
    try {
      const response = await fetch(`${host}/api/file/upload/s3/event/videos`, {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  //5. Upload event speakers profile to url form on aws s3
  const UploadEventSpeakersProfile = async (data) => {
    try {
      const response = await fetch(
        `${host}/api/file/upload/s3/event/speakers`,
        {
          method: "POST",
          body: data,
        }
      );
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  // Update the service
  const updateEvent = async (id, data) => {
    const response = await fetch(`${host}/api/event/updateevent/${id}`, {
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
        startDate: data.startDate,
        time: data.time,
        afterstartentry: data.afterstartentry,
        maxCapacity: data.maxCapacity,
        svideo: data.svideo,
        meetlink: data.meetlink,
      }),
    });
    const json = await response.json();
    return json.success;
  };

  // get all the events live and upcoming events data ------------------
  const getalleventsLiveandUpcoming = async () => {
    const response = await fetch(
      `${host}/api/event/getalleventsLiveandUpcoming`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("jwtToken"),
        },
      }
    );
    const json = await response.json();
    if (json.success) {
      setLatestEvents(json);
    } else {
      console.log("Some error Occured");
    }
  };

  //  2. Getting all the services for the respective creator
  const getalleventsusingid = async (c_id) => {
    const response = await fetch(`${host}/api/event/getalleventusingid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: c_id }),
    });
    const json = await response.json();
    if (json.success) {
      setEvents(json);
    } else {
      console.log("Some error Occured");
    }
  };

  const geteventinfo = async (slug) => {
    const response = await fetch(`${host}/api/event/getEventInfo/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    //console.log(json);
    if (json.success) {
      setEventInfo({ event: json.event, creator: json.creator });
      return [json.event.c_id, json.event._id];
    } else {
      //console.log("Some error Occured")
    }
  };

  const geteventusingid = async (id) => {
    const response = await fetch(`${host}/api/event/geteventusingid/${id}`, {
      method: "GET",
    });
    const json = await response.json();
    if (json.success) {
      return json.event;
    } else {
      //console.log("Some error Occured")
    }
  };

  // get all subscribers
  const getallsubs = async ({
    date,
    month,
    year,
    enddate,
    endmonth,
    endyear,
  }) => {
    const response = await fetch(
      `${host}/api/subscribe/getall?date=${date}&year=${year}&month=${month}&endyear=${endyear}&enddate=${enddate}&endmonth=${endmonth}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("jwtToken"),
        },
      }
    );
    const json = await response.json();
    if (json.success) {
      setgetallsubs(json.res);
      setTotalSubscount(json.info);
    } else {
      //console.log("Some error Occured")
    }
  };

  // get all order
  const getuserorder = async ({
    date,
    month,
    year,
    enddate,
    endmonth,
    endyear,
  }) => {
    const response = await fetch(
      `${host}/api/subscribe/serviceorders?date=${date}&year=${year}&month=${month}&endyear=${endyear}&enddate=${enddate}&endmonth=${endmonth}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("jwtToken"),
        },
      }
    );
    const json = await response.json();
    if (json.success) {
      setalluserorder(json.res);
    } else {
      //console.log("Some error Occured")
    }
  };

  // get all service feedbacks or reviews
  const getfeedbacksfromslug = async (slug) => {
    const response = await fetch(`${host}/api/query/getFeedbacks/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    return json;
  };

  // get leaderboard Data for event ----------------
  const getLeaderBoardData = async (eventID, isCreator) => {
    const response = await fetch(
      `${host}/api/event/leaderboard/${eventID}?creator=${isCreator ?? false}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("jwtToken"),
        },
      }
    );
    const json = await response.json();
    return json;
  };

  const getReferDetails = async (eventID, isCreator) => {
    const response = await fetch(
      `${host}/api/event/referaldetails/${eventID}?creator=${
        isCreator ?? false
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("jwtToken"),
        },
      }
    );
    const json = await response.json();
    return json;
  };

  const getTransactionEventDetails = async (serviceID) => {
    const response = await fetch(`${host}/api/event/transaction/${serviceID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
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
        getuserorder,
        serviceInfo,
        services,
        slugCount,
        events,
        eventInfo,
        totalsubscount,
        alluserorder,
        getserviceusingid,
        getallservicesusingid,
        getallservices,
        geteventinfo,
        addBasicService,
        addFinalService,
        deleteService,
        Uploadfile,
        UploadVideo,
        UploadEventVideo,
        UploadDocuments,
        UploadBanners,
        getserviceinfo,
        getslugcount,
        getallsubscriber,
        getslugcountEvent,
        addEvent,
        getallevents,
        updateEvent,
        geteventusingid,
        getalleventsusingid,
        getallsubs,
        getfeedbacksfromslug,
        getLeaderBoardData,
        UploadEventSpeakersProfile,
        getalleventsLiveandUpcoming,
        latestEvents,
        getReferDetails,
        getTransactionEventDetails,
        getTransactionServiceDetails
      }}
    >
      {" "}
      {/* here we use the context created and the router whch are wrapped inside the notestate can access the state passed here ith the help of use context hook */}
      {props.children}
    </ServiceContext.Provider>
  );
};

export default ServiceState;
