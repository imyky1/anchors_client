import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Model.css";
import {toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import { feedbackcontext } from "../../Context/FeedbackState";
import { FaRegStar } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";


function FeedbackModal({
  open,
  onClose,
  name,
  slug,
  progress,
  id,
  serviceType,
  UserDetails,
  reload    // means want a reload after success
}) {
  const [rating, setrating] = useState(0);

  const { createFeedback, createworkshopFeedback } =
    useContext(feedbackcontext);

  const [feedback, setfeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    progress(0);
    if (rating !== 0) {
      const success = await createFeedback(id, rating, feedback);
      if (success) {
        toast.success("Thanks for your Valuable Feedback ", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.reload()
        }, 1500);
        mixpanel.track("Feedback Submitted Using Model", {
          user: UserDetails,
          feedback_service: slug,
        });
        progress(100);
        onClose();
      } else {
        toast.error("Feedback Not Submitted Please Try Again ", {
          position: "top-center",
          autoClose: 2000,
        });
        progress(100);
      }
    } else {
      toast.info("Please fill out the ratings", {
        position: "top-center",
        autoClose: 2000,
      });
    }

  };

  const handleratingclick = (e) => {
    for (let index = e; index >= 0; index--) {
      if (document.getElementById(`fbstar${index}`)) {
        document.getElementById(`fbstar${index}`).innerHTML =
        '<svg stroke="currentColor" fill="#FFC451" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>';
      }
    }
    for (let index = e + 1; index < 6; index++) {
      if (document.getElementById(`fbstar${index}`)) {
        document.getElementById(`fbstar${index}`).innerHTML =
          '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path></svg>';
      }
    }
    setrating(e + 1);
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="feedback_modal_wrapper">
        <div className="feedback_modal_main_container">
          <AiOutlineClose
            className="close_button_modal"
            onClick={() => {
              mixpanel.track("Feedback Model Close", {
                user: UserDetails,
                feedback_service: slug,
              });
              onClose();
            }}
          />
          <div>
            <h1 className="text_01_feedback_modal">
              Please Share your Feedback for
            </h1>
            <span className="text_03_feedback_modal">{name}</span>
          </div>
          <section className="rating_section_feedback_modal">
            <span className="text_02_feedback_modal">
              Rate your experience.
            </span>
            <section>
              {Array(5)
                .fill(5)
                .map((e, i) => {
                  return (
                    <div
                      className="rating_fb_container"
                      key={i}
                      onClick={() => handleratingclick(i)}
                      id={`fbstar${i}`}
                    >
                      <FaRegStar key={i}
                      onClick={() => handleratingclick(i)}
                      id={`fbstar${i}`}/>
                    </div>
                  );
                })}
            </section>
          </section>

          <section className="fb_messaging_section_modal">
            <span className="text_02_feedback_modal">Feedback</span>
            <textarea
              className="fb_modal_comment"
              type="text"
              placeholder="Share your experience"
              value={feedback}
              onChange={(e) => {
                setfeedback(e?.target?.value);
              }}
            />
          </section>

          <button className="fb_modal_button_submit" onClick={handleSubmit}>
            Submit Feedback
          </button>
        </div>
      </div>
    </>
  );
}

function FeedbackModal2({
  open,
  onClose,
  name,
  slug,
  progress,
  id,
  serviceType,
  UserDetails,
  reload    // means want a reload after success
}) {
  const [rating, setrating] = useState(0);

  const { createFeedback, createworkshopFeedback } =
    useContext(feedbackcontext);

  const [feedback, setfeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    progress(0);
    if (rating !== 0) {
      const success = await createFeedback(id, rating, feedback);
      if (success) {
        toast.success("Thanks for your Valuable Feedback ", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.reload()
        }, 1500);
        mixpanel.track("Feedback Submitted Using Model", {
          user: UserDetails,
          feedback_service: slug,
        });
        progress(100);
        onClose();
      } else {
        toast.error("Feedback Not Submitted Please Try Again ", {
          position: "top-center",
          autoClose: 2000,
        });
        progress(100);
      }
    } else {
      toast.info("Please fill out the ratings", {
        position: "top-center",
        autoClose: 2000,
      });
    }

  };

  const handleratingclick = (e) => {
    for (let index = e; index >= 0; index--) {
      if (document.getElementById(`fbstar${index}`)) {
        document.getElementById(`fbstar${index}`).innerHTML =
        '<svg stroke="currentColor" fill="#FFC451" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>';
      }
    }
    for (let index = e + 1; index < 6; index++) {
      if (document.getElementById(`fbstar${index}`)) {
        document.getElementById(`fbstar${index}`).innerHTML =
          '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path></svg>';
      }
    }
    setrating(e + 1);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="feedback_modal_wrapper">
      <div className="feedback_modal_main_container">
        <div className="feedback_modal_first">
          <div className="feedback_modal_first_01">
            <div className="feedback_modal_first_01_text">
              Please Share your Experience with
            </div>
            <div className="feedback_modal_first_01_name">
              {name}
            </div>
            <section className="rating_section_feedback_modal">
  
          <section>
         {Array(5)
            .fill(5)
            .map((e, i) => {
              return (
                <div
                  className="rating_fb_container"
                  key={i}
                  onClick={() => handleratingclick(i)}
                  id={`fbstar${i}`}
                >
                  <FaRegStar key={i}
                  onClick={() => handleratingclick(i)}
                  id={`fbstar${i}`}/>
                </div>
              );
            })}
        </section>
      </section>
          </div>
        </div>
        <div className="feedback_modal_second">
        Share your experience

          </div>
          <div className="feedback_modal_third">
            <div className="feedback_modal_third_close">
            <AiOutlineClose
            className="close_button_modal"
            onClick={() => {
              mixpanel.track("Feedback Model Close", {
                user: UserDetails,
                feedback_service: slug,
              });
              onClose();
            }}
          />
              </div>
              <div className="feedback_modal_third_button">Submit Experience </div>
            </div>
      </div>
    </div>

     //     <div>
      //       <h1 className="text_01_feedback_modal">
      //       Please Share your Experience with 
      //       </h1>
      //       <span className="text_03_feedback_modal">{name}</span>
      //       <section className="rating_section_feedback_modal">
  
      //       <section>
      //         {Array(5)
      //           .fill(5)
      //           .map((e, i) => {
      //             return (
      //               <div
      //                 className="rating_fb_container"
      //                 key={i}
      //                 onClick={() => handleratingclick(i)}
      //                 id={`fbstar${i}`}
      //               >
      //                 <FaRegStar key={i}
      //                 onClick={() => handleratingclick(i)}
      //                 id={`fbstar${i}`}/>
      //               </div>
      //             );
      //           })}
      //       </section>
      //     </section>
      //     </div>
          

      //     <section className="fb_messaging_section_modal">
  
      //       <div
      //         className="fb_modal_comment"
             

      //         value={feedback}
      //         onChange={(e) => {
      //           setfeedback(e?.target?.value);
      //         }}
      //       >  Share your experience</div>
      //     </section>
      //     <div className="fb_messaging_section_modal_last">
          // <AiOutlineClose
          //   className="close_button_modal"
          //   onClick={() => {
          //     mixpanel.track("Feedback Model Close", {
          //       user: UserDetails,
          //       feedback_service: slug,
          //     });
          //     onClose();
          //   }}
          // />
      //     <button className="fb_modal_button_submit" onClick={handleSubmit}>
      //       Submit Feedback
      //     </button>
      //     </div>

  );
  
 }

export default FeedbackModal;
