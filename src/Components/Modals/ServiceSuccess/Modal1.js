import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";
import CloudRight from "./icons/cloud_right.svg"

// This modal is the modal for 
// - Warning of personal information of creator not filled i.e invite code not generated
// - Payment successfull info updation


function Modal1(props) {
  const navigate = useNavigate();

  return (
    <div className="serviceSuccess_outside_container">
      <div
        className="serviceSuccess_container"
        style={{ width: "600px", height: "396px" }}
      >
        <section style={{ height: "100%" }}>
          <i
            class="fa-solid fa-xmark fa-lg serviceSuccessModal_cross"
            onClick={() => {
              props.toClose();
            }}
          ></i>

          {props?.type==="Payment-Success" ?
           <img src="https://i.gifer.com/7efs.gif" alt="" className="success_tick_gif" /> :
          <i class="fa-solid fa-triangle-exclamation fa-3x"></i>}

          <h1 className="text_success_05_modal">
            {props?.type==="Payment-Success" ? "Payment Details Saved" : "To access this feature please fill personal information"}
          </h1>

          <button
            onClick={() => {
              props.toClose();
              props?.type==="Payment-Success" ? navigate("/paymentSummary") : navigate("/editprofile");
            }}
          >
            {props?.type==="Payment-Success" ? "Go to Payment Summary" : "Update Personal Information"}
          </button>
        </section>
      </div>
    </div>
  );
}

export default Modal1;
