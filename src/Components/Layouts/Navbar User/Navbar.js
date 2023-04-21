import mixpanel from "mixpanel-browser";
import "./Navbar.css";
import React, { useEffect, useState } from "react";
import User_login from "../../Login/Users/User_login";
import { useNavigate } from "react-router-dom";
import Hamburger from "hamburger-react";

function Navbar({ UserDetails, slug, open ,close }) {
  const [openModel, setOpenModel] = useState(false); // opens user login
  const [openUserMenu, setOpenUserMenu] = useState(false); // opens hamburger menu
  const navigate = useNavigate();

  // Functions --------------------
  const handleLogoClick = () => {
    mixpanel.track("User Dashboard from LOGO", {
      user: UserDetails ? UserDetails : "",
    });
    navigate(`/`);
  };

  const userlogout = () => {
    navigate("/logout");
  };

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
          close && close()
          setOpenModel(false);
        }}
      />
      <section className="top_header_creator_profile">
        {window.screen.width > 550 ? (
          <img
            className="logo_main_page"
            src={require("../../../Utils/Images/logo-beta.png")}
            alt=""
            onClick={handleLogoClick}
          />
        ) : (
          <img
            className="logo_main_page"
            src={require("../../../Utils/Images/logo-beta-black.png")}
            alt=""
            onClick={handleLogoClick}
          />
        )}
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
            <span>
              {localStorage.getItem("user")?.slice(0, 12) ===
              localStorage.getItem("user")
                ? localStorage.getItem("user")
                : localStorage.getItem("user")?.slice(0, 12) + ".."}
              &nbsp;
              {window.screen.width > 700 ? (
                <i
                  className="fa-solid fa-caret-down"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOpenUserMenu(!openUserMenu);
                  }}
                ></i>
              ) : (
                <Hamburger
                  className="hamburger-react"
                  size={20}
                  onToggle={(toggled) => {
                    if (toggled) {
                      setOpenUserMenu(true);
                    } else {
                      setOpenUserMenu(false);
                      // close a menu
                    }
                  }}
                />
              )}
              {window.screen.width > 700
                ? openUserMenu && (
                    <button
                      className="logout_button_header"
                      onClick={userlogout}
                    >
                      Logout
                    </button>
                  )
                : openUserMenu && (
                    <ul className="hamburger_menu_profile">
                      <li className="hamburger_item" onClick={userlogout}>
                        Logout
                      </li>
                    </ul>
                  )}
            </span>
          ))}
      </section>
    </>
  );
}

export default Navbar;
