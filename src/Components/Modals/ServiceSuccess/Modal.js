import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";
import { BiCheckCircle } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEventSeat } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi2";

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

// Popup coming from down
const CongratsServiceCreation = ({ link, type, slug }) => {
  const navigate = useNavigate();

  return (
    <div className="model_outside_wrapper_success_modal">
      <div className="congratualtion_popup_outer">
        <div className="congratualtion_popup_inside">
          <RxCross2
            color="grey"
            style={{
              position: "absolute",
              right: "5vw",
              top: "40px",
              cursor: "pointer",
            }}
            size={25}
            onClick={() => {
              navigate("/dashboard");
            }}
          />
          <div className="congratualtion_popup_inside_symbol">
            <BiCheckCircle
              className="congratualtion_popup_inside_symbol_design"
              size={66}
              color="#10B981"
            />
          </div>
          <div className="congratualtion_popup_inside_symbol_middle">
            {type === "service" ? "Uploaded successfully" : "Congratulations"}
            <section>
              {type === "service"
                ? "Now its time to spread the word"
                : "Event Created Successfully!"}
            </section>
          </div>
          <div className="congratualtion_popup_inside_symbol_last">
            {type === "service" ? (
              <>
                <button
                  className="button_serviceModal_creation01"
                  onClick={() => {
                    toast.info("Copied link successfully");
                    navigator.clipboard.writeText(link);
                  }}
                >
                  Unique tracking link
                </button>
                <button
                  className="button_serviceModal_creation01"
                  onClick={() => {
                    navigate(`/dashboard/shareTemplate/${slug}`);
                  }}
                >
                  Get the message template
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Normal center popup-----

// used in 1. Service successfull creation
// 2. edit profile updated

const NewCongratsServiceCreation = ({
  link,
  type,
  slug,
  firstTimeModalOpenDashboard,
}) => {
  const navigate = useNavigate();

  const Data = {
    service: {
      text: "Uploaded successfully",
      subtext: "Now its time to spread the word",
      button1: {
        text: "Unique tracking link",
        action: () => {
          toast.info("Copied link successfully");
          navigator.clipboard.writeText(link);
        },
      },
      button2: {
        text: "Get the message template",
        action: () => {
          navigate(`/dashboard/shareTemplate/${slug}`);
        },
      },
      svgColor: "#10B981",
    },
    editProfile: {
      text: "Your profile has been updated",
      subtext: "Start selling your documents or events",
      button1: {
        text: "Create Event",
        icon : <MdOutlineEventSeat size={24}/>,
        action: () => {
          firstTimeModalOpenDashboard
            ? window.open("/dashboard?firstTime=true", "_self")
            : navigate(`/dashboard/createevent`);
        },
      },
      button2: {
        text: "Upload Document",
        icon:<HiDocumentText size={24}/>,
        action: () => {
          firstTimeModalOpenDashboard
            ? window.open("/dashboard?firstTime=true", "_self")
            : navigate("/dashboard", "_self");
        },
      },
      svgColor: "#F8F8F8",
    },
  };

  return (
    <div className="model_outside_wrapper_success_modal">
      <div className="new_congratualtion_popup_outer">
        <div className="congratualtion_popup_inside">
          <RxCross2
            className="chnageStatusModalCross"
            size={25}
            onClick={() => {
              navigate("/dashboard");
            }}
          />
          <div className="congratualtion_popup_inside_symbol">
            <BiCheckCircle
              className="congratualtion_popup_inside_symbol_design"
              size={66}
              color={Data[type].svgColor}
            />
          </div>
          <div className="new_congratualtion_popup_inside_symbol_middle">
            {Data[type].text}
            <section>{Data[type].subtext}</section>
          </div>
          <div className="congratualtion_popup_inside_symbol_last">
            <button
              className="button_serviceModal_creation01"
              onClick={Data[type].button1.action}
            >
              {Data[type].button1.icon && Data[type].button1.icon}
              {Data[type].button1.text}
            </button>
            <button
              className="button_serviceModal_creation01"
              onClick={Data[type].button2.action}
            >
              {Data[type].button2.icon && Data[type].button2.icon}
              {Data[type].button2.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

export const CongratsServiceModal = CongratsServiceCreation;
export const NewCongratsServiceModal = NewCongratsServiceCreation;
