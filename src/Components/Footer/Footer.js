import React, { useState } from "react";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Fade, Typography, Box, Backdrop } from "@mui/material";

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
          <section className="upper_footer_section">
            <div className="anchors_details">
              <span>
                <img src={require("../logo.png")} alt="logo" />
                anchors
              </span>
              <span>Start Monetizing your time</span>
              <button
                onClick={() => {
                  navigate("/login/creators");
                }}
              >
                Become Anchor <i class="fa-solid fa-arrow-right-long fa-l"></i>
              </button>
            </div>
            <div className="footer_support_menu">
              <Link to="/pricing" target="_blank" rel="no_referrer">
                Pricing
              </Link>

              <span onClick={handleOpen}>
                Help & Support
              </span>

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
          </section>
          <section className="lower_footer_section">
            &#169; 2022 &nbsp;&#9679;&nbsp; anchors.in &nbsp;&#9679;&nbsp; MADE
            IN INDIA
          </section>
        </div>
      </div>
      <Modal
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
      </Modal>
    </>
  );
}

export default Footer;
