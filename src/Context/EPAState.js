import React, { createContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { host } from "../config/config";

export const EPAcontext = createContext();

const EPAState = (props) => {
  //1.  Save Leads Data -----------
  const saveLeads = async (name, email, number, verified, platformEnquired) => {
    const response = await fetch(`${host}/api/epa/saveEPALeades`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        number,
        verified,
        platformEnquired,
        status: 1,
        YoutubedataID: localStorage.getItem("tubeViewed"),
      }),
    });
    const json = await response.json();
    return json.success;
  };

  //2.  Save Youtube Data -------------
  const saveYoutubeData = async (
    channelTitle,
    channelId,
    subsCount,
    activeSubs,
    totalChannelViews,
    channelPublishDate,
    channelDatafromYoutube,
    status,
    channelActivities,
    earningPotentialData
  ) => {
    const response = await fetch(`${host}/api/epa/saveEPAYoutubeData`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        channelTitle,
        channelId,
        subsCount,
        activeSubs,
        totalChannelViews,
        channelPublishDate,
        channelDatafromYoutube,
        channelActivities,
        earningPotentialData,
        status,
      }),
    });
    const json = await response.json();
    localStorage.setItem("tubeViewed",json?.id)
    return json?.success;
  };

  return (
    <EPAcontext.Provider value={{ saveLeads,saveYoutubeData }}>
      {props.children}
    </EPAcontext.Provider>
  );
};

export default EPAState;
