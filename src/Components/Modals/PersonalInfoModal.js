import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Model.css";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";

function PersonalInfoModal({ open, allCreatorInfo }) {
  const navigate = useNavigate();

  // Disable right-click
  //document.addEventListener("contextmenu", (e) => e.preventDefault());
  //
  //function ctrlShiftKey(e, keyCode) {
  //  return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
  //}
  //
  //document.onkeydown = (e) => {
  //  // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
  //  if (
  //    e.keyCode === 123 ||
  //    ctrlShiftKey(e, "I") ||
  //    ctrlShiftKey(e, "J") ||
  //    ctrlShiftKey(e, "C") ||
  //    (e.ctrlKey && e.keyCode === "U".charCodeAt(0))
  //  )
  //    return false;
  //};

  //if (
  //  !open || (allCreatorInfo?.name && allCreatorInfo?.phone && allCreatorInfo?.tagLine && allCreatorInfo?.dob && allCreatorInfo?.aboutMe && allCreatorInfo?.linkedInLink)
  //) {
  //  return null;
  //}

  return (
    <div className=" logout_model_logout">
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal_type_1 fb_modal_main_box model_main_box "
      >
        <span className="modal_text_01">
          In order to use the platform further,
          <br /> fill all the mandatory personal information.
        </span>
        <div className="stars_model"></div>

        <div className="model_buttons">
          <button
            className="fb_model_button model_button "
            onClick={() => {
              navigate("/creator_info");
            }}
          >
            Fill the details
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoModal;
