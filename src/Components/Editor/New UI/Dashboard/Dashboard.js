import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import "./Dashboard.css";
import mixpanel from "mixpanel-browser";
import { creatorContext } from "../../../../Context/CreatorState";
import { BsFillPersonFill, BsFillStarFill } from "react-icons/bs";
import { BiRupee, BiGift } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import { LoadTwo } from "../../../Modals/Loading";
import Confetti from "react-confetti";
import { ToastContainer, toast } from "react-toastify";
import EventModel from "../../../Modals/EventModal/Event_popup";
import { MdAttachMoney, MdDone } from "react-icons/md";

const DashboardStepper = ({ setOpenFirstTimeModal, reviews }) => {
  const navigate = useNavigate();
  const [loadConfetti, setLoadConfetti] = useState(false);
  const [loader, setLoader] = useState(false);
  const [stepperData, setStepperData] = useState({});
  const [openEventPopup, setOpenEventPopup] = useState(false);

  const {
    updateStepperStatus,
    getAllCreatorInfo,
    allCreatorInfo,
    basicNav,
    checkStepperStatus,
  } = useContext(creatorContext);

  // get creator data
  useEffect(() => {
    getAllCreatorInfo();
  }, []);

  // Open first time modal and get the stepper Data
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("firstTime")) {
      setOpenFirstTimeModal(true);
    }
    setLoader(true);

    if (!basicNav?.stepper) {
      checkStepperStatus().then((e) => {
        setLoader(false);
        setStepperData(e?.result);
      });
    } else {
      setStepperData({
        "Updated Profile Page": 1, // approved only when the creator fills the profile
        "Created First Post": 1,
        "Acquired Paid User": 1,
        "Acquired Free User": 1,
        "Setup Payment Account": 1,
      });
    }
  }, [basicNav]);

  function sumObjectValues(obj) {
    let sum = 0;

    // Iterate over the object's properties
    for (let key in obj) {
      // Check if the property is not inherited from the prototype chain
      if (obj.hasOwnProperty(key)) {
        // Add the value to the sum
        sum += obj[key];
      }
    }

    return sum;
  }

  //  what to do if the stepper turns out false and true
  useEffect(() => {
    if (
      sumObjectValues(stepperData) >= 4 &&
      reviews > 0 &&
      !basicNav?.stepper
    ) {
      setLoadConfetti(true);
      updateStepperStatus().then((e) => {
        if (e.success) {
          // toast.success(
          //   "Congrats You have successfully completed your first Milestone",
          //   {
          //     position: "top-center",
          //     autoClose: 4000,
          //   }
          // );
          console.log("Congrats");
          setTimeout(() => {
            // window.location.reload()
            setLoadConfetti(false);
          }, 5000);
        }
      });
    }
  }, [stepperData]);

  return (
    <>
      {/* {loader && <LoadTwo open={loader} />} */}
      <ToastContainer limit={1} />

      {loadConfetti && (
        <Confetti width={window.screen.width} height={window.screen.height} />
      )}

      {openEventPopup && (
        <EventModel
          onClose={() => {
            setOpenEventPopup(false);
          }}
        />
      )}

      <div className="main_dashboard_conatiner2">
        <div className="stepper_outside_wrapper_dashboard">
          <h2 className="text_01_dashboard">
            Welcome {allCreatorInfo?.name?.split(" ")[0]}!
          </h2>
          <span className="text_02_dashboard" style={{ textAlign: "left" }}>
            Your creative journey starts here. Explore premium content and
            events.
          </span>

          <section>
            <div className="each_step_stepper_dashboard">
              <div
                className={
                  stepperData &&
                  stepperData["Updated Profile Page"] === 1 &&
                  "changeBackgroundToBlackDashboard"
                }
              >
                {stepperData && stepperData["Updated Profile Page"] === 1 ? (
                  <MdDone color="#FFFFFF" size={21} />
                ) : (
                  <BsFillPersonFill color="#D0D0D0" size={21} />
                )}
              </div>
              <span>Updated Profile Page</span>
            </div>

            <div className={`horizonal_bar_stepper_dashboard`}></div>

            <div className="each_step_stepper_dashboard">
              <div
                className={
                  stepperData &&
                  stepperData["Created First Post"] === 1 &&
                  "changeBackgroundToBlackDashboard"
                }
              >
                {stepperData && stepperData["Created First Post"] === 1 ? (
                  <MdDone color="#FFFFFF" size={21} />
                ) : (
                  <CgFileDocument color="#D0D0D0" size={21} />
                )}
              </div>
              <span>Created First Post</span>
            </div>

            <div className={`horizonal_bar_stepper_dashboard`}></div>

            <div className="each_step_stepper_dashboard">
              <div
                className={
                  stepperData &&
                  stepperData["Acquired Paid User"] === 1 &&
                  "changeBackgroundToBlackDashboard"
                }
              >
                {stepperData && stepperData["Acquired Paid User"] === 1 ? (
                  <MdDone color="#FFFFFF" size={21} />
                ) : (
                  <BiRupee color="#D0D0D0" size={21} />
                )}
              </div>
              <span>Acquired Paid User</span>
            </div>

            <div className={`horizonal_bar_stepper_dashboard`}></div>

            {/* <div className="each_step_stepper_dashboard">
              <div
                className={
                  stepperData &&
                  stepperData["Acquired Free User"] === 1 &&
                  "changeBackgroundToBlackDashboard"
                }
              >
                <BiGift
                  color={
                    stepperData && stepperData["Acquired Free User"] === 1
                      ? "#FFFFFF"
                      : "#D0D0D0"
                  }
                  size={21}
                />
              </div>
              <span>Acquired Free User</span>
            </div> */}
            <div className="each_step_stepper_dashboard">
              <div
                className={reviews > 0 && "changeBackgroundToBlackDashboard"}
              >
                {reviews > 0 ? (
                  <MdDone color="#FFFFFF" size={21} />
                ) : (
                  <BsFillStarFill color="#D0D0D0" size={21} />
                )}
              </div>
              <span>Earned Review</span>
            </div>

            <div className={`horizonal_bar_stepper_dashboard`}></div>

            <div className="each_step_stepper_dashboard">
              <div
                className={
                  stepperData &&
                  stepperData["Setup Payment Account"] === 1 &&
                  "changeBackgroundToBlackDashboard"
                }
              >
                {stepperData && stepperData["Setup Payment Account"] === 1 ? (
                  <MdDone color="#FFFFFF" size={21} />
                ) : (
                  <MdAttachMoney color="#D0D0D0" size={21} />
                )}
              </div>
              <span>Setup Payment Account</span>
            </div>
          </section>
        </div>

        <div className="main_dashboard_design_box">
          {/* <h2 className="text_01_dashboard">Create your post</h2> */}
          {/* <span className="text_02_dashboard">
            You can upload Excel sheets, Important Document, Notes, Interview
            Questions & Videos
          </span> */}
          {/* <span className="text_02_dashboard">
            You can upload Excel sheets, Important Document, Notes & Interview
            Questions.
          </span> */}
          <section>
            <div
              onClick={() => {
                navigate("createservice?type=pdf");
                mixpanel.track("Share a pdf");
              }}
              className="dashboard_options"
            >
              <span>Share PDF</span>

              <p>Guides, Summaries, Notes & more!</p>
            </div>
            <div
              onClick={() => {
                navigate("createservice?type=excel");
                mixpanel.track("Share a excel");
              }}
              className="dashboard_options"
            >
              <span>Share Excel</span>
              <p>Finances, Jobs, Skincare Tips & more!</p>
            </div>
            {/* <div
              onClick={() => {
                navigate("createservice?type=video");
                mixpanel.track("Share a video");
              }}
              className="dashboard_options"
            >
              Share a Video
            </div> */}
            <div
              onClick={() => {
                setOpenEventPopup(true);
                mixpanel.track("Share a event");
              }}
              className="dashboard_options"
            >
              <span>Host Event</span>

              <p>Webinars, Workshops, Q&A!</p>
            </div>
          </section>
        </div>
      </div>

      <SuperSEO title="Anchors - Dashboard" />
    </>
  );
};

export default DashboardStepper;
