import React, { useState } from "react";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
//import { Modal, Fade, Typography, Box, Backdrop } from "@mui/material";

function Footer() {
  const navigate = useNavigate();
  // Modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //if (
  //  localStorage.getItem("jwtToken") &&
  //  localStorage.getItem("isUser") === ""
  //) {
  //  return null;
  //}

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
              <Link to="/pricing" target="_blank" rel="no_referrer">
                Pricing
              </Link>

              <span onClick={handleOpen}>Help & Support</span>

              <Link to="/privacy-policy" target="_blank" rel="no_referrer">
                Terms & Conditions
              </Link>
              <a
                href="https://www.linkedin.com/company/beanchorite/"
                target="_blank"
                rel="no_referrer"
              >
                Linkedin
              </a>
            </div>
            {window.screen.width < 600 &&  <img className="logo_footer" src={require("../Main Page/Images/logo-beta.png")} alt="" />}
          </section>
          <section className="some_extra">
          <i class="fa-brands fa-linkedin-in fa-xl" style={{color:"white",marginBottom:"15px"}}></i>
          <span>Anchors.in All rights reserved</span>
          {window.screen.width > 600 && <span style={{textDecoration:"underline",cursor:"pointer"}}>Terms & privacy</span>}
          </section>
        </div>
        <section className="lower_footer_section">
            2023 &#169; &nbsp; anchors.in &nbsp; Made in &nbsp; <img className="india_logo" src={require("./India-logo.png")} alt="India" />
          </section>
      </div>
      {/* <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Team Anchors
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Facing any issue? email us - <b>support@anchors.in</b>, our team will surely get in touch with you as soon as possible.
            </Typography>
          </Box>
        </Fade>
      </Modal> */}
    </>
  );
}

export default Footer;
