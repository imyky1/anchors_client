import React, { useState, useEffect } from "react";
import "./Pricing.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer.js";
import mixpanel from "mixpanel-browser";
import { toast, ToastContainer } from "react-toastify";
import { SuperSEO } from "react-super-seo";
import Modal2 from "../Modals/ModalType01/Modal2";
import Modal1 from "../Modals/ModalType01/Modal1";
import NavbarCreator from "../Layouts/Navbar Creator/Navbar";
import { BsFillCheckCircleFill } from "react-icons/bs";

const PricingCard1 = {
  title1: "Unlock",
  title2: "new opportunities to maximize your income potential with anchors.",
  title3: "Lets Sail Together",
  points: [
    "Unlock new opportunities",
    "Maximize your income potential",
    "Dynamic Community",
    "Good insights on your resources",
    "Hassle free Payouts",
  ],
  button: "Join Now",
};

const PricingCard2 = {
  title: { text: "10%", subtext: "of Revenue" },
  title2: "All the Exclusive Features to boost your Services.",
  points: [
    "Unlimited Free/Paid Services",
    "Collect Payment",
    "Premium Templates",
    "Performance Detailed Analysis",
    "Communicate with your Audience",
  ],
};

const FAQDetails = [
  {
    question: "What is Anchors? ",
    answer:
      "Anchors is a SaaS-based company that offers services for creators to sell their digital products such as PDFs, Excel sheets, and video tutorials, and generate revenue by selling them.",
  },
  {
    question: "Who can use Anchors?",
    answer:
      "Anchors can be used by anyone who wants to sell their digital products online and generate revenue from them. It is especially useful for creators, educators, and professionals who want to monetize their knowledge and expertise.",
  },
  {
    question: "How does Anchors help me generate revenue?",
    answer:
      "Anchors provides a platform for creators to sell their digital products and earn revenue from them. Creators can set their own prices for their products.",
  },
  {
    question: "How do I get Started with Anchors?",
    answer:
      "Creators can sign up for an account on the Anchors website, upload their digital products, and start selling them immediately. The process is quick and easy, and Anchors provides resources and support to help creators get started",
  },
];

const CardDesign = ({ data }) => {
  return (
    <div className="cardDesign_pricing">
      <section>
        <p style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <span className="cardDesignPricingText04">{data?.title?.text}</span>
          <span className="cardDesignPricingText01">
            {data?.title?.subtext}
          </span>
        </p>
        <p className="cardDesignPricingText01">
          <span className="cardDesignPricingText03">{data?.title1} </span>
          {data?.title2}
        </p>
        <span className="cardDesignPricingText01 cardDesignPricingText05">
          {data?.title3}
        </span>
      </section>

      <div className="points_section_pricing_card">
        {data?.points?.map((e) => {
          return (
            <p className="cardDesignPricingText02">
              <BsFillCheckCircleFill color="#71717A" />
              {e}
            </p>
          );
        })}
      </div>

      {data?.button && (
        <button
          onClick={() => {
            mixpanel.track("Clicked Join now on Pricing page");
          }}
        >
          <a
            href="#eligibility"
            style={{ color: "unset", textDecoration: "none" }}
          >
            {data?.button}
          </a>
        </button>
      )}
    </div>
  );
};

const EligibiltySection = () => {
  const [platform, setPlatform] = useState("Choose Platform");
  const [followers, setFollowers] = useState();
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalFail, setOpenModalFail] = useState(false);

  const handleCheckEligibility = () => {
    if (platform !== 0 && followers !== "") {
      mixpanel.track("Clicked Check Eligibility on Pricing Page", {
        platform:
          platform === 1
            ? "Linkedin"
            : platform === 2
            ? "Youtube"
            : platform === 3
            ? "Telegram"
            : platform === 4
            ? "Instagram"
            : "None",
        followers,
      });
      switch (platform) {
        case 1:
          if (parseInt(followers) >= 10000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        case 2:
          if (parseInt(followers) >= 5000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        case 3:
          if (parseInt(followers) >= 2000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        case 4:
          if (parseInt(followers) >= 10000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      <Modal1
        open={openModalSuccess}
        toClose={() => {
          setOpenModalSuccess(false);
          setPlatform(0);
          setFollowers("");
        }}
      />
      <Modal2
        open={openModalFail}
        toClose={() => {
          setOpenModalFail(false);
          setPlatform(0);
          setFollowers("");
        }}
      />

      <section
        className="eligibility_mainpage"
        id="eligibility"
        style={{ margin: "unset", padding: "unset" }}
      >
        <h1
          className="headers1_mainpage"
          style={{ color: "white", fontSize: "50px" }}
        >
          Do you have what it takes ?
        </h1>
        <p>
          Unlocking the full potential of the creator economy through boundless
          innovation and sustainable growth
        </p>
        <span style={{ color: "#FFFFFF" }}>Choose a platform </span>
        <div className="eligibility_check_section eligibilty_pricing">
          <section>
            <span
              className={platform === 1 && "active_platform"}
              onClick={() => {
                setPlatform(1);
              }}
            >
              <i className="fa-brands fa-linkedin-in fa-2x"></i>
            </span>
            <span
              className={platform === 2 && "active_platform"}
              onClick={() => {
                setPlatform(2);
              }}
            >
              <i className="fa-brands fa-youtube fa-2x"></i>
            </span>
            <span
              className={platform === 3 && "active_platform"}
              onClick={() => {
                setPlatform(3);
              }}
            >
              <i className="fa-brands fa-telegram fa-2x"></i>
            </span>
            <span
              className={platform === 4 && "active_platform"}
              onClick={() => {
                setPlatform(4);
              }}
            >
              <i className="fa-brands fa-instagram fa-2x"></i>
            </span>
          </section>
          <input
            type="text"
            placeholder="Number of followers"
            value={followers}
            onChange={(e) => {
              setFollowers(e.target.value);
            }}
          />
        </div>
        <button onClick={handleCheckEligibility}>
          {window.screen.width < 600
            ? "Let’s Get Started"
            : "Check Eligibility"}
        </button>
      </section>
    </>
  );
};

const FAQs = ({ data }) => {
  return (
    <div className="faq_pricing_wrapper">
      <h1 className="faq_pricing_text01">Frequently Asked Question</h1>
      <span className="faq_pricing_text02">Get all your answers</span>

      <div class="tabs">
        {data?.map((e, i) => {
          return (
            <div class="tab" key={e?.question}>
              <input
                type="checkbox"
                id={`chck${i + 1}`}
                className="checkbox_accordian"
                style={{ display: "none" }}
              />
              <label class="tab-label" htmlFor={`chck${i + 1}`}>
                {e?.question}
              </label>
              <div class="tab-content">{e?.answer}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function Pricing() {
  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Pricing Page");
  }, []);

  return (
    <>
      <NavbarCreator />

      <div className="main_pricing_wrapper">
        <div className="pricingIntroContainer">
          <h1 className="text01_pricing_box">Pricing</h1>
          <span className="text02_pricing_box">
            Our Pricing is as simple as pie, We only charge when you make Money{" "}
          </span>
          <div className="pricing_design01">
            <span>No Monthly Cost </span>
            <span>No Cost Setup</span>
          </div>
        </div>

        <section>
          <CardDesign data={PricingCard1} />
          <CardDesign data={PricingCard2} />
        </section>

        <section>
          <EligibiltySection />
        </section>

        <section>
          <FAQs data={FAQDetails} />
        </section>
      </div>

      <Footer />
      <ToastContainer />
      <SuperSEO title="Anchors - Pricing" />
    </>
  );
}

export default Pricing;
