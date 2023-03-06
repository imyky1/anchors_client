import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Waitlist.css";
import { SuperSEO } from "react-super-seo";
import { createPopup } from "@typeform/embed";
import "@typeform/embed/build/css/popup.css";
import { toast, ToastContainer } from "react-toastify";

function Waitlist() {
  const navigate = useNavigate();
  //const { toggle } = createPopup("qTCuPV1C");


  return (
    <>
      <ToastContainer />
      <div className="signup_page">
        <div className="left_signup_side wailist_left_side">
          <Link to="/" style={{ textDecoration: "none", color: "unset" }}>
            <img
              className="logo_signup_page"
              src={require("../Main Page/Images/logo-beta.png")}
              alt=""
            />
          </Link>
          <img
            className="waitlist_img1"
            src={require("../Signup/images/signup1.png")}
            alt=""
          />
        </div>

        <div className="right_signup_side">
          <h1 className="wailist_header_01">
            Hey, Anchor
            <br />
            Thanks for showing interest to become{" "}
            <span style={{ color: "red" }}>Anchor</span>
          </h1>
          <div>
            <div className="wailist_para">
              <p>
                {" "}
                Please fill this form to get review of your profile and our team
                will get back to you if your profile get shortlisted to become
                anchor.
              </p>
              <span>
                *By filling this form increases the chance to become anchor
              </span>
            </div>
            <div className="signup_buttons">
              <button>Tell us about yourself</button>
            </div>
          </div>
        </div>
      </div>
      <SuperSEO title="Anchors - Waitlist" />
    </>
  );
}

export default Waitlist;
