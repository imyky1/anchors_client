import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";

// This modal is the successfull invite code in tell us more form

function InviteModal(props) {
  const navigate = useNavigate();

  return (
    <div className="serviceSuccess_outside_container">
      <div className="serviceSuccess_container">
        <section>
      <i
          className="fa-solid fa-xmark cross_modal fa-lg serviceSuccessModal_cross"
          onClick={props?.toClose}
        ></i>
          <img
            src="https://i.gifer.com/7efs.gif"
            alt=""
            className="success_tick_gif"
          />

          <h1 className="text_success_01_modal">
            Great news! Your invite code has been successfully applied
          </h1>
          <br />
          <span className="text_success_02_modal">
          Tips : Fill form to get approved directly
          </span>
        </section>
      </div>
    </div>
  );
}

export default InviteModal;
