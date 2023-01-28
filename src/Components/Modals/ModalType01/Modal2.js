import React from "react";
import "./Modal.css";
import { createPopup } from '@typeform/embed'
import '@typeform/embed/build/css/popup.css'
import mixpanel from "mixpanel-browser";

function Modal2({ open, toClose }) {
  const { toggle } = createPopup('qTCuPV1C')

  const handleClick = () =>{
    mixpanel.track("Join Waitlist clicked on Failed Modal from Main Page");
    toClose()
    toggle()
  }

  if (!open) {
    return null;
  }


  return (
    <div className="mainpage_modal_outside">
      <div className="modal_mainpage">
        <i
          className="fa-solid fa-xmark cross_modal fa-lg"
          onClick={toClose}
        ></i>
        <section className="left_side_modal" style={{ minWidth: "37%" }}>
          <img src={require("./illust-2.png")} alt="" />
        </section>
        <section className="right_side_modal">
          <h1 className="modal_header_01">oops !</h1>
          <p>
            Thank you for your interest, you are currently not eligible for now
            but you can join the waitlist to be notified if you hit the
            subscriber or followers limit, you will be notified.{" "}
          </p>
          <br />
          <button className="button_modal_01" onClick={handleClick}>
            Join waitlist
          </button>
        </section>
        
      </div>
    </div>
  );
}

export default Modal2;
