import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import "./Dashboard.css";
import mixpanel from "mixpanel-browser";
import { creatorContext } from "../../../../Context/CreatorState";
import { BsFillPersonFill, BsFillStarFill } from "react-icons/bs";
import { AiOutlineArrowRight, AiOutlineCalendar } from "react-icons/ai";
import { BiCoinStack, BiRupee } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import Confetti from "react-confetti";
import { ToastContainer, toast } from "react-toastify";
import { MdAttachMoney, MdDone, MdOutlineDone } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { RxCross2, RxPlusCircled } from "react-icons/rx";
import { TbChecklist } from "react-icons/tb";
import { IoCopyOutline, IoPeopleSharp } from "react-icons/io5";
import {
  Dropdown1,
  TextField1,
} from "../Create Services/InputComponents/fields_Labels";
import { Button4 } from "../Create Services/InputComponents/buttons";
import { NewCongratsServiceModal } from "../../../Modals/ServiceSuccess/Modal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
    buttonLink: "/dashboard/createevent",
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

const GoalPopup = ({ setData, data, onClose, handleSetGoal }) => {
  return (
    <div className="logout_model_logout" onClick={onClose}>
      <section
        className="goal_create_popup_section_main"
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        <RxCross2
          className="chnageStatusModalCross"
          size={20}
          style={{ top: "25px" }}
          onClick={onClose}
        />
        <h2 className="text_01_dashboard">Create New Goal</h2>

        <div className="goal_create_popup_content_div">
          <div className="left_side_goal_create_popup">
            <Dropdown1
              placeholder="Select Goal Type"
              value={[
                {
                  icon: <BiCoinStack size={16} />,
                  text: "Revenue Generation",
                },
                {
                  icon: <IoPeopleSharp size={16} />,
                  text: "Number of audiences",
                },
              ]}
              selectedValue={(e) => {
                setData({ ...data, goalType: e });
              }}
              name="goalType"
              id="goalType"
            />
            <TextField1
              placeholder="Enter Goal Number"
              onChange={(e) => {
                setData({ ...data, goalNumber: e?.target?.value });
              }}
              name="goalNumber"
              id="goalNumber"
              type="number"
            />
            <Dropdown1
              placeholder="Number of days"
              value={new Array(60).fill(0).map((_, index) => {
                return { icon: <AiOutlineCalendar />, text: index + 1 };
              })}
              selectedValue={(e) => {
                setData({ ...data, days: e });
              }}
              name="days"
              id="days"
            />
          </div>

          <div className="right_side_goal_create_popup">
            <GoalFrame {...data} />

            <span>Goal Preview</span>
          </div>
        </div>

        <Button4
          text="Continue"
          icon={<AiOutlineArrowRight />}
          onClick={handleSetGoal}
        />
      </section>
    </div>
  );
};

const GoalFrame = ({
  goalType = "Number of audiences",
  createdAt = new Date(),
  goalNumber = 299,
  days = 10,
  createCard = false,
  openPopup,
  percent,
}) => {
  const getDate = () => {
    let date = new Date(createdAt);

    const finalDate = new Date(date);
    finalDate.setDate(date?.getDate() + days);

    date = finalDate.toDateString().split(" ");

    return date[2] + " " + date[1] + "' " + date[3];
  };

  return (
    <div className="goal_frame_design_01_wrapper">
      {createCard ? (
        <p onClick={openPopup}>
          <RxPlusCircled size={40} />
          Create New Goal
        </p>
      ) : (
        <>
          <section>
            {goalType === "Revenue Generation" ? (
              <p>
                ₹<span>{goalNumber}</span>
              </p>
            ) : (
              <p>
                <span>{goalNumber}</span>
                audience
              </p>
            )}

            <span>Till {getDate()}</span>
          </section>

          <div>
            <div></div>
            <div></div>
            {percent ? percent + "%" : "--"}
          </div>
        </>
      )}
    </div>
  );
};

