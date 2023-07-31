import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Model.css";
import mixpanel from "mixpanel-browser";
import { feedbackcontext } from "../../Context/FeedbackState";
import {
  BsCloudDownload,
  BsLinkedin,
  BsTelegram,
  BsWhatsapp,
} from "react-icons/bs";
import { IoCopy } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";

function Thanks({ open, onClose, copyURL, slug, name, control, c_id, stype }) {
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

  const handlelinkedInshare = async () => {
    window.open(
      `http://www.linkedin.com/shareArticle?mini=true&url=https://anchors.in/s/${slug}&title=${name}&summary=Hey connections, Checkout this wonderful resource of ${name}&source=https://www.anchors.in/`,
      "MsgWindow",
      "width=100",
      "height=50"
    );
    mixpanel.track("Clicked Share on LinkedIn workshop", {
      service: slug,
    });
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
            <i className="fa-solid fa-cloud-arrow-down fa-xl"></i>
            <br />
            {stype === 1
              ? "Thanks for registering for workshop"
              : "Thanks for accessing..."}
          </span>
          <span className="thanks_model_content">
            {!request ? (
              <>
                Do you really think it can help to your friends? Share with
                friends
              </>
            ) : (
              "Do you want to get the services/workshops based on your personalised requests?"
            )}
          </span>
          <div className="thanks_model_button">
            {!request ? (
              <>
                <button className="whatsapp_btn" onClick={handleWhatsApp}>
                  <i className="fa-brands fa-whatsapp fa-xl"></i>&nbsp;WhatsApp
                </button>
                <button className="linkedin_btn" onClick={handlelinkedInshare}>
                  <i className="fa-brands fa-linkedin fa-lg"></i>&nbsp;LinkedIn
                </button>
              </>
            ) : (
              <button className="linkedin_btn" onClick={request_resource}>
                Request New Resources
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Thanks2({ open, onClose, copyURL, slug, name, cname, stype }) {
  const [shortLink, setShortLink] = useState("");

  useEffect(() => {
    const pattern = /go\.anchors\.in/;
    if (copyURL && pattern.test(copyURL)) {
      setShortLink(copyURL);
    } else {
      setShortLink(`https://www.anchors.in/s/${slug}`);
    }
  }, [copyURL, slug]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div onClick={onClose} className="logout_model_logout">
        <div className="thanks_start">
          {window.screen.width < 600 && (
            <div className="mobile_view_modal_horizonal_bar">
              <section></section>
            </div>
          )}
          <div className="logout_model_logout_first">
            <div className="logout_model_logout_first_cloud">
              <BsCloudDownload className="logout_model_logout_first_bscloud" />
            </div>
            <div className="logout_model_logout_first_close">
              <i className="fa-solid fa-xmark fa-lg" onClick={onClose}></i>
            </div>
          </div>
          <div className="logout_model_logout_second">Thanks for Accessing</div>
          <div className="logout_model_logout_third">
            Share this valuable resource with your friends and help them reap
            its benefits as well!
          </div>

          {/* <div className="logout_model_logout_button" onClick={handleWhatsApp}>
            Share
          </div> */}

          <div className="sharing_link_section_thanks_modal">
            <section>
              <input type="text" value={shortLink} disabled />
              <IoCopy
                onClick={() => {
                  navigator.clipboard.writeText(shortLink);
                  toast.info("Copied Message to Clipbboard");
                }}
              />
            </section>

            <div>
              <LinkedinShareButton
                url={shortLink}
                title={`Hey check this ${stype === 1 ? "sheet" : stype === 2 ? "video" : "document"} about *${name}*  by *${cname}* out. I found it really helpful!. Check it out at https://www.anchors.in/s/${slug}?utm_medium=linkedin&utm_source=linkedin&utm_campaign=company-question`}
                onClick={() => {
                  mixpanel.track("Clicked Share on LinkedIn workshop", {
                    service: slug,
                  });
                }}
              >
                <span>
                  <BsLinkedin color="white" />
                </span>
              </LinkedinShareButton>

              <WhatsappShareButton
                url={shortLink}
                title={`Hey check this ${stype === 1 ? "sheet" : stype === 2 ? "video" : "document"} about *${name}*  by *${cname}* out. I found it really helpful!. Check it out at https://www.anchors.in/s/${slug}?utm_medium=whatsapp&utm_source=wahtsapp&utm_campaign=company-question`}
                onClick={() => {
                  mixpanel.track("Shared On Whatsapp", {
                    service: slug,
                  });
                }}
              >
                <span>
                  <BsWhatsapp color="white" />
                </span>
              </WhatsappShareButton>

              <TelegramShareButton
                url={shortLink}
                title={`Hey check this ${stype === 1 ? "sheet" : stype === 2 ? "video" : "document"} about *${name}*  by *${cname}* out. I found it really helpful!. Check it out at https://www.anchors.in/s/${slug}?utm_medium=telegram&utm_source=telegram&utm_campaign=company-question`}
                onClick={() => {
                  mixpanel.track("Shared On Telegram", {
                    service: slug,
                  });
                }}
              >
                <span>
                  <BsTelegram color="white" />
                </span>
              </TelegramShareButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Thanks2;
