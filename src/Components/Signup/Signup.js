import mixpanel from "mixpanel-browser";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import { host } from "../../config/config";
import "./Signup.css";

function Signup() {

  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Signup Page")

  }, [])

  const handleGoogle = async () => {
    localStorage.setItem("isUser", "");
    localStorage.setItem("from", "google");
    localStorage.setItem("authFor","signUp")
    window.open(`${host}/google/auth`, "_self");
  };

  const handlelinkedin = async () => {
    localStorage.setItem("isUser", "");
    localStorage.setItem("from", "linkedin");
    localStorage.setItem("authFor","signUp")
    window.open(`${host}/login/auth/linkedin`, "_self");
  };


  return (
    <>
    <div className="signup_page">
      <div className="left_signup_side"> 
      <Link to="/" style={{textDecoration:"none",color:"unset"}}><img
          className="logo_signup_page"
          src={require("../Main Page/Images/logo-beta.png")}
          alt=""
        /></Link>
        <img
          className="signup_img1"
          src={require("./images/signup1.png")}
          alt=""
        />
      </div>
      <div className="right_signup_side">
        <h1 className="signup_header_01">Kudos! You're already a cut above the rest.</h1>
        <div>
          <div className="signup_points">
            <section>
              <img src={require("./images/img1.png")} alt="" />
              <span>
              <b>anchors</b> is for EXCLUSIVE creators only. To join, there's an eligibility criteria everyone has to qualify
              </span>
            </section>
            <section>
              <img src={require("./images/img2.png")} alt="" />
              <span>
              Signing up using an INVITE CODE is preferred - it's faster & easier when someone vouches for you
              </span>
            </section>
            <section>
              <img src={require("./images/img3.png")} alt="" />
              <span>
              Ask existing anchors to share their Invite Code to avoid joining the waitlist. 
              </span>
            </section>
          </div>
          <div className="signup_buttons">
            <button onClick={handleGoogle}>
            <i class="fa-brands fa-google fa-m"></i> Continue with Google
            </button>
            <button onClick={handlelinkedin}>
              <i class="fa-brands fa-linkedin-in fa-m"></i> Continue with LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
    <SuperSEO
        title="Anchors - Signup Creators"
      />
    </>
  );
}

export default Signup;
