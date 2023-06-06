import React from "react";
import "./Navbar.css";
import mixpanel from "mixpanel-browser";
import { useNavigate } from "react-router-dom";

function Navbar({noAccount = false}) {
  const navigate = useNavigate();

  // Functions --------------------
  const handleLogoClick = () => {
    mixpanel.track("header logo");
    navigate(`/`);
  };

  return (
    <>
      <section className="navbar_creator_wrapper01">
          <img
            src={require("../../../Utils/Images/logo-beta.png")}
            alt=""
            onClick={handleLogoClick}
          />

       {!noAccount && <button
          onClick={() => {
            mixpanel.track(`${localStorage.getItem("jwtToken") ? "My Account" : "Clicked Creator Login on Navbar"}`);
            localStorage.getItem("jwtToken") && localStorage.getItem("isUser") === ""
              ? window.open("/dashboard","_self")
              : localStorage.getItem("jwtToken") && localStorage.getItem("isUser") !== "" ? window.open(localStorage.getItem("url"),"_self") : window.open("/login/creators","_self")
          }}
        >
          {localStorage.getItem("jwtToken") ? "My Account" : "Creator's Login"}
        </button>}
      </section>
    </>
  );
}

export default Navbar;
