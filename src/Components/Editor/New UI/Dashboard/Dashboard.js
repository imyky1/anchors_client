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

const DashboardStepper = ({ setOpenFirstTimeModal, reviews }) => {
  const navigate = useNavigate();
  const [loadConfetti, setLoadConfetti] = useState(false);
  const [loader, setLoader] = useState(false);
  const [stepperData, setStepperData] = useState({});

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
          console.log("Congrats")
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

      <div className="main_dashboard_conatiner2">
        <div className="stepper_outside_wrapper_dashboard">
          <h2 className="text_01_dashboard">
            Hi {allCreatorInfo?.name?.split(" ")[0]}, Welcome to anchors!
          </h2>
          <span className="text_02_dashboard" style={{ textAlign: "left" }}>
            Begin your Anchors journey by following the milestones outlined
            below to get started!
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
                <BsFillPersonFill
                  color={
                    stepperData && stepperData["Updated Profile Page"] === 1
                      ? "white"
                      : "#64748B"
                  }
                  size={21}
                />
              </div>
              <span>Updated Profile Page</span>
            </div>

            <div
              className={`horizonal_bar_stepper_dashboard ${
                stepperData && stepperData["Updated Profile Page"] === 1
                  ? "changeBackgroundToBlackDashboard"
                  : "changeBackgroundToGreyDashboard"
              }`}
            ></div>
            <div className="each_step_stepper_dashboard">
              <div
                className={
                  stepperData &&
                  stepperData["Created First Post"] === 1 &&
                  "changeBackgroundToBlackDashboard"
                }
              >
                <CgFileDocument
                  color={
                    stepperData && stepperData["Created First Post"] === 1
                      ? "white"
                      : "#64748B"
                  }
                  size={21}
                />
              </div>
              <span>Created First Post</span>
            </div>

            <div
              className={`horizonal_bar_stepper_dashboard ${
                stepperData && stepperData["Created First Post"] === 1
                  ? "changeBackgroundToBlackDashboard"
                  : "changeBackgroundToGreyDashboard"
              }`}
            ></div>
            <div className="each_step_stepper_dashboard">
              <div
                className={
                  stepperData &&
                  stepperData["Acquired Paid User"] === 1 &&
                  "changeBackgroundToBlackDashboard"
                }
              >
                <BiRupee
                  color={
                    stepperData && stepperData["Acquired Paid User"] === 1
                      ? "white"
                      : "#64748B"
                  }
                  size={21}
                />
              </div>
              <span>Acquired Paid User</span>
            </div>

            <div
              className={`horizonal_bar_stepper_dashboard ${
                stepperData && stepperData["Acquired Paid User"] === 1
                  ? "changeBackgroundToBlackDashboard"
                  : "changeBackgroundToGreyDashboard"
              }`}
            ></div>
            <div className="each_step_stepper_dashboard">
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
                      ? "white"
                      : "#64748B"
                  }
                  size={21}
                />
              </div>
              <span>Acquired Free User</span>
            </div>

            <div
              className={`horizonal_bar_stepper_dashboard ${
                stepperData && stepperData["Acquired Free User"] === 1
                  ? "changeBackgroundToBlackDashboard"
                  : "changeBackgroundToGreyDashboard"
              }`}
            ></div>
            <div className="each_step_stepper_dashboard">
              <div
                className={reviews > 0 && "changeBackgroundToBlackDashboard"}
              >
                <BsFillStarFill
                  color={reviews > 0 ? "white" : "#64748B"}
                  size={21}
                />
              </div>
              <span>Earned Review</span>
            </div>
          </section>
        </div>

        <div className="main_dashboard_design_box">
          <h2 className="text_01_dashboard">Create your post</h2>
          <span className="text_02_dashboard">
            You can upload Excel sheets, Important Document, Notes, Interview
            Questions & Videos
          </span>
          <section>
            <div
              onClick={() => {
                navigate("createservice?type=pdf");
                mixpanel.track("Share a pdf");
              }}
              className="dashboard_options"
            >
              Share a PDF
            </div>
            <div
              onClick={() => {
                navigate("createservice?type=excel");
                mixpanel.track("Share a excel");
              }}
              className="dashboard_options"
            >
              Share an Excelsheet
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
                navigate("createevent");
                mixpanel.track("Share a event");
              }}
              className="dashboard_options"
            >
              Create an Event
            </div>
          </section>
        </div>
      </div>

      <SuperSEO title="Anchors - Dashboard" />
    </>
  );
};

export default DashboardStepper;
