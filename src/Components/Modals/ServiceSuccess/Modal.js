import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";
import { BsCheckCircle } from "react-icons/bs";
import { IoCopy } from "react-icons/io5";

// This modal is the modal for Success for creation of services and also success for edit profile

function Modal(props) {
  const navigate = useNavigate();

  return (
    <div className="serviceSuccess_outside_container">
      <div className="serviceSuccess_container">
        <section
          style={
            props.type === "Profile Information" ||
            props?.buttonType === "preview"
              ? { height: "90%" }
              : {}
          }
        >
          <i
            className="fa-solid fa-xmark fa-lg serviceSuccessModal_cross"
            onClick={() => {
              props?.buttonType === "preview"
                ? props.onClose()
                : window.open("/dashboard", "_self");
            }}
          ></i>

          <img
            src="https://i.gifer.com/7efs.gif"
            alt=""
            className="success_tick_gif"
          />
          {props?.buttonType !== "preview" && (
            <h1 className="text_success_01_modal">Congratulations</h1>
          )}
          <span className="text_success_02_modal">
            {props.type === "Profile Information" // profile info success modal-------------
              ? "Profile Information Updated Successfully"
              : props?.buttonType === "preview"
              ? "Preview page created"
              : props.type === "Event"
              ? "Event Registered Successfully"
              : (props.type === "excel" // create service success modal -----------------
                  ? "Excel Sheet"
                  : props.type === "video"
                  ? "Video"
                  : "Document") + " Uploaded Successfully"}
          </span>
          <button
            onClick={() => {
              {
                props.type === "Profile Information"
                  ? props.firstTimeModalOpenDashboard
                    ? window.open("/dashboard?firstTime=true", "_self")
                    : window.open("/dashboard", "_self")
                  : props?.buttonType === "preview"
                  ? window.open(props?.link)
                  : navigate("/dashboard/mycontents");
              }
            }}
          >
            {props.type === "Profile Information"
              ? "Go to Dashboard"
              : props?.buttonType === "preview"
              ? "Check Preview"
              : "Go to My Content"}
          </button>
        </section>

        {props.type !== "Profile Information" &&
          props?.buttonType !== "preview" && (
            <div>
              <p className="text_success_03_modal">
                Shareable Link for your Audience
              </p>
              <section>
                <p className="text_success_04_modal">{props?.link}</p>
                <button
                  onClick={() => {
                    toast.info("Copied link successfully");
                    navigator.clipboard.writeText(props?.link);
                  }}
                >
                  Copy Link
                </button>
              </section>
            </div>
          )}
      </div>
    </div>
  );
}

const CongratsServiceCreation = ({ link }) => {
  const navigate = useNavigate();

  return (
    <div className="congratualtion_popup_outer">
      <div className="congratualtion_popup_inside">
        <div className="congratualtion_popup_inside_symbol">
          <BsCheckCircle
            className="congratualtion_popup_inside_symbol_design"
            size={50}
          />
        </div>
        <div className="congratualtion_popup_inside_symbol_middle">
          Congratulations
          <section>Event Created Successfully!</section>
        </div>
        <div className="congratualtion_popup_inside_symbol_last">
          <div
            className="congratualtion_popup_inside_symbol_last_01"
            onClick={() => {
              toast.info("Copied link successfully");
              navigator.clipboard.writeText(link);
            }}
          >
            {link}
            <IoCopy size={20} />
          </div>
          <button
            className="congratualtion_popup_inside_symbol_last_button"
            onClick={() => {
              navigate("/dashboard/mycontents");
            }}
          >
            Go to My Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

export const CongratsServiceModal = CongratsServiceCreation;
