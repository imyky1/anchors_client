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
  //title2: "No charges till you don't start earning",
  points: [
    "Offer Free/Paid Services",
    "Detailed Analysis",
    "Hassle Free Payouts",
    "Exclusive community Access",
    "Creator Guide Access",
    "Recommendations for conversation",
    "Quick Response Support",
    "Exclusive Session Access",
  ],
};

const FAQDetails = [
  {
    question: "Why don't you charge a monthly platform fee?",
    answer:
      "At anchors, we believe in simplicity. We want to make it easy for creators to use our platform without worrying about recurring fees. We only charge a fee if you earn money from our platform. It's as simple as that."
  },
  {
    question: "What is Quick Response team Access?",
    answer:
      "Our Quick Response support team is dedicated to resolving your queries promptly. You can expect a response within 1 hour. Access to this team is available through your dashboard."
  },
  {
    question: "Can I join this platform for free?",
    answer:
      "Absolutely! Joining our platform is completely free. There are no hidden charges or fees to join, and we also do not charge a monthly fee."
  },
  {
    question:
      "If I share free content, do I still need to pay?",
    answer:
      "No, you do not need to pay if you are providing only free services. anchors is here to support creators, whether they offer free or paid content."
  },
  {
    question: "How is anchors different from other platforms?",
    answer:
      "anchors isn't just another tool or SaaS platform. We are a creator's home, offering everything they need to unlock their full potential. Our mission is to constantly raise the bar, setting new standards in the creator economy and delivering the best experience possible. We're committed to competing with ourselves, continuously improving to empower creators and help them reach new heights."
  },
  {
    question: "Why is there an eligibility criteria to join the platform?",
    answer:
      "anchors is an exclusive platform for premium creators. By maintaining exclusivity, we ensure a high-quality community that fosters growth and unlocks the full potential of the creator economy."
  }
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

      <section
        className="eligibility_pricingpage"
        id="eligibility"
        style={{ margin: "unset" }}
      >
        <h1 className="headers1_pricing">Do you have what it takes?</h1>
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
      <NavbarCreator  newfeature={true}/>

      <div className="main_pricing_wrapper">
        <div className="pricingIntroContainer">
          <h1 className="text01_pricing_box">Our Pricing</h1>
          <span className="text02_pricing_box">Simple & Transparent</span>
          <div className="pricing_design01">
          No Monthly fees
          </div>
          <p>
            We believe in keeping things simple. As a creator, you won't have to
            worry about any monthly fees. You can use our platform without any
            recurring costs.
          </p>
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
