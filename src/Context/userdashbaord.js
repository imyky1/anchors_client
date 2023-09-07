import React, { useState, createContext } from "react";
import { host } from "../config/config";

export const UserDashbaord = createContext();

const UserDashboardState = (props) => {
  const [userCreators, setUserCreators] = useState([]);
  const [alluserDocs, setallUserDocs] = useState([]);
  const [alluserWorkshops, setallUserWorkshops] = useState([]);

  const [totaluserorders, setTotalUserOrders] = useState(0);
  const [eventsUser, setEventsUser] = useState([]);

  // get all creators the user has subbed to
  const getallcreatorsofuser = async (isCreator) => {
    // USER LOGIN IS REQUIRED
    const response = await fetch(`${host}/api/userdashboard/getallcreators?creator=${isCreator ?? false}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    setUserCreators(json.creatorprofile);
    return json.success;
  };
  // get all user orders the user has placed to
  const getallordersofuser = async (isCreator) => {
    // USER LOGIN IS REQUIRED
    const response = await fetch(`${host}/api/userdashboard/getalluserorders?creator=${isCreator ?? false}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    setallUserDocs(json.docs);
    setallUserWorkshops(json.workshops);

    setTotalUserOrders(json.total);
    return json.success;
  };


  // get all user orders the user has placed to
  const getalleventsofuser = async (isCreator) => {
    // USER LOGIN IS REQUIRED
    const response = await fetch(`${host}/api/userdashboard/getalleventuserorders?creator=${isCreator ?? false}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    setEventsUser(json)
    return json.success;
  };

  return (
    <UserDashbaord.Provider
      value={{
        getallcreatorsofuser,
        userCreators,
        getallordersofuser,
        setallUserDocs,
        alluserDocs,
        alluserWorkshops,
        totaluserorders,
        eventsUser,
        setallUserWorkshops,
        getalleventsofuser
      }}
    >
      {props.children}
    </UserDashbaord.Provider>
  );
};
export default UserDashboardState;
