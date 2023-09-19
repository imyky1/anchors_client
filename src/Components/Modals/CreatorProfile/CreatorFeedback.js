import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./Modal.css";
import { FaRegStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import mixpanel from "mixpanel-browser";
import { creatorContext } from "../../../Context/CreatorState";
import { AiFillStar } from "react-icons/ai";

const feedbackQuestions = [
  {
    question: "How well do you like the platform & the services?",
    options: ["Dislike", "Like"],
  },
  {
    question: "How convenient do you find the features and tools?",
    options: ["Very Convenient ", "Highly Convenient "],
  },
  {
    question:
      "How satisfied are you with the relevance of the features and tools to your goals as a Creator ?",
    options: ["Not Satisfied", "Extremely  Satisfied"],
  },
  {
    question:
      "How frequently have you experienced technical difficulties while using anchors?",
    options: ["Often", "Rarely"],
  },
];

function CreatorFeedback({ open, toClose }) {
  open &&
    document?.addEventListener("click", () => {
      toClose();
    });

  const [rating, setTotalrating] = useState(0); // stores the feedback overall rating
  const [feedback, setfeedback] = useState(""); // stores the feedback comment
  const [questionData, setQuestionData] = useState(); // saves the qestion ratings
  const [formNotFilled, setFormNotFilled] = useState(false); // inform if form is not filled
  const { createCreatorFeedback } = useContext(creatorContext);

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
    setTotalrating(e + 1);
  };

  const handleSubmit = () => {
    if (rating !== 0 && questionData && Object.keys(questionData).length > 3) {
      createCreatorFeedback(rating, questionData, feedback).then((e) => {
        if (e) {
          toast.success("Feedback submitted successfully", {
            position: "top-center",
            autoClose: 2500,
          });
          toClose();
          setTotalrating(0);
          setfeedback("");
          setFormNotFilled(false);
          setQuestionData();
        } else {
          toast.error("Some error at the server, Please Try Again!!", {
            position: "top-center",
            autoClose: 2500,
          });
        }
      });
    } else {
      toast.error("Fill all the ratings", {
        position: "top-center",
        autoClose: 1500,
      });
      setFormNotFilled(true);
    }
  };

  const handleQuestionRating = (e, qno, ratingNum) => {
    for (let index = 1; index < 6; index++) {
      const doc = document.getElementById(`${qno}numberQuesRating${index}`);
      doc.classList.remove("active-number-rating");
    }

    document.getElementById(e.target.id).classList.add("active-number-rating");

    setQuestionData({
      ...questionData,
      [feedbackQuestions[qno - 1].question]: ratingNum,
    });
  };

  return (
    <>
      <div className="creator_feedback_modal_wrapper">
        <div
          className="creator_fb_box-container"
          onClick={(e) => {
            e?.stopPropagation();
          }}
        >
          <IoMdClose
            className="close_button_modal"
            style={{ position: "absolute", right: "13px" }}
            onClick={() => {
              toClose();
            }}
          />
          <section className="creator_fb_main">
            <h1 className="creator_fb_text01">
              Empowering Creators - Your voice matters We Listen.
            </h1>

            <section>
              <span className="creator_fb_text02">
                How well do you like us overall?
              </span>
              <section className="creator_fb_stars_box">
                {Array(5)
                  .fill(5)
                  .map((e, i) => {
                    return (
                      <div
                        className="rating_fb_container"
                        key={i + 4}
                        onClick={() => handleratingclick(i)}
                        id={`fbstar${i}`}
                      >
                        <FaRegStar
                          key={i}
                          onClick={() => handleratingclick(i)}
                          id={`fbstar${i}`}
                        />
                      </div>
                    );
                  })}
              </section>
            </section>

            <section>
              <span className="creator_fb_text02">
                Your feedback will help us serve you better. Be candid. Be true.
              </span>

              <div className="creator_questions_ratings">
                {feedbackQuestions?.map((elem, i) => {
                  return (
                    <div className="question_creator_fb" key={i + 10}>
                      <span className="creator_fb_text03">
                        <span>{i + 1}.</span> <p>{elem.question}</p>
                      </span>
                      <div>
                        <section className="number_ratings_cretor_fb">
                          {Array(5)
                            .fill(5)
                            .map((e, index2) => {
                              return (
                                <span
                                  key={index2}
                                  id={`${i + 1}numberQuesRating${index2 + 1}`}
                                  onClick={(e) =>
                                    handleQuestionRating(e, i + 1, index2 + 1)
                                  }
                                >
                                  {index2 + 1}
                                </span>
                              );
                            })}
                        </section>
                        <section className="optional_comments_questions_fb">
                          {elem.options.map((option, index) => {
                            return <span key={index}>{option}</span>;
                          })}
                        </section>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <span className="creator_fb_text02">
                Any recommendations to make the platform better for you?
              </span>
              <textarea
                className="creator_fb_modal_comment"
                type="text"
                placeholder="Share your experience"
                value={feedback}
                onChange={(e) => {
                  setfeedback(e?.target?.value);
                }}
              />
            </section>

            <div className="button_section_creator_fb">
              <button className="creator_fb_submit" onClick={handleSubmit}>
                Submit Feedback
              </button>
              {formNotFilled && (
                <span className="">*Ratings required to submit feedback </span>
              )}
            </div>
          </section>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export const CreatorFeedbackModal = ({ open, onClose }) => {
  const [rating, setrating] = useState(0);
  const [feedback, setfeedback] = useState("");
  const [selectedStars, setSelectedStars] = useState({
    filled: 0,
    unfilled: 5,
  });

  const { createCreatorFeedback } = useContext(creatorContext);

  const handleratingclick = (e) => {
    setrating(e + 1);
    setSelectedStars({ filled: e + 1, unfilled: 4 - e });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating !== 0) {
      if (feedback?.length !== 0) {
        const success = await createCreatorFeedback(rating, [], feedback);
        if (success) {
          toast.success("Thanks for your Valuable Feedback ", {
            position: "top-center",
            autoClose: 2000,
          });
          onClose();
          setfeedback("");
          setrating(0);
        } else {
          toast.error("Feedback Not Submitted Please Try Again ", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      } else {
        toast.info("Please fill out the feedback form", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      toast.info("Please fill out the ratings", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  open &&
    document?.addEventListener("click", () => {
      onClose();
    });

  if (!open) {
    return null;
  }

  return (
    <div className="model_outside_wrapper_success_modal">
      <div
        className="outer_class_creator_feedback"
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        <div className="outer_class_creator_feedback01">
          <div className="outer_class_creator_feedback01_first">
            Empowering Creators - Your voice is significant. We actively listen.
            <section>How well do you like us overall?</section>
            <i
              class="fa-solid fa-xmark fa-lg chnageStatusModalCross"
              onClick={() => {
                onClose();
              }}
            ></i>
          </div>
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
        </div>
        <div className="outer_class_creator_feedback02">
          <div className="outer_class_creator_feedback02_textarea">
            <section>Please share your experience</section>
            <textarea
              style={{
                backgroundColor: "color: var(--neutral-gray-500, #64748B)", // Replace with your desired background color
                height: "120px",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid var(--neutral-gray-500, #64748B)",
                background: "#212121",
              }}
              value={feedback}
              onChange={(e) => {
                setfeedback(e.target.value);
              }}
              placeholder="Please share your experience"
            ></textarea>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="outer_class_creator_feedback02_button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorFeedback;
