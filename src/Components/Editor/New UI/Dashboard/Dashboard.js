import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import "./Dashboard.css";
import mixpanel from "mixpanel-browser";
import { creatorContext } from "../../../../Context/CreatorState";
import { BsFillPersonFill, BsFillStarFill } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import { BiRupee, BiGift, BiChevronDown, BiChevronsUp } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import Confetti from "react-confetti";
import { ToastContainer, toast } from "react-toastify";
import EventModel from "../../../Modals/EventModal/Event_popup";
import { MdAttachMoney, MdDone, MdOutlineDone } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import {RxCross2} from "react-icons/rx"

const ChecklistContent = [
  {
    title: "Complete Your Public Profile",
    desc: "Update your profile regularly for audience engagement.",
    tip: "Regularly update your profile with recent achievment.",
    points: [
      "Add a captivating profile picture.",
      "Craft a bio that reflects your expertise.",
      "Highlight achievements in the description.",
      "Share social media links to connect with followers.",
    ],
    buttonName: "Edit Profile",
    buttonLink: "/dashboard/editprofile",
  },
  {
    title: "Create Your First Service",
    desc: "Promote your service on social media.",
    tip: "Boost your reach by promoting your service across all your social media platforms.",
    points: [
      "Use the dashboard to create a service.",
      " Craft a catchy title and description.",
      " Set pricing, availability, and type.",
      " Use 'Analysis' for valuable data.",
    ],
    buttonName: "Dashboard",
    buttonLink: "/dashboard",
  },
  {
    title: "Set Up Your Payments Section",
    desc: "Provide payment details for steady income.",
    tip: "For a stable income, ensure you set up your payments section first and consistently post valuable content.",
    points: [
      "Navigate to Payments in settings.",
      "Provide Account Details for direct earnings.",
    ],
    buttonName: "Account Set-Up",
    buttonLink: "/dashboard/paymentInfo",
  },
  {
    title: "Engage through Events",
    desc: "Cross-promote to expand your audience.",
    tip: "Cross-promote events and collaborations to maximize engagement and grow your audience.",
    points: [
      "Host events and webinars for interaction.",
      "Leverage referral programs for growth.",
      "Collaborate with other creators.",
    ],
    buttonName: "Create an Event",
    buttonLink: "/dashboard",
  },
  {
    title: "Monitor Your Progress",
    desc: "Analyse statistics for insights.",
    tip: "Use statistics to spot trends and tailor your content strategy for even better engagement.",
    points: [
      "Access statistics for views and engagement.",
      "Adapt strategies based on audience preferences.",
    ],
    buttonName: "Statistics Page",
    buttonLink: "/dashboard/stats",
  },
  {
    title: "Connect with User Requests",
    desc: "Foster connections by creating user-requested content.",
    tip: "Building content based on user requests can foster stronger connections.",
    points: ["Check 'Requests' for user inquiries."],
    buttonName: "Requests",
    buttonLink: "/dashboard/requests",
  },
];

const CheckListPopup = ({toClose}) => {
  const navigate = useNavigate()
  const [checklistData, setchecklistData] = useState({});

  const {checkChecklistStatus} = useContext(creatorContext)

  const handleClickAccordian = (e,i) => {
    let accordionItemHeader = document.getElementById(e.target.id);
    accordionItemHeader.classList.toggle("active_body_checklist_header");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    if (accordionItemHeader.classList.contains("active_body_checklist_header")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
      mixpanel.track(`Step ${i+1} - More link`);
    } else {
      accordionItemBody.style.maxHeight = 0;
    }
  };

  useEffect(()=>{
    checkChecklistStatus().then((e) => {
      setchecklistData(e?.result);
    });
  })

  function sumObjectValues(obj) {
    let sum = 0;
  
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Check if the property is a number before adding it to the sum
        if (typeof obj[key] === 'number') {
          sum += obj[key];
        }
      }
    }
  
    return sum;
  }

  return (
    <div className="checklist_outside_wrapper" onClick={()=>{toClose()}}>
      <section className="checklist_main_container" onClick={(e)=>{e?.stopPropagation()}}>
        <div className="first_checklist_section_dashboard">
          <RxCross2 onClick={()=>{mixpanel.track("Checklist Close pop up button"); toClose()}}/>
          <h1>Maximize Your Creator Potential</h1>
          <p>
            Follow these steps to ensure you unlock the full potential of our
            platform and soar to new heights of success!
          </p>

          <span>{checklistData && sumObjectValues(checklistData)} of 6 Completed</span>
        </div>

        <section>
          {ChecklistContent.map((e, i) => {
            return (
              <div className="checklist_card_container">
                <section className="top_body_checklist_header" id={`checkitme${i}`} onClick={(e)=>{handleClickAccordian(e,i)}}>
                  <span>
                    {checklistData && checklistData[e?.title]===1 && <MdOutlineDone size={10} color="white"/>}
                  </span>

                  <h2>
                    Step {i + 1}: {e?.title}
                  </h2>
                  
                </section>


                <section className="bottom_body_checklist_header">



                <span>{e?.desc}</span>

                <p><HiOutlineLightBulb/> Pro Tip: {e?.tip}</p>

                <ul>
                  {e?.points?.map((point) => {
                    return <li>{point}</li>;
                  })}
                </ul>

                <div>
                  <button onClick={()=>{
                    mixpanel.track(`Step ${i+1} - CTA`);
                    navigate(e?.buttonLink)
                  }}>
                    {e?.buttonName} <AiOutlineArrowRight size={15} />
                  </button>
                </div>

                </section>
              </div>
            );
          })}
        </section>
      </section>
    </div>
  );
};

const DashboardStepper = ({ setOpenFirstTimeModal, reviews }) => {
  const navigate = useNavigate();
  const [loadConfetti, setLoadConfetti] = useState(false);
  const [loader, setLoader] = useState(false);
  const [stepperData, setStepperData] = useState({});
  const [openEventPopup, setOpenEventPopup] = useState(false);
  const [openCheckListPopup, setOpenCheckListPopup] = useState(false)

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

      {/* {openEventPopup && (
        <EventModel
          onClose={() => {
            setOpenEventPopup(false);
          }}
        />
      )} */}

      {openCheckListPopup && <CheckListPopup toClose={()=>{setOpenCheckListPopup(false)}}/>}

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
                  stepperData && stepperData["Updated Profile Page"] === 1
                    ? "changeBackgroundToBlackDashboard"
                    : "changeBackgroundToGreyDashboard"
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
                  stepperData && stepperData["Created First Post"] === 1
                    ? "changeBackgroundToBlackDashboard"
                    : "changeBackgroundToGreyDashboard"
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
                  stepperData && stepperData["Acquired Paid User"] === 1
                    ? "changeBackgroundToBlackDashboard"
                    : "changeBackgroundToGreyDashboard"
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
                className={
                  reviews > 0
                    ? "changeBackgroundToBlackDashboard"
                    : "changeBackgroundToGreyDashboard"
                }
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
                  stepperData && stepperData["Setup Payment Account"] === 1
                    ? "changeBackgroundToBlackDashboard"
                    : "changeBackgroundToGreyDashboard"
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
                navigate("createevent")
                mixpanel.track("Share a event");
              }}
              className="dashboard_options"
            >
              <span>Host Event</span>

              <p>Webinars, Workshops, Q&A!</p>
            </div>
          </section>
        </div>

        <button className="checklist_button_desgin_dashboard" onClick={()=>{setOpenCheckListPopup(true)}}>Checklist</button>
      </div>

      <SuperSEO title="Anchors - Dashboard" />
    </>
  );
};

export default DashboardStepper;
