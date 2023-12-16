import React, { useContext } from "react";
import { LoadThree } from "../Components/Modals/Loading";
import { useEffect } from "react";
import { linkedinContext } from "../Context/LinkedinState";
import { useNavigate } from "react-router-dom";

const Check = () => {
  const {
    loginlinkedinUser,
    usergooglelogin,
    creatorLinkedinLogin,
    creatorGoogleLogin,
  } = useContext(linkedinContext);
  const navigate = useNavigate();


   useEffect(() => {
    // for users only
    if (
      localStorage.getItem("isUser") === "true" &&
      localStorage.getItem("from")
    ) {
      if (localStorage.getItem("jwtToken")) {
        navigate(`${localStorage.getItem("url")}`);
      } else if (localStorage.getItem("from") === "linkedin") {
        loginlinkedinUser();
      } else {
        usergooglelogin();
      }
    }

    // for creators only
    else if (
      localStorage.getItem("isUser") === "" &&
      localStorage.getItem("from")
    ) {
      if (localStorage.getItem("jwtToken")) {
        navigate(`/dashboard`);
      } else if (localStorage.getItem("from") === "linkedin") {
        creatorLinkedinLogin();
      } else {
        creatorGoogleLogin();
      }
    }

    // for developers only
    else if (
      localStorage.getItem("isDev") === "true" &&
      localStorage.getItem("jwtTokenD")
    ) {
      console.log("Welcome Developers");
    }

    // not logined people
    else {
      if (localStorage.getItem("url")) {
        navigate(`${localStorage.getItem("url")}`);
      } else {
        navigate("/");
      }
    }
    // eslint-disable-next-line
  }, []);

  return <LoadThree />;
};

export default Check;