const SetGoal = () => {
  const { getAllGoalForCreator, setAGoalForCreator } =
    useContext(creatorContext);

  const [loader, setLoader] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);

  const [refetch, setRefetch] = useState(false);

  const [data, setData] = useState({
    goalType: null,
    goalNumber: null,
    days: null,
  });

  const [allGoals, setAllGoals] = useState([]);

  const handleSetGoal = async () => {
    if (
      data?.goalType &&
      data?.goalNumber &&
      data?.goalNumber > 0 &&
      data?.days
    ) {
      let result = await setAGoalForCreator(data);

      if (result?.success) {
        setOpenSuccessPopup(true);
        setOpenPopup(false);
        setRefetch(!refetch);
      }
    } else {
      toast.error("Fill all the madatory fields", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  useEffect(() => {
    setLoader(true);
    getAllGoalForCreator().then((e) => {
      setAllGoals(e?.goals);
      setLoader(false);
    });
  }, [refetch]);

  return (
    <>
      {openPopup && (
        <GoalPopup
          setData={setData}
          data={data}
          handleSetGoal={handleSetGoal}
          onClose={() => {
            setOpenPopup(false);
          }}
        />
      )}

      {openSuccessPopup && (
        <NewCongratsServiceModal
          type="setGoal"
          onClose={() => {
            setOpenSuccessPopup(false);
          }}
        />
      )}

      {!loader ? (
        <div className="set_goal_outside_wrapper">
          <h2 className="text_01_dashboard">What's Your Goal?</h2>

          {allGoals?.length > 0 ? (
            <div className="all_goal_cards_container">
              {allGoals?.map((element, index) => {
                return (
                  <GoalFrame
                    key={index}
                    {...element?.goal}
                    percent={element?.percent}
                  />
                );
              })}
              <GoalFrame
                createCard={true}
                openPopup={() => {
                  setOpenPopup(true);
                }}
              />
            </div>
          ) : (
            <>
              <span className="text_02_dashboard" style={{ textAlign: "left" }}>
                Set a target of what you want to achieve!
              </span>

              <section>
                <Dropdown1
                  placeholder="Select Goal Type"
                  value={[
                    {
                      icon: <BiCoinStack size={16} />,
                      text: "Revenue Generation",
                    },
                    {
                      icon: <IoPeopleSharp size={16} />,
                      text: "Number of audiences",
                    },
                  ]}
                  selectedValue={(e) => {
                    setData({ ...data, goalType: e });
                  }}
                  name="goalType"
                  id="goalType"
                />
                <TextField1
                  placeholder="Enter Goal Number"
                  onChange={(e) => {
                    setData({ ...data, goalNumber: e?.target?.value });
                  }}
                  name="goalNumber"
                  id="goalNumber"
                  type="number"
                />
                <Dropdown1
                  placeholder="Number of days"
                  value={new Array(60).fill(0).map((_, index) => {
                    return { icon: <AiOutlineCalendar />, text: index + 1 };
                  })}
                  selectedValue={(e) => {
                    setData({ ...data, days: e });
                  }}
                  name="days"
                  id="days"
                />

                <Button4
                  text="Continue"
                  icon={<AiOutlineArrowRight />}
                  onClick={handleSetGoal}
                />
              </section>
            </>
          )}
        </div>
      ) : (
        <Skeleton width="60vw" height={212} />
      )}
    </>
  );
};

const CheckListPopup = ({ toClose }) => {
  const navigate = useNavigate();
  const [checklistData, setchecklistData] = useState({});

  const { checkChecklistStatus } = useContext(creatorContext);

  const handleClickAccordian = (e, i) => {
    let accordionItemHeader = document.getElementById(e.target.id);
    accordionItemHeader.classList.toggle("active_body_checklist_header");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    if (
      accordionItemHeader.classList.contains("active_body_checklist_header")
    ) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
      mixpanel.track(`Step ${i + 1} - More link`);
    } else {
      accordionItemBody.style.maxHeight = 0;
    }
  };

  useEffect(() => {
    checkChecklistStatus().then((e) => {
      setchecklistData(e?.result);
    });
  });

  function sumObjectValues(obj) {
    let sum = 0;

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Check if the property is a number before adding it to the sum
        if (typeof obj[key] === "number") {
          sum += obj[key];
        }
      }
    }

    return sum;
  }

  return (
    <div
      className="checklist_outside_wrapper"
      onClick={() => {
        toClose();
      }}
    >
      <section
        className="checklist_main_container"
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        <div className="first_checklist_section_dashboard">
          <RxCross2
            onClick={() => {
              mixpanel.track("Checklist Close pop up button");
              toClose();
            }}
          />
          <h1>Maximize Your Creator Potential</h1>
          <p>
            Follow these steps to ensure you unlock the full potential of our
            platform and soar to new heights of success!
          </p>

          <span>
            {checklistData && sumObjectValues(checklistData)} of 6 Completed
          </span>
        </div>

        <section>
          {ChecklistContent.map((e, i) => {
            return (
              <div className="checklist_card_container">
                <section
                  className="top_body_checklist_header"
                  id={`checkitme${i}`}
                  onClick={(e) => {
                    handleClickAccordian(e, i);
                  }}
                >
                  <span>
                    {checklistData && checklistData[e?.title] === 1 && (
                      <MdOutlineDone size={10} color="white" />
                    )}
                  </span>

                  <h2>
                    Step {i + 1}: {e?.title}
                  </h2>
                </section>

                <section className="bottom_body_checklist_header">
                  <span>{e?.desc}</span>

                  <p>
                    <HiOutlineLightBulb /> Pro Tip: {e?.tip}
                  </p>

                  <ul>
                    {e?.points?.map((point) => {
                      return <li>{point}</li>;
                    })}
                  </ul>

                  <div>
                    <button
                      onClick={() => {
                        mixpanel.track(`Step ${i + 1} - CTA`);
                        navigate(e?.buttonLink);
                      }}
                    >
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

const DashboardStepper = ({ setOpenFirstTimeModal, reviews, userData }) => {
  const navigate = useNavigate();
  const [loadConfetti, setLoadConfetti] = useState(false);
  const [loader, setLoader] = useState(false);
  const [stepperData, setStepperData] = useState({});
  const [openEventPopup, setOpenEventPopup] = useState(false);
  const [openCheckListPopup, setOpenCheckListPopup] = useState(false);

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
        // "Acquired Free User": 1,
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
          toast.success(
            "Congrats You have successfully completed your first Milestone",
            {
              position: "top-center",
              autoClose: 2000,
            }
          );
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

      {openCheckListPopup && (
        <CheckListPopup
          toClose={() => {
            setOpenCheckListPopup(false);
          }}
        />
      )}

      <div className="main_dashboard_conatiner2">
        {/* MObile ui navbar ---------------- */}
        {window.screen.width < 600 && (
          <section className="navbar_ui_covering_section_mobile"></section>
        )}

        {/* Set Goal -------------------- */}
        <SetGoal />

        {/* share experience cta -------------------- */}
        <div className="main_dashboard_design_box">
          <h2 className="text_01_dashboard">Share Your Expertise</h2>

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
                navigate("createevent");
                mixpanel.track("Share a event");
              }}
              className="dashboard_options"
            >
              <span>Host Event</span>

              <p>Webinars, Workshops, Q&A!</p>
            </div>
          </section>
        </div>

        {/* stepper --------------------  */}
        <div className="stepper_outside_wrapper_dashboard">
          <h2 className="text_01_dashboard">Stepper</h2>
          {/* <span className="text_02_dashboard" style={{ textAlign: "left" }}>
            Your creative journey starts here. Explore premium content and
            events.
          </span> */}

          {window.screen.width > 600 && (
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
          )}
        </div>

        {window.screen.width < 600 && userData?.inviteCode && (
          <section className="invite_sidebar">
            <h3>INVITE CODE</h3>
            <span>
              Share & avail EXCLUSIVE{" "}
              <a
                href="https://go.anchors.in/invite-code-benefit"
                target="_blank"
                style={{ color: "unset" }}
              >
                benefits
              </a>
              !*
              <br />
              -limited time offer
            </span>
            <div
              onClick={() => {
                mixpanel.track("copy invite code");
                toast.info("Invite Code Copied Successfully", {
                  position: "top-center",
                  autoClose: 1500,
                });
                navigator.clipboard.writeText(userData?.inviteCode);
              }}
            >
              {userData?.inviteCode} <IoCopyOutline />
            </div>
          </section>
        )}

        {window.screen.width > 600 && (
          <button
            className="checklist_button_desgin_dashboard"
            onClick={() => {
              setOpenCheckListPopup(true);
            }}
          >
            <TbChecklist size={24} color="#D0D0D0" /> Checklist
          </button>
        )}
      </div>

      <SuperSEO title="Anchors - Dashboard" />
    </>
  );
};

export default DashboardStepper;
