import React from "react";
import "./Navbar.css";
import mixpanel from "mixpanel-browser";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Functions --------------------
  const handleLogoClick = () => {
    mixpanel.track("Pricing Page LOGO clicked");
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

        <button
          onClick={() => {
            mixpanel.track("Clicked Creator's Login on Pricing Page");
            localStorage.getItem("jwtToken") && localStorage.getItem("isUser") === ""
              ? navigate("/dashboard")
              : localStorage.getItem("jwtToken") && localStorage.getItem("isUser") !== "" ? navigate(localStorage.getItem("url")) : navigate("/login/creators")
          }}
        >
          {localStorage.getItem("jwtToken") ? "My Account" : "Login"}
        </button>
      </section>
    </>
  );
}

export default Navbar;
