import React, { useContext, useEffect, useState } from "react";
import { linkedinContext } from "../../Context/LinkedinState";
import { atcb_action, atcb_init } from "add-to-calendar-button";
import { InlineShareButtons } from "sharethis-reactjs";
import "./teststyle.css";

import "add-to-calendar-button/assets/css/atcb.css";
import { FormHelperText } from "@mui/material";

function Test() {
  const { truecallerlogin, truecallervalue } = useContext(linkedinContext);

  const handleClick = async () => {
    await truecallerlogin();
  };
  const handlewhatsappshare = async () => {
    window.open(
      `https://api.whatsapp.com/send?text=Checkout this Important resource -- ** at https://www.anchors.in/w/workshopname`,
      "MsgWindow",
      "width=100",
      "height=50"
    );
  };

  const handlelinkedInshare = async () => {
    window.open(
      `http://www.linkedin.com/shareArticle?mini=true&url=https://anchors.in/w/how-to-make-custom-linkedin-share-button&title=How%20to%20make%20custom%20linkedin%20share%20button&summary=some%20summary%20if%20you%20want&source=stackoverflow.com`
    );
  };

  return (
    <div className="test">
      <button onClick={handleClick}>Login through Truecaller</button>
      <div className="response">
        <h1>{truecallervalue ? "something" : "nothing yet..."}</h1>
        <div>{truecallervalue?.success}</div>
        <h2>PHONE NO .. - {truecallervalue.userdata?.phoneNumbers}</h2>
        <p>
          NAME -{" "}
          {truecallervalue.userdata?.name?.first +
            " " +
            truecallervalue.userdata?.name?.last}
        </p>
        <p>EMAIL - {truecallervalue.userdata?.onlineIdentities?.email}</p>
      </div>
      <div></div>
      <div class="btn_wrap_share">
        <span>Share</span>
        <div class="container_buttons_share">
          <i onClick={handlelinkedInshare} class="fab fa-linkedin"></i>
          <i onClick={handlewhatsappshare} class="fab fa-whatsapp"></i>
        </div>
      </div>
      <div class="TN bzz aHS-YH">
        <div class="qj qr"></div>
        <div class="aio UKr6le">
          <span class="nU false">
            <a
              href="https://meet.google.com/new?hs=180&amp;authuser=0"
              target="_top"
              class="J-Ke n0"
              title="Start a meeting"
              aria-label="Start a meeting"
              draggable="false"
            >
              Start a meeting
            </a>
          </span>
        </div>
        <div class="nL aif"></div>
      </div>
    </div>
  );
}

export default Test;
