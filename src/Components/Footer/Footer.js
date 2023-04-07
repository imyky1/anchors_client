import React, { useState } from "react";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import mixpanel from "mixpanel-browser";
//import { Modal, Fade, Typography, Box, Backdrop } from "@mui/material";

function Footer(props) {
  const navigate = useNavigate();



  return (
    <>
      <div className="main_footer_section">
        <div>
        {window.screen.width > 600 && <img className="logo_footer" src={require("../Main Page/Images/logo-beta.png")} alt="" />}
          <section className="upper_footer_section">
            <div className="anchors_details">
              <span>Monetize your <span style={{color:"rgba(255, 255, 255, 0.8)"}}>Content, skill, Expertise</span> and help your audience to grow.</span>
              <button
                onClick={() => {
                  navigate("/login/creators");
                }}
              >
                Become an Anchor
              </button>
            </div>
            <div className="footer_support_menu">
              <Link to="/pricing" target="_blank" rel="no_referrer" onClick={()=>{mixpanel.track("Clicked Pricing in footer from Landing Page")}}>
                Pricing
              </Link>

              <span onClick={(e)=>{e?.stopPropagation(); mixpanel.track("Clicked on Help in Landing Page");
                 props.openHelp()}}>Help & Support</span>

              {/* <Link to="/privacy-policy" target="_blank" rel="no_referrer">
                Terms & Conditions
              </Link> */}
              {/* <a
                href="https://www.linkedin.com/company/beanchorite/"
                target="_blank"
                rel="no_referrer"
              >
                Linkedin
              </a> */}
            </div>
            {window.screen.width < 600 &&  <img className="logo_footer" src={require("../Main Page/Images/logo-beta.png")} alt="" />}
          </section>
          <section className="some_extra">
          <i class="fa-brands fa-linkedin-in fa-xl" style={{cursor:"pointer",color:"white",marginBottom:"15px"}} onClick={()=>{window.open("https://www.linkedin.com/company/beanchorite/")}}></i>
          <span>Anchors.in All rights reserved</span>
          {window.screen.width > 600 && <span style={{textDecoration:"underline",cursor:"pointer"}} onClick={()=>{window.open("/privacy-policy")}}>Terms & privacy</span>}
          </section>
        </div>
        <section className="lower_footer_section">
            2023 &#169; &nbsp; anchors.in &nbsp; Made in &nbsp; <img className="india_logo" src={require("./India-logo.png")} alt="India" />
          </section>
      </div>
      
    </>
  );
}

export default Footer;
