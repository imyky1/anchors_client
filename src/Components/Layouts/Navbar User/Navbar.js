import mixpanel from "mixpanel-browser";
import "./Navbar.css";
import React, { useContext, useEffect, useState } from "react";
import User_login from "../../Login/Users/User_login";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../../Context/UserState";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PNGIMG from "../../../Utils/Images/default_user.png";
import { RxDashboard } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";

function Navbar({ slug, open, close }) {
  const [openModel, setOpenModel] = useState(false); // opens user login
  const [openUserMenu, setOpenUserMenu] = useState(false); // opens hamburger menu
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  // User context ---------------
  const { getUserDetails } = useContext(userContext);

  // Functions --------------------
  const handleLogoClick = () => {
    mixpanel.track(
      localStorage.getItem("jwtToken") &&
        localStorage.getItem("isUser") === true
        ? "User Dashboard from LOGO"
        : "Navbar logo clicked",
      {
        user: userDetails ? userDetails?.email : "",
      }
    );
    navigate(`/`);
  };

  const userlogout = () => {
    mixpanel.track("Logout");
    navigate("/logout");
  };

  // the user details-----------
  useEffect(() => {
    if (
      localStorage.getItem("jwtToken")
    ) {
      getUserDetails(localStorage.getItem("isUser") === "").then((e) => {
        if (e.success) {
          setUserDetails(e?.user);
        } else {
          toast.info("You are not login properly. Please login again!!");
        }
      });
    }
  }, []);

  // by default opens the user login modal
  useEffect(() => {
    if (open) {
      setOpenModel(true);
    }
  }, [open]);

  return (
    <>
      <User_login
        open={openModel}
        onClose={() => {
          close && close();
          setOpenModel(false);
        }}
      />
      <section className="top_header_creator_profile">
        <img
          className="logo_main_page"
          src={require("../../../Utils/Images/logo-invite-only.png")}
          alt=""
          onClick={handleLogoClick}
        />
        {localStorage.getItem("isUser") !== "" &&
          (!localStorage.getItem("jwtToken") ? (
            <button
              onClick={() => {
                mixpanel.track("Clicked Login button", {
                  creator: slug,
                });
                setOpenModel(true);
              }}
            >
              Signup
            </button>
          ) : (
            <LazyLoadImage
              src={userDetails?.photo}
              alt={userDetails?.name}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = PNGIMG
              }}
              className="navbar_user_profile"
              onClick={(e) => {
                e?.stopPropagation();
                setOpenUserMenu(!openUserMenu);
              }}
            />
          ))}

        {window.screen.width > 600 && openUserMenu && (
          <section
            className="listing_options_navbar"
            onClick={(e) => {
              e?.stopPropagation();
            }}
          >
            <span
              onClick={() => {
                mixpanel.track("Visit Dashboard");
                navigate("/");
              }}
            >
              Dashboard
            </span>
            <span onClick={userlogout}>Logout</span>
          </section>
        )}
      </section>

      {window.screen.width < 600 && openUserMenu && (
        <section className="mobile_listing_options_navbar">
          <div>
            <span
              onClick={() => {
                mixpanel.track("Visit Dashboard");
                navigate("/");
              }}
            >
              Dashboard
            </span>
            <span onClick={userlogout}>Logout</span>
          </div>
        </section>
      )}
    </>
  );
}

export const Navbar2 = ({ slug, open, close, noAccount=false,backgroundDark = false,noCloseLogin=false }) => {
  const [openModel, setOpenModel] = useState(false); // opens user login
  const [openUserMenu, setOpenUserMenu] = useState(false); // opens hamburger menu
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  // User context ---------------
  const { getUserDetails } = useContext(userContext);

  // controlls the closing of user menu
  openUserMenu &&
    document?.addEventListener("click", () => {
      setOpenUserMenu(false);
      // window.screen.width < 600 && enableScroll();
    });


  // Functions --------------------
  const handleLogoClick = () => {
    mixpanel.track(
      localStorage.getItem("jwtToken") &&
        localStorage.getItem("isUser") === true
        ? "User Dashboard from LOGO"
        : "Navbar logo clicked",
      {
        user: userDetails ? userDetails?.email : "",
      }
    );
    navigate(`/`);
  };

  const userlogout = () => {
    mixpanel.track("Logout");
    navigate("/logout");
  };

  // diabeling the scroll in mobile
  // function disableScroll() {
  //   // Get the current page scroll position
  //   let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  //   let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  //   // if any scroll is attempted,
  //   // set this to the previous value
  //   window.onscroll = function () {
  //     window.scrollTo(scrollLeft, scrollTop);
  //   };
  // }

  // function enableScroll() {
  //   window.onscroll = function () {};
  // }

  // the user details-----------
  useEffect(() => {
    if (
      localStorage.getItem("jwtToken") &&
      localStorage.getItem("isUser") === "true"
    ) {
      getUserDetails().then((e) => {
        if (e?.success) {
          setUserDetails(e?.user);
        } else {
          toast.info("You are not login properly. Please login again!!");
        }
      });
    }
  }, []);

  // by default opens the user login modal
  useEffect(() => {
    if (open) {
      setOpenModel(true);
    }
  }, [open]);

  return (
    <>
      <User_login
        open={openModel}
        onClose={() => {
          !noCloseLogin && close && close();
          !noCloseLogin && setOpenModel(false);
        }}
      />

      <div className="header_section_new_ui_event_page" style={backgroundDark ? {backgroundColor:"#101010"} : {}}>
        <div>
        <img
          src={require("../../../Utils/Images/logo-invite-only.png")}
          alt=""
          onClick={handleLogoClick}
          />
          </div>

        {localStorage.getItem("isUser") !== "" && (!noAccount ?  
          (!localStorage.getItem("jwtToken") ? (
            <button
              onClick={() => {
                mixpanel.track("Clicked Login button", {
                  creator: slug,
                });
                setOpenModel(true);
              }}
            >
              Login
            </button>
          ) : (
            <LazyLoadImage
              src={userDetails?.photo}
              alt={userDetails?.name}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = PNGIMG
              }}
              className="navbar_user_profile"
              onClick={(e) => {
                e?.stopPropagation();
                setOpenUserMenu(!openUserMenu);
                // window.screen.width < 600 && disableScroll();
              }}
            />
          )) : "" )}

        {openUserMenu && (
          <section
            className="listing_options_navbar"
            onClick={(e) => {
              e?.stopPropagation();
            }}
          >
            <span
              onClick={() => {
                mixpanel.track("Visit Dashboard");
                navigate("/");
              }}
            >
              <RxDashboard/> Dashboard
            </span>
            <span onClick={userlogout}><FiLogOut/> Logout</span>
          </section>
        )}
      </div>

    </>
  );
}


export default Navbar;
