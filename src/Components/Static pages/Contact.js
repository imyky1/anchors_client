import React from "react";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Navbar from "../Layouts/Navbar Creator/Navbar";
import { MainNewFooter } from "../Footer/Footer";
import "./Static.css"

const ContactSection = () => {
  return (
    <>
      <Navbar noAccount={true} backgroundDark={true} />

      <div className="static_pages_outer_wrapper">
        <h1 className="static_page_text_01">Contact Us</h1>

        <div className="cards_section_static_page">
          <div>

            <div>

            <h3 className="static_page_text_02">Reach Out</h3>

            <span><PhoneIcon/> Phone: 8692006538</span>
            <span><EmailIcon/> Email: info@anchors.in</span>
            </div>
          </div>

          <div>

          <div>
            <h3 className="static_page_text_02">Address</h3>

            <span><LocationOnIcon/> B-8, Basement Sector 2 Noida 201301</span>
            </div>
          </div>
        </div>
      </div>

      <MainNewFooter onEvents={true} />
    </>
  );
};

export default ContactSection;
