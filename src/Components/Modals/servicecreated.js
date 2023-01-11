import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// add to calender
import { atcb_action, atcb_init } from "add-to-calendar-button";
import "./Model.css";
import mixpanel from "mixpanel-browser";
import { feedbackcontext } from "../../Context/FeedbackState";
import { toast } from "react-toastify";

function ServiceCreated({
  open,
  onClose,
  Workshop,
  slug,
  time,
  content,
  progress,
}) {
  const { checkRequest } = useContext(feedbackcontext);
  const [request, setRequest] = useState(true); // request true means that request is not present in the database and false means that data is present
  const [sharescreen, setShareScreen] = useState(false);
  const handlecopyshare = () => {
    navigator.clipboard.writeText(
      `Checkout this live event -- *${Workshop?.sname}${" , "}
          Event description
          ${Workshop?.sdesc}
       at ${`https://www.anchors.in/r/${slug}`}`
    );
    toast.info("Copied to clipboard", {
      position: "top-left",
      autoClose: 3000,
    });
    window.open(
      `http://www.linkedin.com/shareArticle?mini=true&url=https://anchors.in/r/${slug}&title=${Workshop?.sname}&summary=${Workshop?.sdesc}&source=https://www.anchors.in/`,
      "MsgWindow",
      "width=100",
      "height=50"
    );
  };

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=Checkout this Important resource -- *${Workshop.name}* at https://www.anchors.in/s/${slug}?utm_medium=whatsapp&utm_source=wahtsapp&utm_campaign=company-question`
    );
    // mixpanel.track("Shared On Whatsapp", {
    //   service: slug,
    // });
  };

  const handleshare = async () => {
    setShareScreen(true);
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div onClick={onClose} className="logout_model_logout_workshop">
        <div
          onClick={(e) => e.stopPropagation()}
          className="workshops_create_model"
        >
          <i className="fa-solid fa-xmark fa-2x" onClick={onClose}></i>
          <span className="workshop_created_model">
            {sharescreen ? (
              ""
            ) : (
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <rect width="40" height="40" fill="url(#pattern0)" />
                <defs>
                  <pattern
                    id="pattern0"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlinkHref="#image0_1312_908"
                      transform="scale(0.00195312)"
                    />
                  </pattern>
                  <image
                    id="image0_1312_908"
                    width="512"
                    height="512"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            )}
            <br />
            {sharescreen
              ? "Share with your audience"
              : "Service Created Successfully"}
          </span>
          <span className="workshop_create_model_content">
            {sharescreen
              ? Workshop?.sdesc
              : "Please share with your audience and allow them to be part of this event"}
            <br />
            {sharescreen ? `${`https://www.anchors.in/r/${slug}`}` : ""}
          </span>
          {sharescreen ? (
            <div className="workshop_create_model_button">
              <button
                className="workshop_create_share_btn"
                onClick={handlecopyshare}
              >
                <svg
                  width="22"
                  height="20"
                  viewBox="0 0 22 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.625 21.875V23.8281C15.625 24.4753 15.1003 25 14.4531 25H1.17188C0.524658 25 0 24.4753 0 23.8281V5.85938C0 5.21216 0.524658 4.6875 1.17188 4.6875H4.6875V19.1406C4.6875 20.6484 5.91411 21.875 7.42188 21.875H15.625ZM15.625 5.07812V0H7.42188C6.77466 0 6.25 0.524658 6.25 1.17188V19.1406C6.25 19.7878 6.77466 20.3125 7.42188 20.3125H20.7031C21.3503 20.3125 21.875 19.7878 21.875 19.1406V6.25H16.7969C16.1523 6.25 15.625 5.72266 15.625 5.07812ZM21.5318 3.56304L18.312 0.343213C18.0922 0.123458 17.7941 1.62498e-06 17.4833 0L17.1875 0V4.6875H21.875V4.39165C21.875 4.08086 21.7515 3.7828 21.5318 3.56304Z"
                    fill="white"
                  />
                </svg>
                Copy and Share on Linkedin
              </button>
            </div>
          ) : (
            <div className="workshop-created-btns">
              <button
                className="workshop_create_share_btn"
                onClick={handleshare}
              >
                <svg
                  width="21"
                  height="17"
                  viewBox="0 0 21 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.0687 5.94702L13.3233 0.220453C12.7328 -0.280859 11.8022 0.126106 11.8022 0.904846V3.92112C5.64599 3.99041 0.764404 5.2034 0.764404 10.939C0.764404 13.2541 2.28138 15.5475 3.9582 16.7465C4.48147 17.1207 5.22721 16.6511 5.03428 16.0445C3.29643 10.5807 5.85855 9.1301 11.8022 9.04604V12.3586C11.8022 13.1385 12.7335 13.5437 13.3233 13.0429L20.0687 7.31581C20.493 6.95553 20.4936 6.30779 20.0687 5.94702Z"
                    fill="white"
                  />
                </svg>
                Share with your audience
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ServiceCreated;
