import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Model.css";
import mixpanel from "mixpanel-browser";
import { feedbackcontext } from "../../Context/FeedbackState";

function Thanks({ open, onClose, copyURL, slug, name, control, c_id }) {
  const { checkRequest } = useContext(feedbackcontext);
  const [request, setRequest] = useState(true); // request true means that request is not present in the database and false means that data is present

  useEffect(() => {
    if (c_id) {
      checkRequest(c_id).then((e) => {
        setRequest(e.success);
      });
    }
  }, [c_id]);


  const handleWhatsApp = () => {
    copyURL
      ? window.open(
          `https://api.whatsapp.com/send?text=Checkout this Important resource -- *${name}* at https://www.anchors.in/r/${copyURL}?utm_medium=whatsapp&utm_source=wahtsapp&utm_campaign=company-question`
        )
      : window.open(
          `https://api.whatsapp.com/send?text=Checkout this Important resource -- *${name}* at https://www.anchors.in/s/${slug}?utm_medium=whatsapp&utm_source=wahtsapp&utm_campaign=company-question`
        );
    mixpanel.track("Shared On Whatsapp", {
      service: slug,
    });
  };

  const handleLinkedIn = async () => {
    const shareData = {
      title: `${name} at Anchors`,
      text: "Checkout this Important resource",
      url: copyURL
        ? `https://www.anchors.in/r/${copyURL}`
        : `https://www.anchors.in/s/${slug}`,
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(
        `Checkout this Important resource -- *${name}* at ${
          copyURL
            ? `https://www.anchors.in/r/${copyURL}`
            : `https://www.anchors.in/s/${slug}`
        }`
      );
      alert("Message has been copied, Do share it");
    }
  };

  const request_resource = async () => {
    onClose();
    control(true);
    mixpanel.track("Clicked on request resource model button", {
      service: slug,
    });
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div onClick={onClose} className="logout_model_logout">
        <div onClick={(e) => e.stopPropagation()} className="thanks_model ">
          <i className="fa-solid fa-xmark fa-2x" onClick={onClose}></i>
          <span className="thanks_model_header">
            <i class="fa-solid fa-cloud-arrow-down fa-xl"></i>
            <br />
            Thanks for downloading...
          </span>
          <span className="thanks_model_content">
            {!request ? (
              <>
                Do you really think it can help to your friends? Share
                with friends
              </>
            ) : (
              "Do you want to get the services based on your personalised requests?"
            )}
          </span>
          <div className="thanks_model_button">
            {!request ? <button className="whatsapp_btn" onClick={handleWhatsApp}>
            <i class="fa-brands fa-whatsapp fa-xl"></i>&nbsp;WhatsApp
          </button> :
            <button className="linkedin_btn" onClick={request_resource}>
              Request New Resources
            </button>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Thanks;
