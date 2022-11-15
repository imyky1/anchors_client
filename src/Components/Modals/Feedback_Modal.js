import React,{useState,useContext,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import "./Model.css";
import {toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import { feedbackcontext } from '../../Context/FeedbackState';

function Feedback_Modal({open, onClose, name,slug,progress,id,UserDetails}) {
    const navigate = useNavigate()
    const [rating, setrating] = useState(0);
    const { createFeedback } = useContext(feedbackcontext);
    const [feedback, setfeedback] = useState({ comment: "" });


    const handleSubmit = async (e) =>{
      e.preventDefault();
      progress(0);
        if (rating !== 0 && feedback.comment !== "") {
          const success = await createFeedback(id, rating, feedback.comment);
          if (success) {
            toast.success("Thanks for your Valuable Feedback ",{
              position:"top-center",
              autoClose: 2000
            });
            mixpanel.track("Feedback Submitted Using Model" , {
              user:UserDetails,
              feedback_service : slug
          })
            onClose();
          } else {
            toast.error("Feedback Not Submitted Please Try Again ",{
              position:"top-center",
              autoClose: 2000
            });
          }
        } else {
          toast.info("Please fill out the rating and comment", {
            position: "top-center",
            autoClose: 2000,
          });
        }
  
      progress(100);
    };

    useEffect(() => {
      mixpanel.track("Feedback Model Count" , {
        user:UserDetails,
        feedback_service : slug
    })
    }, [])


    const handleChange = (e) => {
      setfeedback({ ...feedback, comment: e.target.value });
    };

    const textarea = document.getElementById("comment");
  textarea?.addEventListener("input", autoResize, false);

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

    const handleratingclick = (e) => {
      if (document.getElementById(`${e.target.id}`).style.color !== "darkorange") {
        for (let index = e.target.id; index > 0; index--) {
          document.getElementById(`${index}`).style.color = "darkorange";
        }
        for (let index = e.target.id + 1; index < 6; index++) {
          document.getElementById(`${index}`).style.color = "rgb(215, 214, 214)";
        }
        let temp = e.target.id;
        setrating(temp);
      } else {
        for (let index = 1; index < 6; index++) {
          document.getElementById(`${index}`).style.color = "rgb(215, 214, 214)";
        }
        let temp = 0;
        setrating(temp);
      }
    };

    if (!open) {
        return null;
      }

  return (
    <div className="logout_model_logout">
      <div onClick={(e)=>e.stopPropagation()} className="fb_modal_main_box model_main_box ">
        <i className="fa-solid fa-xmark fa-xl"  onClick={()=>{mixpanel.track("Feedback Model Close" , {
        user:UserDetails,
        feedback_service : slug
    })
          onClose()}}></i>
        <span className="fb_span_one model_question">
          Did you Like<br/> <b style={{color:"red"}}>{name}</b>
        </span>
        {/* <span className="fb_span_two model_gyan">
          Share your valuable feedback for Service - <b>{name}</b> with other users.
        </span> */}
        <div className="stars_model">
          <span>
        <i
            className="fa-solid fa-star fa-xl"
            id={1}
            onClick={handleratingclick}
          ></i></span>
          <span>
          <i
            className="fa-solid fa-star fa-xl"
            id={2}
            onClick={handleratingclick}
          ></i></span>
          <span>
          <i
            className="fa-solid fa-star fa-xl"
            id={3}
            onClick={handleratingclick}
          ></i></span>
          <span>
          <i
            className="fa-solid fa-star fa-xl"
            id={4}
            onClick={handleratingclick}
          ></i></span>
          <span>
          <i
            className="fa-solid fa-star fa-xl"
            id={5}
            onClick={handleratingclick}
          ></i></span>
        </div>
        <textarea
          name="comment"
          id="comment"
          placeholder="Please describe your experience here.."
          value={feedback.comment}
          onChange={handleChange}
        ></textarea>
        <div className="model_buttons">
          <button className="fb_model_button model_button " onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Feedback_Modal