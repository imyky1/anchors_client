import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";
import CloudRight from "./icons/cloud_right.svg";
import { BsCloudArrowDown } from "react-icons/bs";
import { IoCopy } from "react-icons/io5";

// This modal is the status changing modal of any service or reviews etc...

function Modal2(props) {
  const navigate = useNavigate();

  return (
    <div className="serviceSuccess_outside_container">
      <div className="serviceSuccess_container">
        <section style={props.ChangeStatusTo === 0 ? { height: "100%" } : {}}>
          <i
            class="fa-solid fa-xmark fa-lg serviceSuccessModal_cross"
            onClick={() => {
              props.toClose();
            }}
          ></i>

          <img src={CloudRight} alt="" style={{ marginBottom: "18px" }} />
          <h1 className="text_success_01_modal">
            Content {props.ChangeStatusTo === 0 ? "Inactive" : "Active"}
          </h1>
          <span
            className="text_success_02_modal"
            style={{ margin: "10px 0", width: "70%" }}
          >
            Your content is now{" "}
            {props.ChangeStatusTo === 0 ? "inactive" : "active"} and is{" "}
            {props.ChangeStatusTo === 0 ? "not available" : "available"} for
            your auidence
          </span>

          {/* <button
            onClick={() => {
              props.toClose();
              navigate("/editprofile");
            }}
          >
            Update Personal Information
          </button> */}
        </section>

        {props.ChangeStatusTo === 1 && (
          <div>
            <p className="text_success_03_modal">
              Shareable Link for your Audience
            </p>
            <section>
              <p className="text_success_04_modal">
                {props?.url?.length > 7
                  ? props?.url
                  : `https://www.anchors.in/r/${props.url}`}
              </p>
              <button
                onClick={() => {
                  toast.info("Copied link successfully");
                  {
                    props?.url?.length > 7
                      ? navigator.clipboard.writeText(props.url)
                      : navigator.clipboard.writeText(
                          `https://www.anchors.in/r/${props.url}`
                        );
                  }
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

const ChangeStatusModal = ({ ChangeStatusTo, url, toClose }) => {
  return (
    <div className="congratualtion_popup_outer">
      <div className="congratualtion_popup_inside">
        <i
          class="fa-solid fa-xmark fa-xl chnageStatusModalCross"
          onClick={() => {
            toClose()
          }}
        ></i>
        <div className="congratualtion_popup_inside_symbol">
          <BsCloudArrowDown
            className="congratualtion_popup_inside_symbol_design"
            size={50}
          />
        </div>
        <div className="congratualtion_popup_inside_symbol_middle">
          Content {ChangeStatusTo === 0 ? "Inactive" : "Active"}
          <section>
            Your content is now {ChangeStatusTo === 0 ? "inactive" : "active"}{" "}
            and will {ChangeStatusTo === 0 ? "not be visible" : "visible"} to
            your auidence
          </section>
        </div>

        {ChangeStatusTo === 1 && (
          <div className="congratualtion_popup_inside_symbol_last">
            <div
              className="congratualtion_popup_inside_symbol_last_01"
              onClick={() => {
                toast.info("Copied link successfully");
                {
                  url?.length > 7
                    ? navigator.clipboard.writeText(url)
                    : navigator.clipboard.writeText(
                        `https://www.anchors.in/e/${url}`
                      );
                }
              }}
            >
              {url}
              <IoCopy size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal2;
export const ChangeStatus = ChangeStatusModal;
