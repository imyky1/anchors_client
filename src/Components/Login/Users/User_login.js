import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./User_login.css";
import { host } from "../../../config/config";
import mixpanel from "mixpanel-browser";
import {FcGoogle} from "react-icons/fc"
import {FaLinkedinIn} from "react-icons/fa"
import {RxCross2} from "react-icons/rx"

function User_login({ open, onClose }) {
  const location = useLocation();

  if (!open) {
    return null;
  }

  const handleGoogle = async () => {
    mixpanel.track("User login through Google", {
      user: "",
    });
    localStorage.setItem("isUser", true);
    localStorage.setItem("from", "google");
    localStorage.setItem("url", location.pathname);
    window.open(`${host}/google/auth`, "_self");
  };

  const _handlelinkedin = async () => {
    mixpanel.track("User login through Linkedin", {
      user: "",
    });
    localStorage.setItem("isUser", true);
    localStorage.setItem("from", "linkedin");
    localStorage.setItem("url", location.pathname);
    window.open(`${host}/login/auth/linkedin`, "_self");
  };

  return (
    <div className="userModalWrapper" onClick={onClose}>
      <div className="userModalBox" onClick={(e)=>e.stopPropagation()}>
        <RxCross2 className="userModalCross" onClick={onClose}/>
        {/* logo ------------- */}
        <section className="logo_user_modal">
          <img src={require("../../../Utils/Images/logo.png")} alt="" />
          <span>anchors</span>
        </section>

        <section className="userModal_text_02">Welcome you <span>🥳</span></section>

        <section className="userModal_text_03">
          Get Access to your services & exclusive good stuffs on your Dashboard.
        </section>

        <section className="userModal_text_04">Login or Signup</section>

        <section className="userModalbuttons">
          <button style={{backgroundColor:"#ff4050"}} onClick={handleGoogle}><FcGoogle/>Continue with Google</button>
          <button onClick={_handlelinkedin}><FaLinkedinIn style={{color:"#0A66C2"}}/>Continue with Linkedin</button>
          {/* <button>Continue with Truecaller</button> */}
        </section>

        <section className="userModal_text_05">
          By continuing, you acknowledge that you have read and understood, and
          agree to anchors <span onClick={()=>{window.open("/privacy-policy")}}> Terms of Service </span> and <span onClick={()=>{window.open("/privacy-policy")}}> Privacy Policy </span>.
        </section>
      </div>
    </div>
  );
}

export default User_login;
