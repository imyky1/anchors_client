import React, { useState } from "react";
import mixpanel from "mixpanel-browser";
import { toast } from "react-toastify";
import { useContext } from "react";
import { feedbackcontext } from "../../Context/FeedbackState";

function Request_Modal({
  open,
  onClose,
  slug,
  progress,
  id,
  cname,
  UserDetails,
}) 
{
    const {createRequest} = useContext(feedbackcontext)
  const [requestQuery, setRequestQuery] = useState("");
  const [amount, setAmount] = useState();

  const handleSubmit = (e) => {
    progress(0)
    e.preventDefault();
    //const doc1 = document.querySelectorAll(".checkbox_modal_yesno");
    //let v1 = doc1[0].checked;
    //let v2 = doc1[1].checked;
    //if (requestQuery !== "" && (v1 || v2)) {
    if (requestQuery !== "") {
      createRequest(
        id,
        requestQuery,
        //v1 ? true : false,
        (amount === 0 || !amount) ? false : true, 
        amount ? amount : 0
      ).then((e) => {
        if (e.success) {
          toast.success("Request Captured Successfully", {
            position: "top-center",
            autoClose: 2500,
          });
          setRequestQuery("");
          onClose()
        } else if (e.already) {
          toast.info("You had already passed a request to the creator", {
            position: "top-center",
            autoClose: 2500,
          });
          onClose()
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
    progress(100)
  };

  if (!open) {
    return null;
  }

  return (
    <div className="logout_model_logout">
      <div
        onClick={(e) => e.stopPropagation()}
        className="fb_modal_main_box model_main_box "
      >
        <i
          className="fa-solid fa-xmark fa-xl"
          onClick={() => {
            mixpanel.track("Request Resource Model Close", {
              user: UserDetails,
              service: slug,
            });
            onClose();
          }}
        ></i>
        <span className="fb_span_one model_question request_model_span">Request New Resources</span>
        <span className="fb_span_two">Let {cname} know what you want in the next document.</span>
        <textarea
          type="text"
          className="request_model_box "
          placeholder="Ex: Please share resources for DSA.."
          value={requestQuery}
          onChange={(e) => setRequestQuery(e.target.value)}
        />
        <span className="fb_span_two">How much will you pay for the document (in INR)?</span>
        <div className="fb_span_two">
          <input type="number" name="amount" id="amount" value={amount} onChange={(e)=>{setAmount(parseInt(e.target.value))}} placeholder="Ex. 99" />
          {/* <span>
            <input
              type="checkbox"
              name="yes"
              id="yesvalue"
              className="checkbox_modal_yesno"
              onClick={() => {
                document.querySelectorAll(
                  ".checkbox_modal_yesno"
                )[1].checked = false;
              }}
            />
            <label htmlFor="yesvalue">Yes</label>
          </span>
          <span>
            <input
              type="checkbox"
              name="yes"
              id="novalue"
              className="checkbox_modal_yesno"
              onClick={() => {
                document.querySelectorAll(
                  ".checkbox_modal_yesno"
                )[0].checked = false;
              }}
            />
            <label htmlFor="novalue">No</label>
          </span> */}
        </div>
        <div className="model_buttons request_model_button">
          <button
            className="fb_model_button model_button "
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Request_Modal;
