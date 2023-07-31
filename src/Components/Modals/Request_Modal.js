import React, { useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import { toast } from "react-toastify";
import { useContext } from "react";
import { feedbackcontext } from "../../Context/FeedbackState";
import { BiLaptop, BiRupee } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";


function Request_Modal2({ open, onClose, slug, id, cname, UserDetails }) {
  const { createRequest } = useContext(feedbackcontext);
  const [requestQuery, setRequestQuery] = useState("");
  const [amount, setAmount] = useState(null);
  const [service, setService] = useState(null);

  const amountSetter = (item) => {
    document.getElementById("49").style.border =
      "1px solid var(--neutral-gray-600, #475569)";
    document.getElementById("99").style.border =
      "1px solid var(--neutral-gray-600, #475569)";
    document.getElementById("199").style.border =
      "1px solid var(--neutral-gray-600, #475569)";
    document.getElementById("custom").style.border =
      "1px solid var(--neutral-gray-600, #475569)";

    document.getElementById("amount").style.display = "none";

    if (item === 1) {
      setAmount(49);
      document.getElementById("49").style.border = "1px solid white";
    } else if (item === 2) {
      setAmount(99);
      document.getElementById("99").style.border = "1px solid white";
    } else if (item === 3) {
      setAmount(199);
      document.getElementById("199").style.border = "1px solid white";
    } else {
      setAmount(0);
      document.getElementById("custom").style.border = "1px solid white";
      document.getElementById("amount").style.display = "flex";
    }
  };

  const handleSubmit = (e) => {
    mixpanel.track("Submitting the Request through Modal");
    e.preventDefault();

    if (requestQuery.length < 2) {
      toast.error("Please provide proper message for your request!", {
        position: "top-center",
        autoClose: 2500,
      });
      return;
    }

    if (amount === null || isNaN(amount)) {
      toast.error("Please provide amount!", {
        position: "top-center",
        autoClose: 2500,
      });
      return;
    }

    if (amount > 100000) {
      toast.error("Maximum amount cannot exceed 100000!", {
        position: "top-center",
        autoClose: 2500,
      });
      return;
    }

    createRequest(
      id,
      requestQuery,
      amount === 0 || !amount ? false : true,
      amount ? amount : 0,
      service
    ).then((e) => {
      if (e.error === "This action requires the user to login") {
        toast.error("Please login to proceed!", {
          position: "top-center",
          autoClose: 2500,
        });
        setRequestQuery("");
        onClose();
      } else if (e.success) {
        toast.success("Request Captured Successfully", {
          position: "top-center",
          autoClose: 2500,
        });
        setRequestQuery("");
        setService("")
        setAmount(0)
        onClose();
      } else if (e.already) {
        toast.info("You had already passed a request to the creator", {
          position: "top-center",
          autoClose: 2500,
        });
        onClose();
      } else {
        toast.error("Some error occured, try again after some time!!", {
          position: "top-center",
          autoClose: 2500,
        });
      }
    });
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="main-req-resource-cover"
      onClick={() => {
        mixpanel.track("Request Resource Model Close", {
          user: UserDetails,
          service: slug,
        });
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="request-resources-modal-container"
      >
        {window.screen.width < 600 && <div className="mobile_view_modal_horizonal_bar">
          <section></section>
          </div>}
        <div className="req-res-body-wrap">
          <span className="req-res-header">
            Request Resources
            <div className="req-resource-popup-cancel">
              {" "}
              <i
                className="fa-solid fa-xmark fa-xl"
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => {
                  mixpanel.track("Request Resource Model Close", {
                    user: UserDetails,
                    service: slug,
                  });
                  onClose();
                }}
              ></i>
            </div>
          </span>
          <span className="req-res-body-first">
            Please share your request with {cname.split(" ")[0]} and inform them
            about the resource you need.
          </span>
          <div className="modal_frame_01_types">
            <div className="modal_frame_01_types_inside_01">
              <div className="modal_frame_01_types_inside_01_text">
                Select your type of service
              </div>
              <div className="modal_frame_01_types_inside_01_frame">
                <div
                  className="modal_frame_01_types_inside_01_frame_01"
                  style={
                    service === "document"
                      ? { background: "var(--neutral-gray-100, #F1F5F9)" }
                      : {}
                  }
                  onClick={() => {
                    mixpanel.track("Select Event");
                    setService("document");
                  }}
                >
                  <CgFileDocument
                    style={service === "document" ? { color: "black" } : {}}
                  />
                  <div
                    className="modal_frame_01_types_inside_01_frame_01_text1"
                    id="document"
                    style={service === "document" ? { color: "black" } : {}}
                  >
                    Document
                  </div>
                </div>
                <div
                  className="modal_frame_01_types_inside_01_frame_01"
                  style={
                    service === "event"
                      ? { background: "var(--neutral-gray-100, #F1F5F9)" }
                      : {}
                  }
                  onClick={() => {
                    mixpanel.track("Select Event");
                    setService("event");
                  }}
                >
                  <BiLaptop
                    style={service === "event" ? { color: "black" } : {}}
                  />
                  <div
                    className="modal_frame_01_types_inside_01_frame_01_text1"
                    id="event"
                    style={service === "event" ? { color: "black" } : {}}
                  >
                    Event
                  </div>
                </div>
              </div>
              <div className="modal_frame_01_types_inside_01_frame01">
                <div className="modal_frame_01_types_inside_01_frame01_text">
                  Topic Name
                </div>
                <div className="modal_frame_01_types_inside_01_frame01_textarea">
                  <input
                    type="text"
                    placeholder="DSA"
                    value={requestQuery}
                    onChange={(e) => {
                      setRequestQuery(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="modal_frame_01_types_inside_01_frame02">
                <div className="modal_frame_01_types_inside_01_frame02_01">
                  <div className="modal_frame_01_types_inside_01_frame02_01_text">
                    Cost
                  </div>
                  <div className="modal_frame_01_types_inside_01_frame02_01_cost">
                    <div
                      className="modal_frame_01_types_inside_01_frame02_01_cost1"
                      id="49"
                      onClick={() => {
                        mixpanel.track("Select Amount");
                        amountSetter(1);
                      }}
                    >
                      <BiRupee
                        style={{
                          height: "20px",
                          width: "20px",
                          color: "white",
                        }}
                      />{" "}
                      49
                    </div>
                    <div
                      className="modal_frame_01_types_inside_01_frame02_01_cost1"
                      id="99"
                      onClick={() => {
                        mixpanel.track("Select Amount");
                        amountSetter(2);
                      }}
                    >
                      <BiRupee
                        style={{
                          height: "20px",
                          width: "20px",
                          color: "white",
                        }}
                      />{" "}
                      99
                    </div>
                    <div
                      className="modal_frame_01_types_inside_01_frame02_01_cost1"
                      id="199"
                      onClick={() => {
                        mixpanel.track("Select Amount");
                        amountSetter(3);
                      }}
                    >
                      <BiRupee
                        style={{
                          height: "20px",
                          width: "20px",
                          color: "white",
                        }}
                      />{" "}
                      199
                    </div>
                    <div
                      className="modal_frame_01_types_inside_01_frame02_01_cost1"
                      id="custom"
                      onClick={() => {
                        mixpanel.track("Select Amount");
                        amountSetter(4);
                      }}
                    >
                      Custom
                    </div>
                    <br />
                    <br />
                    <div
                      id="amount"
                      className="req-res-input-amount"
                      style={{ display: "none" }}
                    >
                      {" "}
                      <input
                        type="number"
                        name="amount"
                        value={amount}
                        className="req-res-input"
                        onChange={(e) => {
                          setAmount(e.target.value);
                        }}
                        placeholder="Ex. 99"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="modal_frame_01_types_inside_01_frame02_button"
                  onClick={handleSubmit}
                >
                  Submit Request
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Request_Modal2;
