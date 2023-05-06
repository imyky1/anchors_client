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
  title2: "No charges till you don't start earning",
  points: [
    "Unlock new opportunities",
    "Maximize your income potential",
    "Dynamic Community",
    "Good insights on your resources",
    "Hassle free Payouts",
  ],
};

const FAQDetails = [
  {
    question: "Is anchors a free platform?",
    answer:
      "There is no charge to join anchors. It however is also an exclusive community aimed at fostering a community of creators and encouraging monetisation of the hard work that goes into their creations. There is a tiny percentage we charge if anchors has enabled you to earn from your content.",
  },
  {
    question: "What do the charges look like?",
    answer:
      "We’ve kept it squarely simple – From whatever revenue you make, a 10% fixed percent will go to anchors to keep enabling more creators like you to earn and grow. (This percentage can reduce from time to time based on offers going on)",
  },
  {
    question:
      "When can I withdraw the money? Is there a minimum limit for payment withdrawal?",
    answer:
      "Your money is safely stored in your anchors account and you may withdraw the money whenever you want. To make a payment withdrawal, you only need a minimum of Rs. 100 in your account.",
  },
  {
    question: "What happens if I don't make any money on anchors?",
    answer:
      "If you don't make any money on anchors, there’s nothing that you need to pay us. As a free platform, you can continue to market your content on anchors. You may also take our help to grow and expand your audience.",
  },
  {
    question: "How does anchors ensure the security of my payment information?",
    answer:
      "Razorpay is our trusted payment gateway partner which ensures all your payments and related information is secure and completely safe.",
  },
  {
    question:
      "Where do I reach out if I have more questions or need help with my account?",
    answer:
      "You may e-mail us at info@anchors.in for any assistance and we’ll promptly get back to you within 24 hours.",
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
        {data?.points?.map((e, i) => {
          return (
            <p className="cardDesignPricingText02" key={i}>
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

      <section className="eligibility_mainpage" id="eligibility" style={{margin:"unset"}}>
          <h1 className="headers1_mainpage">Do you have what it takes?</h1>
          <p>
            To unlock your full potential in a community exclusively for you!
            {/* through boundless innovation and sustainable growth */}
          </p>
          <span>Choose a platform - Put your best foot forward</span>
          <div className="eligibility_check_section">
            <section>
              <span
                className={platform === 1 && "active_platform"}
                onClick={() => {
                  setPlatform(1);
                }}
              >
                <i class="fa-brands fa-linkedin-in fa-2x"></i>
              </span>
              <span
                className={platform === 2 && "active_platform"}
                onClick={() => {
                  setPlatform(2);
                }}
              >
                <i class="fa-brands fa-youtube fa-2x"></i>
              </span>
              <span
                className={platform === 3 && "active_platform"}
                onClick={() => {
                  setPlatform(3);
                }}
              >
                <i class="fa-brands fa-telegram fa-2x"></i>
              </span>
              <span
                className={platform === 4 && "active_platform"}
                onClick={() => {
                  setPlatform(4);
                }}
              >
                <i class="fa-brands fa-instagram fa-2x"></i>
              </span>
            </section>
            <input
              type="number"
              placeholder="Number of followers"
              value={followers}
              onChange={(e) => {
                setFollowers(e.target.value);
              }}
            />
          </div>
          <button onClick={handleCheckEligibility}>Check Eligibility</button>
        </section>
    </>
  );
};


const FAQs = ({ data }) => {
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
      <h1 className="faq_pricing_text01">Frequently Asked Question</h1>
      <span className="faq_pricing_text02">Get all your answers</span>
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
            Focus on creating great content while we take care of the pricing
            details
          </span>
          <button
            onClick={() => {
              mixpanel.track("Clicked Join now on Pricing page");
            }}
          >
            <a
              href="#eligibility"
              style={{ color: "unset", textDecoration: "none" }}
            >
              Join Now
            </a>
          </button>
          <div className="pricing_design01">
            <span>No Monthly Cost </span>
            <span>No Cost Setup</span>
          </div>
        </div>

        <section>
          {/* <CardDesign data={PricingCard1} /> */}
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
