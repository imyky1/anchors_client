import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";

// This modal is the modal for Success for creation of services and also success for edit profile

function Modal(props) {
  const navigate = useNavigate();

  return (
    <div className="serviceSuccess_outside_container">
      <div className="serviceSuccess_container">
        <section style={props.type === "Profile Information" ? {height:"90%"} : {}}>
          <i
            className="fa-solid fa-xmark fa-lg serviceSuccessModal_cross"
            onClick={() => {
              window.open("/dashboard","_self")
            }}
          ></i>

           <img src="https://i.gifer.com/7efs.gif" alt="" className="success_tick_gif" />
          <h1 className="text_success_01_modal">Congratulations</h1>
          <span className="text_success_02_modal">
            {props.type === "Profile Information"         // profile info success modal-------------
              ? "Profile Information Updated Successfully"
              : (props.type === "excel"       // create service success modal -----------------
                  ? "Excel Sheet"
                  : props.type === "video"
                  ? "Video"
                  : "Document") + " Uploaded Successfully"}
          </span>
          <button
            onClick={() => {
              {props.type === "Profile Information" ? window.open("/dashboard","_self") : navigate("/mycontents")};
            }}
          >
            {props.type === "Profile Information" ? "Go to Dashboard" : "Go to My Content"}
          </button>
        </section>

        {props.type !== "Profile Information" && <div>
          <p className="text_success_03_modal">
            Shareable Link for your Audience
          </p>
          <section>
            <p className="text_success_04_modal">
              {`https://www.anchors.in/r/${props.link}`}
            </p>
            <button
              onClick={() => {
                toast.info("Copied link successfully");
                navigator.clipboard.writeText(
                  `https://www.anchors.in/r/${props.link}`
                );
              }}
            >
              Copy Link
            </button>
          </section>
        </div>}
      </div>
    </div>
  );
}

export default Modal;
