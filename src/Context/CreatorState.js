import React, { useState, createContext } from "react";
import { host } from "../config/config";

export const creatorContext = createContext();

const CreatorState = (props) => {
  const [basicCreatorInfo, setbasicCreatorInfo] = useState({});
  const [basicCdata, setbasicCdata] = useState({});
  const [basicNav, setbasicNav] = useState({});
  const [allCreatorInfo, setallCreatorInfo] = useState({});
  const [FeedbackStats, setFeedbackStats] = useState();
  const [RequestsStats, setRequestsStats] = useState();
  const [allUserDetails, setallUserDetails] = useState([]);

  const [allSubscribers, setallSubscribers] = useState([]);
  const [subsInfo, setsubsInfo] = useState([]);
  const [subscriberCount, setsubscriberCount] = useState({
    total: 0,
    paid: 0,
    free: 0,
  });

  // ROUTE 3 : UPDATE/Create User Info
  const setCreatorInfo = async (info) => {
    const response = await fetch(
      `${host}/api/creator/update/info`,

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify({
          name: info.name,
          phone: info.phone,
          aboutMe: info.aboutMe,
          tagLine: info.tagLine,
          profile: info.profile,
          linkedInLink: info.linkedInLink,
          twitterLink: info.twitterLink,
          ytLink: info.ytLink,
          instaLink: info.instaLink,
          fbLink: info.fbLink,
          teleLink: info.teleLink,
          topmateLink: info.topmateLink,
          dob: info.dob,
        }),
      }
    );
    const json = await response.json();
    return json;
  };

  // ROUTE 4 : Get Basic Creator Info -> No login required
  const getBasicCreatorInfo = async (creator_id) => {
    // id=> creator id
    const response = await fetch(`${host}/api/creator/basic/${creator_id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    const json = await response.json();
    if (json?.success) {
      setbasicCreatorInfo(json?.res);
      setbasicCdata(json?.other);
    } else {
      console.error(json?.error);
    }
  };

  // Route for searching id using slug
  const getcreatoridUsingSlug = async (slug) => {
    // id=> creator id
    const response = await fetch(`${host}/api/creator/idwithslug/${slug}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": true,
      },
    });
    const json = await response.json();
    if (json?.success) {
      await getBasicCreatorInfo(json?.res._id);
      return json?.res._id;
    } else {
      //alert(json.error)
    }
  };

  // ROUTE 5: GET All Creator Info -> Creator Login Required
  const getAllCreatorInfo = async () => {
    const response = await fetch(`${host}/api/creator/advanced/info`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    if (json?.success) {
      setallCreatorInfo(json?.res);
      setbasicNav(json?.other);
      return json?.other?._id; // for home page usage
    } else {
      //alert(json.error)
    }
  };

  // get status of a creator
  const getStatus = async () => {
    const response = await fetch(`${host}/api/creator/getstatus`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    if (json.success) {
      return json;
    } else {
      //console.log(json.error)
    }
  };


  // update status of a creator
  const updateStatus = async () => {
    const response = await fetch(`${host}/api/creator/updateStatusProfile`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    return json
  };


  // FETCH ALL SUBSCRIBERS

  const [paging, setpaging] = useState({});

  const getAllSubscribers = async () => {
    const response = await fetch(`${host}/api/subscribe/getall`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    if (json.success) {
      setallSubscribers(json.res);
      setpaging({
        // it is the count details of subs
        ...paging,
        ...json.info,
      });
      return json.res;
    } else {
      //return alert(json.error)
      return json.success;
    }
  };

  // SUBSCRIBER COUNTS => TOTAL < FREE < PAID
  const getSubCounts = () => {
    let paid = 0;
    let free = 0;
    if (allSubscribers.length !== 0) {
      for (let i in allSubscribers) {
        if (allSubscribers[i].isPaid === 1) {
          paid += 1;
        } else {
          free++;
        }
      }
    }
    setsubscriberCount({
      total: allSubscribers.length,
      paid: paid,
      free: free,
    });
  };

  // FETCH SUBSCRIBER INFO
  const getSubsInfo = async (subsData = []) => {
    let allInfo = [];
    for (let i of subsData) {
      let info = await getUserInfo(i?.userID?.toString());
      allInfo.push(info);
    }
    setsubsInfo(allInfo);
    return allInfo;
  };

  const getUserInfo = async (id) => {
    const response = await fetch(`${host}/api/user/info/advanced/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    const json = await response.json();
    if (json.success) {
      return json.res;
    } else {
      //alert(json.error)
    }
  };

  // get all feebacks on creator id
  const getAllFeedbacks = async () => {
    const response = await fetch(`${host}/api/query/getFeedbacks`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    if (json.success) {
      setFeedbackStats(json.stats); // total review count for dashboard
      return [json?.res,json?.dummy,json?.firstService];
    } else {
      //alert(json.error)
    }
  };

  // change feedback status fro creator
  const updateFeedbackStatus = async (id) => {
    const response = await fetch(
      `${host}/api/query/changeStatus/feedback/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
      }
    );
    const json = await response.json();
    return json.success;
  };

  // display all queries for creator
  const getUserQueries = async () => {
    const response = await fetch(`${host}/api/query/getQuerries`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    if (json.success) {
      setRequestsStats(json.stats); // total requests count for dashboard
      return [json?.res,json?.dummy,json?.firstService];
    } else {
      //  toastify error
    }
  };

  // display all USERS for creator SERVICE
  const getUserDetails = async (id, type) => {
    const response = await fetch(`${host}/api/userdetails/getallusers/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        type
      }),
    });
    const json = await response.json();
    if (json.success) {
      console.log(json)
      setallUserDetails(json.users);
    } else {
      //  toastify error
    }
  };

  // get extra details for creator dashboard
  const getCreatorExtraDetails = async () => {
    const response = await fetch(`${host}/api/userdetails/creatorExtraInfoOfCreator`, {
      method: "GET",
      headers: {
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    return json;
  };


  // genrate invite Code -------------------------------
  const generateInviteCode = async () => {
    try {
      const response = await fetch(`${host}/api/creator/generateCode`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
      });
      const json = await response.json();
      return json
    } catch (error) {
      console.log(error);
    }
  };

  // verify invite Code on Waitlist-------------------------------
  const verifyInviteCode = async (code) => {
    try {
      const response = await fetch(`${host}/api/creator/verifyInviteCode`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body:JSON.stringify({
          code
        })
      });
      const json = await response.json();
      return json
    } catch (error) {
      console.log(error);
    }
  };



  // fill tell us more form-------------------------------
  const fillTellUsMoreForm = async (contactNumber,verifiedContact,inviteCode,platform,followers,socialLink,knownFrom) => {
    try {
      const response = await fetch(`${host}/api/tellUsMore/fillTellUsMoreForm`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token":localStorage.getItem("jwtToken")
        },
        body:JSON.stringify({
          inviteCode,
          contactNumber,
          verifiedContact,
          platform,
          followers,
          socialLink,
          knownFrom,
          status:1,
          updatedOn:Date.now(),
        })
      });
      const json = await response.json();
      return json
    } catch (error) {
      console.log(error);
    }
  };
  // update tell us more form invite code-------------------------------
  const UpdateCodeInTellUsMoreForm = async (inviteCode) => {
    try {
      const response = await fetch(`${host}/api/tellUsMore/updateInviteCodeInTellUsMore`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token":localStorage.getItem("jwtToken")
        },
        body:JSON.stringify({
          code : inviteCode
        })
      });
      const json = await response.json();
      return json.success
    } catch (error) {
      console.log(error);
    }
  };

  // get tell us more form Data-------------------------------
  const getTellUsMoreFormData = async () => {
    try {
      const response = await fetch(`${host}/api/tellUsMore/getTellUsMoreFormData`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token":localStorage.getItem("jwtToken")
        }
      });
      const json = await response.json();
      return json

    } catch (error) {
      console.log(error);
    }
  };


  // get waitlist Number-------------------------------
  const getWaitlistNumber = async () => {
    try {
      const response = await fetch(`${host}/api/tellUsMore/getWailtistNumber`, {
        method: "GET",
        headers: {
          "jwt-token":localStorage.getItem("jwtToken")
        }
      });
      const json = await response.json();
      return json

    } catch (error) {
      console.log(error);
    }
  };

  const createCreatorFeedback = async (totalRating,questionRating,comment) =>{
    try {
      const response = await fetch(`${host}/api/creator/feedback/createFeedback`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token":localStorage.getItem("jwtToken")
        },
        body:JSON.stringify({
          totalRating,questionRating,comment
        })
      })

      const json = await response.json()
      return json.success

    } catch (error) {
      console.log(error);
    }
  }

// Check Stepper status ------------
  const checkStepperStatus = async () =>{
    try {
      const response = await fetch(`${host}/api/creator/creatorStepperChecker`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token":localStorage.getItem("jwtToken")
        }
      })

      const json = await response.json()
      return json

    } catch (error) {
      console.log(error);
    }
  }


// update Stepper status ------------
  const updateStepperStatus = async () =>{
    try {
      const response = await fetch(`${host}/api/creator/updateStepperStatus`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token":localStorage.getItem("jwtToken")
        }
      })

      const json = await response.json()
      return json

    } catch (error) {
      console.log(error);
    }
  }



  // Statistics -----------------------------------------------------------------------------------

      //get order stats
      const getOrderStats=async(selectedOption)=>{
        try{
          const response=await fetch(`${host}/api/stats/getOrderStats?filter=${selectedOption}`,{
            method:"GET",
            headers:{
              "jwt-token":localStorage.getItem("jwtToken")
            }
          });
          const json = await response.json();
          return json
  
        }catch(error){
          console.log(error);
        }
      }
  
      const getMaxService=async()=>{
        try{
          const response=await fetch(`${host}/api/stats/getMaxService`,{
            method:"GET",
            headers:{
              "jwt-token":localStorage.getItem("jwtToken")
            }
          });
          const json = await response.json();
          return json
  
        }catch(error){
          console.log(error);
        }
      }
  
      const getAvgRating=async()=>{
        try{
          const response=await fetch(`${host}/api/stats/getAvgRating`,{
            method:"GET",
            headers:{
              "jwt-token":localStorage.getItem("jwtToken")
            }
          });
          const json = await response.json();
          return json
  
        }catch(error){
          console.log(error);
        }
      }

      const getEventReg=async(selectedOption)=>{
        try{
          const response=await fetch(`${host}/api/stats/getEventRegistrations?filter=${selectedOption}`,{
            method:"GET",
            headers:{
              "jwt-token":localStorage.getItem("jwtToken")
            }
          });
          const json = await response.json();
          console.log('json');
          console.log(json);
          return json

        }catch(error){
          console.log(error);
        }

      }

      const getMaxEvent=async()=>{
        try{
          const response=await fetch(`${host}/api/stats/getEventMax`,{
            method:"GET",
            headers:{
              "jwt-token":localStorage.getItem("jwtToken")
            }
          });
          const json = await response.json();

          return json

        }catch(error){
          console.log(error);
        }

      }

      const getViewsStats=async(selectedOption)=>{
        try{
          const response=await fetch(`${host}/api/stats/getViews?filter=${selectedOption}`, {
            method: "GET",
            headers:{
              "jwt-token":localStorage.getItem("jwtToken")
            }
    
          })
          const json = response.json()
          return json
    
        }catch(error){
          console.log(error);
        }
      }





  return (
    <creatorContext.Provider
      value={{
        RequestsStats,
        FeedbackStats,
        getUserDetails,
        allUserDetails,
        getUserQueries,
        updateFeedbackStatus,
        getAllFeedbacks,
        basicNav,
        paging,
        basicCdata,
        getUserInfo,
        allSubscribers,
        subscriberCount,
        getStatus,
        getcreatoridUsingSlug,
        getAllCreatorInfo,
        getBasicCreatorInfo,
        basicCreatorInfo,
        allCreatorInfo,
        getAllSubscribers,
        subsInfo,
        getSubsInfo,
        getSubCounts,
        setsubsInfo,
        setCreatorInfo,
        getCreatorExtraDetails,
        generateInviteCode,
        verifyInviteCode,
        fillTellUsMoreForm,
        getTellUsMoreFormData,
        updateStatus,
        getWaitlistNumber,
        createCreatorFeedback,
        UpdateCodeInTellUsMoreForm,
        updateStepperStatus,
        checkStepperStatus,
        getMaxService,
        getAvgRating,
        getOrderStats,
        getEventReg,
        getMaxEvent,
        getViewsStats
      }}
    >
      {props.children}
    </creatorContext.Provider>
  );
};
export default CreatorState;
