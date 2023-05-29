import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Waitlist.css";
import { SuperSEO } from "react-super-seo";
import { toast, ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import logo from "../Main Page/Images/logo-beta.png";
import CreatorInfo from "../Modals/CreatorProfile/Modal1";
import { creatorContext } from "../../Context/CreatorState";
import HelpModal from "../Modals/ModalType01/HelpModal";
import mixpanel from "mixpanel-browser";
import { Footer3 } from "../Footer/Footer2";
import himanshu from "../../Utils/Images/himanshuk.png";
import SignupModal from "../Modals/ModalType01/SignupModal";
import Confetti from "react-confetti";

const FAQDetails = [
  {
    question: "What is invite code ?",
    answer:
      "An invite code is a unique access key that allows creators to join anchors, an exclusive platform for premium creators community",
  },
  {
    question: "How to use invite code ?",
    answer:
      "To use an invite code, simply enter it in the invite code box above.",
  },
  {
    question: "How to get ahead in the waitlist queue ?",
    answer:
      "To increase your chances of moving up in the waitlist queue, engage with the anchors creators and ask for invite code from them.",
  },
  {
    question: "How to get invite code ?",
    answer:
      "You can ask for the code & get it from the creators already registered on anchors",
  },
];

const CreatorsWaitlist = [
  {
    cimg: "https://www.anchors.in:5000/api/file/1670005634078--himanshu.bf15583cd698b88970c3.jpg",
    cname: "Himanshu Shekhar",
    tag: "68K Followers",
    link: "https://www.linkedin.com/in/himanshushekhar16/",
  },
  {
    cimg: himanshu,
    cname: "Himanshu Kumar",
    tag: "130K Followers",
    link: "https://www.linkedin.com/in/himanshukumarmahuri/",
  },
];

const WaitlistHero = ({ wNumber }) => {
  return (
    <div className="wailtist_hero_section">
      <section className="wailtist_number_header">{wNumber}</section>
      <h2>Congratulations!</h2>
      <p>
        You have successfully joined our waitlist. We'll let you know as soon as
        a spot opens up and you can claim your spot.
      </p>
      <div>
        <img src={require("../../Utils/Images/creatorCombined.png")} alt="" />
        {wNumber && <span>+{wNumber - 5}</span>}
      </div>
      {wNumber && <span>{`${wNumber - 1} Creators Ahead`}</span>}
    </div>
  );
};

const WaitlistMiddleSection = () => {
  return (
    <div className="waitlist_middle_details_section">
      <div>
        <h1>Don't wait any Longer! </h1>
        <p>
          Accelerate your waitlist journey with an exclusive invite code.
          Connect with our creators to get it . Why wait when you can jump
          ahead?
        </p>
        {/* <button className="waitlist_buttontype"><a href="#inviteCodeAccess" style={{textDecoration:"none",color:"unset"}}>Get Invite Access</a></button> */}
      </div>

      <section>
        {CreatorsWaitlist?.map((e) => {
          return (
            <div
              className="creator_display_data_wailtist"
              key={e?.cname}
              onClick={() => {
                window.open(e?.link);
              }}
            >
              <div>
                <img src={e?.cimg} alt="" />
              </div>
              <p>{e?.cname}</p>
              <span>{e?.tag}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
};

const WailtistInviteCodeSection = () => {
  const [inviteCode, setInviteCode] = useState();
  const [allreadyFilled, setAllreadyFilled] = useState(false);
  const [codeApplied, setCodeApplied] = useState(false);
  const [formPassed, setFormPassed] = useState(false)
  const [formData, setFormData] = useState({ platform: "", followers: 0 });

  const {
    verifyInviteCode,
    UpdateCodeInTellUsMoreForm,
    getTellUsMoreFormData,
    updateStatus,
  } = useContext(creatorContext);

  const handleChange = (e) => {
    setInviteCode(e.target.value);
  };
  

  const VerifyCode = () => {
    if (inviteCode?.length > 0) {
      let process = verifyInviteCode(inviteCode).then((e) => {
        if (e?.success) {
          if (e?.verified) {
            UpdateCodeInTellUsMoreForm(inviteCode.toUpperCase()).then((e) => {
              if (e) {
                setCodeApplied(true);
                const result = CheckUpdation()
                if(result){
                  window.scrollTo(0,0)
                  updateStatus()
                  setFormPassed(true)
                }
              } else {
                toast.info("Couldn't update the Code, Please Try Again!!", {
                  position: "top-center",
                  autoClose: 2500,
                });
              }
            });
          } else {
            toast.error("Incorrect Code Used, Try Again!!", {
              position: "top-center",
              autoClose: 2000,
            });
          }
        } else {
          toast.error("Some error occured while checking, Try again", {
            position: "top-center",
            autoClose: 1500,
          });
        }
      });

      toast.promise(
        process,
        {
          pending: "Please Wait..",
          error: "Try Again by reloading the page!",
        },
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
  };

  const CheckUpdation = () => {
    switch (formData?.platform) {
      case "LinkedIn":
        if (parseInt(formData?.followers) > 10000) {
          return true
        } else {
          return false
        }
        
      case "Youtube":
        if (parseInt(formData?.followers) > 10000) {
          return true
        } else {
          return false
        }
        
      case "Instagram":
        if (parseInt(formData?.followers) > 10000) {
          return true
        } else {
          return false
        }
        
      case "Telegram":
        if (parseInt(formData?.followers) > 5000) {
          return true
        } else {
          return false
        }
        
      case "Facebook":
        if (parseInt(formData?.followers) > 5000) {
          return true
        } else {
          return false
        }
        

      default:
        return false
        
    }
  };

  useEffect(() => {
    getTellUsMoreFormData().then((e) => {
      setFormData({platform:e?.form?.platform,followers:e?.form?.followers})
      if (e?.form?.inviteCode.length > 0) {
        setInviteCode(e?.form?.inviteCode);
        setAllreadyFilled(true);
      }
    });
  }, []);

  return (
    <>
      {formPassed && (
        <>
          <SignupModal />
          <Confetti width={window.screen.width} height={window.screen.height} />
        </>
      )}

      <div className="waitlist_invite_section" id="inviteCodeAccess">
        {window.screen.width > 600 && <img src={require("../../Utils/Images/rocketicon.png")} alt="" />}
        <h1>Do you have the Invite Code</h1>
        <section>
          <input
            type="text"
            onChange={handleChange}
            disabled={allreadyFilled || codeApplied}
            value={inviteCode}
            onKeyDown={(e)=>{if(e?.key === "Enter"){VerifyCode()}}}
          />
          <button
            className="waitlist_buttontype"
            style={
              allreadyFilled
                ? { background: "#7B7B7B" }
                : codeApplied
                ? { background: "#58D96E" }
                : {}
            }
            onClick={VerifyCode}
            disabled={allreadyFilled || codeApplied}
          >
            {allreadyFilled
              ? "Code Applied"
              : codeApplied
              ? "Code Applied"
              : "Enter"}
          </button>
        </section>
        <div>Invite Code help you to jump the Queue</div>
      </div>
    </>
  );
};

const WaitlistFAQs = ({ data }) => {
  const handleClick = (e) => {
    let accordionItemHeader = document.getElementById(e.target.id);
    accordionItemHeader.classList.toggle("active");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    if (accordionItemHeader.classList.contains("active")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
    } else {
      accordionItemBody.style.maxHeight = 0;
    }
  };

  return (
    <div className="faq_pricing_wrapper">
      <h1 className="faq_wailtist_header">Frequently Asked Question</h1>
      <div className="accordion">
        {data?.map((e, i) => {
          return (
            <div className="accordion-item" key={i}>
              <div
                className="accordion-item-header"
                onClick={handleClick}
                id={`FAQ${i}`}
              >
                {e?.question}
              </div>
              <div className="accordion-item-body">
                <div className="accordion-item-body-content">{e?.answer}</div>
              </div>
              {/* <!-- /.accordion-item-body --> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function Waitlist() {
  const navigate = useNavigate();
  const [openCreatorModal, setOpenCreatorModal] = useState(false);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [wNum, setWNum] = useState(null);
  const {
    getAllCreatorInfo,
    allCreatorInfo,
    basicNav,
    getWaitlistNumber,
    getTellUsMoreFormData,
  } = useContext(creatorContext);

  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Waitlist Page");
  }, []);

  // responsible for getting the page data -----------------------------------
  useEffect(() => {
    const process = async () => {
      await getAllCreatorInfo();
      getTellUsMoreFormData().then((e) => {
        if (e?.success && !e?.already) {
          toast.info("Please fill the tell us more form", {
            position: "top-center",
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate("/tellusmore");
          }, 2000);
        }
      });
      let e = await getWaitlistNumber();
      setWNum(e?.wNumber);
    };

    toast.promise(
      process,
      {
        pending: "Please Wait..",
        error: "Try Again by reloading the page!",
      },
      {
        position: "top-center",
        autoClose: 2000,
      }
    );

    process();
  }, []);

  // redirection ------------------------------------------
  if (basicNav?.status !== 0) {
    // logout the person then give him message
    navigate("/");
    return null;
  }

  return (
    <>
      <ToastContainer />
      <CreatorInfo
        open={openCreatorModal}
        openHelp={() => {
          setOpenHelpModal(true);
        }}
        toClose={() => {
          setOpenCreatorModal(false);
        }}
        userData={basicNav}
        alternateInfo={allCreatorInfo}
      />

      <HelpModal
        open={openHelpModal}
        toClose={() => {
          setOpenHelpModal(false);
        }}
      />

      <div className="waitlist_wrapper">
        {/* Waitlist navbar ----------------------------------------------------------------------- */}
        <section className="waitlist_navbar">
          <img
            onClick={() => {
              navigate("/");
            }}
            src={logo}
            alt=""
            className="logo_waitlist"
          />
          <LazyLoadImage
            effect="blur"
            onClick={(e) => {
              e?.stopPropagation();
              setOpenCreatorModal(!openCreatorModal);
            }}
            className="creators_navbar_image"
            src={
              allCreatorInfo?.profile
                ? allCreatorInfo?.profile
                : basicNav?.photo
                ? basicNav?.photo
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHaAfOzOEovz1u7rsIMbl_SzAAxk99xlyxAVJ4r3475UvmyHLFVZSZkaGSbLFc5PNRO3A&usqp=CAU"
            }
            alt=""
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src =
                "data:image/png;base64,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";
            }}
          />
        </section>

        {/* Wailtist main Deatisl section ------------------------------------------------------ */}
        <section className="wailtist_main_section">
          <WaitlistHero wNumber={wNum} />
          <WaitlistMiddleSection />
          <WailtistInviteCodeSection />
          <WaitlistFAQs data={FAQDetails} />
        </section>
        <Footer3 />
      </div>

      <SuperSEO title="Anchors - Waitlist" />
    </>
  );
}

export default Waitlist;
