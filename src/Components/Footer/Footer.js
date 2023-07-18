import React, { useState } from "react";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import mixpanel from "mixpanel-browser";
import HelpModal from "../Modals/ModalType01/HelpModal";
//import { Modal, Fade, Typography, Box, Backdrop } from "@mui/material";

function Footer() {
  const navigate = useNavigate();

  const [openHelpModal, setopenHelpModal] = useState(false)


  return (
    <>
    <HelpModal open={openHelpModal} toClose={()=>{setopenHelpModal(false)}}/>
      <div className="main_footer_section">
        <div>
        {window.screen.width > 600 && <img className="logo_footer" src={require("../Main Page/Images/logo-beta.png")} onClick={()=>{mixpanel.track("footer logo")}} alt="" />}
          <section className="upper_footer_section">
            <div className="anchors_details">
              {/* <span>Monetize your <span style={{color: "rgb(255 255 255)",fontWeight: "600"}}>Content, skill, Expertise</span> and help your audience to grow.</span> */}
              <span>An invite-only exclusive platform  for premium creators</span>
              <button
                onClick={() => {
                  navigate("/login/creators");
                  mixpanel.track("join anchors footer")
                }}
              >
               Join Exclusive Community
              </button>
            </div>
            <div className="footer_support_menu">
              <Link to="/aboutUs" target="_blank" rel="no_referrer" onClick={()=>{mixpanel.track("Clicked about us in footer from Landing Page")}}>
                About Us
              </Link>

              {window.location.pathname !== "/pricing" && <Link to="/pricing" target="_blank" rel="no_referrer" onClick={()=>{mixpanel.track("Clicked Pricing in footer from Landing Page")}}>
                Pricing
              </Link>}

              <Link to="/contactUs" target="_blank" rel="no_referrer" onClick={()=>{mixpanel.track("Clicked contact us in footer from Landing Page")}}>
                Contact Us
              </Link>

              <Link to="/refundPolicy" target="_blank" rel="no_referrer" onClick={()=>{mixpanel.track("Clicked refund policy in footer from Landing Page")}}>
                Refund Policy
              </Link>

              <Link to="/privacy-policy" target="_blank" rel="no_referrer" onClick={()=>{mixpanel.track("Clicked Privacy policy in footer from Landing Page")}}>
                Privacy Policy
              </Link>

              <Link to="/termsConditions" target="_blank" rel="no_referrer" onClick={()=>{mixpanel.track("Clicked Terms and Condition in footer from Landing Page")}}>
                Terms & Conditions
              </Link>

              {/* <span onClick={(e)=>{e?.stopPropagation(); mixpanel.track("Clicked on Help in Landing Page");
                 setopenHelpModal(true)}}>Help & Support</span> */}

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
            {window.screen.width < 600 &&  <img className="logo_footer" src={require("../Main Page/Images/logo-beta.png")} onClick={()=>{mixpanel.track("footer logo")}} alt="" />}
          </section>
          <section className="some_extra">
          <i className="fa-brands fa-linkedin-in fa-xl" style={{cursor:"pointer",color:"white",marginBottom:"15px"}} onClick={()=>{window.open("https://www.linkedin.com/company/beanchorite/")}}></i>
          <span>Anchors.in All rights reserved</span>
          {/* {window.screen.width > 600 && <span style={{textDecoration:"underline",cursor:"pointer"}} onClick={()=>{window.open("/termsConditions");mixpanel.track("Privacy policy")}}>Terms of use</span>} */}
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
