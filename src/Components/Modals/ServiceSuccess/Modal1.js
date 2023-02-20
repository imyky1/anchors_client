import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";

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

          <i class="fa-solid fa-triangle-exclamation fa-3x"></i>
          <h1 className="text_success_05_modal">
            To access this feature please fill personal information
          </h1>

          <button
            onClick={() => {
              props.toClose();
              navigate("/newUi/editprofile");
            }}
          >
            Update Personal Information
          </button>
        </section>
      </div>
    </div>
  );
}

export default Modal1;
