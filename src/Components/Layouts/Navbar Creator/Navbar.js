import React from "react";
import "./Navbar.css";
import mixpanel from "mixpanel-browser";
import { useNavigate } from "react-router-dom";
import { IoIosCall } from "react-icons/io";

function Navbar({
  noAccount = false,
  whiteTheme = false,
  requestCallBack = false,
  backgroundDark = false,
  setOpenCallbackModel,
  newfeature = false,
}) {
  const navigate = useNavigate();

  // Functions --------------------
  const handleLogoClick = () => {
    mixpanel.track("header logo");
    navigate(`/`);
  };

  return (
    <>
      <section
        className="navbar_creator_wrapper01"
        style={
          whiteTheme
            ? { background: "white" }
            : backgroundDark
            ? { background: "black" }
            : {}
        }
      >
        <img
          src={
            whiteTheme
              ? require("../../../Utils/Images/logo-beta-black.png")
              : require("../../../Utils/Images/logo-beta.png")
          }
          alt=""
          onClick={handleLogoClick}
        />

        <div>

          {/* new features ------------ */}
          <div>
          {newfeature && <button
            className="new_feature_button"
            onClick={() => {
              mixpanel.track("EPA header button");
              navigate("/earning-predictor");
            }}
          >
            {" "}
            <span>
              New
            </span>
            {window.screen.width > 650 ? "Earning Potential Analyzer" : "EPA"}
          </button>}
          </div>



          {/* Normal use buttons */}
          <section>
            {requestCallBack && (
              <button
                onClick={() => {
                  mixpanel.track("Request a call back header button");
                  setOpenCallbackModel(true);
                }}
              >
                {" "}
                <IoIosCall /> Request a call back
              </button>
            )}

            {!noAccount && (
              <button
                onClick={() => {
                  mixpanel.track(
                    `${
                      localStorage.getItem("jwtToken")
                        ? "My Account"
                        : "Clicked Creator Login on Navbar"
                    }`
                  );
                  localStorage.getItem("jwtToken") &&
                  localStorage.getItem("isUser") === ""
                    ? window.open("/dashboard", "_self")
                    : localStorage.getItem("jwtToken") &&
                      localStorage.getItem("isUser") !== ""
                    ? window.open(localStorage.getItem("url"), "_self")
                    : window.open("/login/creators", "_self");
                }}
              >
                {localStorage.getItem("jwtToken")
                  ? "My Account"
                  : "Creator's Login"}
              </button>
            )}
          </section>
          
        </div>
      </section>
    </>
  );
}

export default Navbar;
