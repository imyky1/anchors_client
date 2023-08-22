import React from "react";
import "./Footer.css";
import {MdEventSeat} from "react-icons/md"

function Footer2() {
  return (
    <div className="footer_user_side_anchors">
      <img
        className="footer-section_logo_02"
        src={require("./logo-beta-black.png")}
        alt=""
      />
      <span className="lower_footer_section_02">
        2023 &#169; &nbsp;anchors.in &nbsp; Made in &nbsp;{" "}
        <img
          className="india_logo"
          src={require("./India-logo.png")}
          alt="India"
        />
      </span>
    </div>
  )
}


export const Footer3 = ({hostEventButton = false}) => {
  return (
    <div className="footer_user_side_anchors2">
      <img src={require("../../Utils/Images/logo-invite-only.png")} alt="" />

      <span>2023 © anchors.in | Made in India</span>

      {window.screen.width > 600 && hostEventButton && <button onClick={()=>{window.open("/hostevent","_self")}}><MdEventSeat/> Host Your Own Event</button>}
    </div>
  )
}

export default Footer2;
