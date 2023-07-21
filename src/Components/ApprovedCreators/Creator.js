import React, { useState } from "react";
import "./creator.css";
import Frame from "./frame.js";
import Navbar from "../Layouts/Navbar Creator/Navbar.js";
import run from "./run.png";
import { LoadThree } from "../Modals/Loading";
import { AiOutlineClose } from "react-icons/ai";
import { IoCopy } from "react-icons/io5";
import { BsLinkedin, BsTelegram } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import { LinkedinShareButton, TelegramShareButton } from "react-share";
import { Footer3 } from "../Footer/Footer2";

const ShareModal = ({ onClose }) => {
  const Data =
    "Hey fellow creators! I'm looking to join Anchors. If you have an invite code to share, I'd be so grateful! Let's connect and support each other in growing our audiences and our impact. Thanks in advance for your help!";

  return (
    <div className="share_modal_approved_creators">
      <div>
        <section className="share_modal_approved_Creators_section01">
          <span>Share this message</span>
          <AiOutlineClose onClick={onClose} />
        </section>

        <p>Share this on your social handle to get the code</p>
        <div>
          {Data}
          <IoCopy
            onClick={() => {
              navigator.clipboard.writeText(Data);
              toast.info("Copied Message to Clipbboard");
            }}
          />
        </div>

        <section className="socials_approved_creators_message">
          <LinkedinShareButton title={Data} url="https://www.anchors.in">
            <div>
              <BsLinkedin color="rgba(0, 102, 153, 1)" />
            </div>
          </LinkedinShareButton>

          <TelegramShareButton title={Data} url="https://www.anchors.in">
            <div>
              <BsTelegram color="rgba(52, 170, 223, 1)" />
            </div>
          </TelegramShareButton>
        </section>
      </div>
    </div>
  );
};

const Creator = () => {
  const [loading, setLoading] = useState(false);
  const [openShareMessage, setOpenShareMessage] = useState(false);

  if (
    !localStorage.getItem("jwtToken") ||
    localStorage.getItem("isUser") !== ""
  ) {
    window.open("/", "_self");
    return null;
  }

  return (
    <>
      {loading && <LoadThree />}

      <ToastContainer />

      {openShareMessage && (
        <ShareModal
          onClose={() => {
            setOpenShareMessage(false);
          }}
        />
      )}

      <div style={{ background: "#101010", overflow: "hidden" }}>
        <Navbar />
        <div className="upper_01">
          <div className="invite">Invite Code</div>
          <p className="details">
            To gain access to Anchors and receive an invitation code, you can
            contact an Approved Creator and request an invite code. By obtaining
            an invite code from an Approved Creator, you not only gain entry
            into Anchors but also receive their endorsement of your talent and
            potential. This endorsement signifies your abilities and the value
            you can contribute to the Anchors community.
          </p>
        </div>
        <div className="body">
          <div className="body_01">Our Approved Creators</div>
          <Frame setLoading={setLoading} />
        </div>
        <div className="last_01">
          <div className="left_frame">
            <div className="left_text">Don't wait any longer!</div>
            <div className="left_details">
              Why wait when you can move up the waitlist by using the invite
              code. Request for an Invite Code by clicking on the button below!
            </div>
            <button
              className="button_left"
              onClick={() => {
                setOpenShareMessage(true);
              }}
            >
              Get Invite Code
            </button>
          </div>
          <div className="right">
            <img src={run} />
          </div>
        </div>
      </div>

      <Footer3 />
    </>
  );
};

export default Creator;
