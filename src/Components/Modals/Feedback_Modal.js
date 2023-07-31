import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Model.css";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import { feedbackcontext } from "../../Context/FeedbackState";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";

function FeedbackModal2({
  open,
  onClose,
  name,
  slug,
  progress,
  id,
  UserDetails,
}) {
  const [rating, setrating] = useState(0);

  const { createFeedback } = useContext(feedbackcontext);

  const [feedback, setfeedback] = useState("");
  const [selectedStars, setSelectedStars] = useState({
    filled: 0,
    unfilled: 5,
  });

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
    setrating(e + 1);
    setSelectedStars({ filled: e + 1, unfilled: 4 - e });
  };

  if (!open) {
    return null;
  }

  return (
    <div className="feedback_modal_wrapper">
      <div className="feedback_modal_main_container">
        {window.screen.width < 600 && <div className="mobile_view_modal_horizonal_bar">
          <section></section>
          </div>}

        <div className="feedback_modal_first">
          <div className="feedback_modal_first_01">
            <div className="feedback_modal_first_01_text">
              Please Share your Experience with
              {window.screen.width < 650 && (
                <div className="feedback_modal_third_close01">
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
              )}
            </div>
            <div className="feedback_modal_first_01_name">{name}</div>
            {window.screen.width < 650 && (
              <div className="rating_section_feedback_modal_mobile">
                <section className="rating_section_feedback_modal ">
                  <section>
                    {Array(selectedStars?.filled)
                      .fill(selectedStars?.filled)
                      .map((e, i) => {
                        return (
                          <div className="rating_fb_container" key={i}>
                            <AiFillStar
                              className="selected_star"
                              size={20}
                              onClick={() => handleratingclick(i)}
                            />
                          </div>
                        );
                      })}
                    {Array(selectedStars?.unfilled)
                      .fill(selectedStars?.unfilled)
                      .map((e, i) => {
                        return (
                          <div className="rating_fb_container" key={i}>
                            <AiFillStar
                              className="unselected_star"
                              size={20}
                              onClick={() =>
                                handleratingclick(i + selectedStars?.filled)
                              }
                            />
                          </div>
                        );
                      })}
                  </section>
                </section>
                <div className="feedback_modal_second">
                  <textarea
                    type="text"
                    placeholder="Share your experience"
                    value={feedback}
                    onChange={(e) => {
                      setfeedback(e?.target?.value);
                    }}
                  />
                </div>
                <div className="feedback_modal_third">
                  <div
                    className="feedback_modal_third_button"
                    onClick={handleSubmit}
                  >
                    Submit Feedback
                  </div>
                </div>
              </div>
            )}
            {window.screen.width > 650 && (
              <section className="rating_section_feedback_modal ">
                <section>
                  {Array(selectedStars?.filled)
                    .fill(selectedStars?.filled)
                    .map((e, i) => {
                      return (
                        <div className="rating_fb_container" key={i}>
                          <AiFillStar
                            className="selected_star"
                            size={20}
                            onClick={() => handleratingclick(i)}
                          />
                        </div>
                      );
                    })}
                  {Array(selectedStars?.unfilled)
                    .fill(selectedStars?.unfilled)
                    .map((e, i) => {
                      return (
                        <div className="rating_fb_container" key={i}>
                          <AiFillStar
                            className="unselected_star"
                            size={20}
                            onClick={() =>
                              handleratingclick(i + selectedStars?.filled)
                            }
                          />
                        </div>
                      );
                    })}
                </section>
              </section>
            )}
          </div>
        </div>
        {window.screen.width > 650 && (
          <div className="feedback_modal_second">
            <textarea
              type="text"
              placeholder="Share your experience"
              value={feedback}
              onChange={(e) => {
                setfeedback(e?.target?.value);
              }}
            />
          </div>
        )}

        {window.screen.width > 650 && (
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
            <div className="feedback_modal_third_button" onClick={handleSubmit}>
              Submit Feedback{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackModal2;
