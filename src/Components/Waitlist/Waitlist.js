import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Waitlist.css";

import { linkedinContext } from "../../Context/LinkedinState";

function Waitlist() {
  const { loginInfo } = useContext(linkedinContext);
  const navigate = useNavigate();
  const handleonClick = () => {
    navigate("https://izsxcwa0cfw.typeform.com/to/R9poKEJD");
  };

  return (
    <>
      <div className="waitlist">
        <div className="creator_login_header">
          <div className="logo">
            <img src={require("../logo.png")} alt="Logo" />
            <span>anchors</span>
          </div>
        </div>

        <div className="main_waitlist_page">
          <h1 style={{ textAlign: "left" }}>Hey, {loginInfo.name}</h1>
          <h1>
            Thanks for showing interest to become <span>Anchor</span>
          </h1>
          <p>
            Our Team will review your LinkedIn profile and inform you on the
            email if your profile is shortlisted for Anchorite.
          </p>
        </div>

        <div className="waitlist_form_button">
          <a
            className="waitlist_form_button_a"
            href="https://izsxcwa0cfw.typeform.com/to/R9poKEJD"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button> Let Us Know More About You</button>
          </a>

          <h2>This will increase your chance to become an Anchor</h2>
        </div>

        <div className="footer_service waitlist_footer">
          <a
            href="https://www.linkedin.com/company/beanchorite"
            target="_blank"
            rel="noreferrer"
          >
            <span>Follow us on LinkedIn</span>
          </a>
          <span>Facing any issue? email us - support@anchors.in</span>
        </div>
      </div>
    </>
  );
}

export default Waitlist;
