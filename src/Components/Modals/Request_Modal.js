import React, { useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import { toast } from "react-toastify";
import { useContext } from "react";
import { feedbackcontext } from "../../Context/FeedbackState";

function Request_Modal({ open, onClose, slug, id, cname, UserDetails }) {
  const { createRequest } = useContext(feedbackcontext);
  const [requestQuery, setRequestQuery] = useState("");
  const [amount, setAmount] = useState(null);

  const amountSetter = (item) => {
    document.getElementById("99").style.border = "1px solid #00000069";
    document.getElementById("300").style.border = "1px solid #00000069";
    document.getElementById("custom").style.border = "1px solid #00000069";

    document.getElementById("amount").style.display = "none";

    if (item === 1) {
      setAmount(99);
      document.getElementById("99").style.border = "1px solid black";
    } else if (item === 2) {
      setAmount(300);
      document.getElementById("300").style.border = "1px solid black";
    } else {
      setAmount(0);
      document.getElementById("custom").style.border = "1px solid black";
      document.getElementById("amount").style.display = "flex";
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (requestQuery.length < 5) {
      toast.error("Please provide message for your request!", {
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

    if (requestQuery !== "") {
      createRequest(
        id,
        requestQuery,
        //v1 ? true : false,
        amount === 0 || !amount ? false : true,
        amount ? amount : 0
      ).then((e) => {
        console.log(e);
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
    } else {
      toast.error("Please fill the mandatory fields", {
        position: "top-center",
        autoClose: 2500,
      });
    }
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
        <div className="req-resource-popup-cancel">
          {" "}
          <i
            className="fa-solid fa-xmark fa-xl"
            style={{ cursor: "pointer" }}
            onClick={() => {
              mixpanel.track("Request Resource Model Close", {
                user: UserDetails,
                service: slug,
              });
              onClose();
            }}
          ></i>
        </div>

        <div className="req-res-body-wrap">
          <span className="req-res-header">Request Resources</span>
          <span className="req-res-body-first">
            Send your request to {cname.split(" ")[0]} and let him know your
            service
          </span>
          <span className="req-res-body-second">Your Message</span>
          <textarea
            type="text"
            placeholder="Write Your message here "
            value={requestQuery}
            onChange={(e) => setRequestQuery(e.target.value)}
          />
          <span className="req-res-text-amount" id="amountChooseText">
            Choose an amount
          </span>
          <div className="req-res-body-select-amount" id="amountSelector">
            <span
              className="req-res-amount-select"
              id="99"
              onClick={() => amountSetter(1)}
            >
              ₹ 99
            </span>
            <span
              className="req-res-amount-select"
              id="300"
              onClick={() => amountSetter(2)}
            >
              ₹ 300
            </span>
            <span
              className="req-res-amount-select"
              id="custom"
              onClick={() => amountSetter(3)}
            >
              Custom
            </span>
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
                  setAmount(parseInt(e.target.value));
                }}
                placeholder="Ex. 99"
              />
            </div>
          </div>
          <div className="req-res-submit-btn-container">
            <button className="req-res-submit-btn" onClick={handleSubmit}>
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Request_Modal;
