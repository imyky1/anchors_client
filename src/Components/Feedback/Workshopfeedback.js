import React, { useState, useContext, useEffect } from "react";
import "./Feedback.css";
import { useParams, useNavigate } from "react-router-dom";
import { feedbackcontext } from "../../Context/FeedbackState";
import { ToastContainer, toast } from "react-toastify";
import ServiceContext from "../../Context/services/serviceContext";
import "react-toastify/dist/ReactToastify.css";
import User_login from "../Login/Users/User_login";
import { Cross as Hamburger } from "hamburger-react";
import { useLocation } from "react-router-dom";

function WorkshopFeedback(props) {
  const [feedback, setfeedback] = useState({ comment: "" });
  const [openModel, setOpenModel] = useState(false);
  const [rating, setrating] = useState(0);
  const { createFeedback, createworkshopFeedback, getworkshopFB } =
    useContext(feedbackcontext);
  const { getworkshopinfo, workshopInfo } = useContext(ServiceContext);
  //const { slug } = useParams();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);

  const process = () => {
    setOpenModel(false);
    props.progress(0);
    if (localStorage.getItem("jwtToken")) {
    } else {
      setOpenModel(true);
    }
    console.log(workshopInfo);
    if (localStorage.getItem("jwtToken") && workshopInfo?.length !== 0) {
      console.log(workshopInfo);

      getworkshopFB(workshopInfo?._id).then((e) => {
        if (!e) {
          setChecked(false);
        } else {
          alert("You have already filled the form");
          navigate("/");
        }
      });
    }
    props.progress(100);
  };
  const token = useParams();
  useEffect(() => {
    console.log(token.id);
    getworkshopinfo(token.id);
  }, [token.id]);

  useEffect(() => {
    //   CHECK USER LOGIN  eLSE a login modal
    //getserviceinfo(slug).then((id) => {
    //  setId(id[1]);
    //  checkFB(id[1]).then((check) => {
    //    setChecked(check);
    //  });
    //});
    process()?.then(() => {});
    // eslint-disable-next-line
  }, [workshopInfo, localStorage.getItem("jwtToken")]);

  const userlogout = () => {
    window.location.pathname = "/logout";
  };

  const handledropdown = () => {
    document.querySelector(".user_logout").style.display !== "none"
      ? (document.querySelector(".user_logout").style.display = "none")
      : (document.querySelector(".user_logout").style.display = "inline-block");
  };

  const handleratingclick = (e) => {
    if (
      document.getElementById(`${e.target.id}`).style.color !== "darkorange"
    ) {
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

  const handleChange = (e) => {
    setfeedback({ ...feedback, comment: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      localStorage.getItem("jwtToken") &&
      localStorage.getItem("isUser") === "true"
    ) {
      if (rating !== 0 && feedback.comment !== "") {
        const load = toast.loading("Please wait...", {
          position: "top-center",
        });
        props.progress(0);
        const success = await createworkshopFeedback(
          workshopInfo?._id,
          rating,
          feedback.comment
        );
        if (success) {
          toast.update(load, {
            render: "Thanks for your Valuable Feedback ",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          window.open(`/w/${workshopInfo?.slug}`, "_self");
        } else {
          toast.update(load, {
            render: "Feedback Not Submitted Please Try Again ",
            type: "serror",
            isLoading: false,
            autoClose: 2000,
          });
        }
      } else {
        toast.info("Please fill out the rating and comment", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      setOpenModel(true);
    }

    props.progress(100);
  };

  const textarea = document.getElementById("comment");
  textarea?.addEventListener("input", autoResize, false);

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  if (checked) {
    alert("You have already filled the feedback for this Service");
    //toast.info("You have already filled the feedback for this Service",{
    //  position:"top-center",
    //  autoClose:2000
    //})
    return navigate(localStorage.getItem("url"));
  }

  if (localStorage.getItem("isUser") === "") {
    const con = window.confirm(
      "Feedbacking is an user action,Are you sure you want to logout as creator?"
    );
    if (con) {
      window.open("/logout", "_self");
    } else {
      navigate("/");
    }
  }

  return (
    <>
      <User_login
        open={openModel}
        onClose={() => {
          setOpenModel(false);
        }}
      />
      <div className="main_feedback_box">
        <div className="profile_header" style={{ border: "none" }}>
          <div className="logo">
            <img src={require("../../Utils/Images/logo.png")} alt="Logo" />
            <span>anchors</span>
          </div>
          {localStorage.getItem("isUser") === "" ? (
            ""
          ) : (
            <div className="user_login">
              <span>
                {!localStorage.getItem("jwtToken") ? (
                  <span
                    onClick={() => {
                      setOpenModel(true);
                    }}
                    className="login_button_user"
                  >
                    Login
                  </span>
                ) : (
                  <span className="user_login_name">
                    {localStorage.getItem("user").slice(0, 12) ===
                    localStorage.getItem("user")
                      ? localStorage.getItem("user")
                      : localStorage.getItem("user").slice(0, 12) + ".."}
                    <i
                      className="fa-solid fa-caret-down"
                      onClick={handledropdown}
                    ></i>
                    <Hamburger
                      className="hamburger-react"
                      size={20}
                      onToggle={(toggled) => {
                        if (toggled) {
                          document.querySelector(
                            ".hamburger-menu"
                          ).style.display = "block";
                        } else {
                          document.querySelector(
                            ".hamburger-menu"
                          ).style.display = "none";
                          // close a menu
                        }
                      }}
                    />
                    <button className="user_logout" onClick={userlogout}>
                      Logout
                    </button>
                    <ul className="hamburger-menu">
                      <li className="hamburger-item" onClick={userlogout}>
                        Logout
                      </li>
                    </ul>
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="design_box">
          <div className="rating">
            <h1>
              Please tell us your experience with <br />
              <span>{workshopInfo?.sname}</span>
            </h1>
            {/* <img src={service?.simg} alt="" className="service_section_image"/> */}
            <div className="stars">
              <i
                className="fa-solid fa-star fa-2x"
                id={1}
                onClick={handleratingclick}
              ></i>
              <i
                className="fa-solid fa-star fa-2x"
                id={2}
                onClick={handleratingclick}
              ></i>
              <i
                className="fa-solid fa-star fa-2x"
                id={3}
                onClick={handleratingclick}
              ></i>
              <i
                className="fa-solid fa-star fa-2x"
                id={4}
                onClick={handleratingclick}
              ></i>
              <i
                className="fa-solid fa-star fa-2x"
                id={5}
                onClick={handleratingclick}
              ></i>
            </div>
            <textarea
              name="comment"
              id="comment"
              placeholder="Please describe your experience here.."
              value={feedback.comment}
              onChange={handleChange}
            ></textarea>

            <button className="submit" onClick={onSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default WorkshopFeedback;
