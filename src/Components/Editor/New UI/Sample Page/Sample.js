import React, { useEffect, useState } from "react";
import "./Sample.css";
import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";
import { mix, motion } from "framer-motion";

import Banner1 from "./images/Banner (6).png";
import Banner2 from "./images/Banner (8).png";
import Banner3 from "./images/Banner (9).png";
import Banner4 from "./images/Banner (10).png";
import Banner5 from "./images/Banner (11).png";
import image1 from "./images/image1.png";
import image2 from "./images/image2.png";
import image4 from "./images/image4.png";
import image5 from "./images/image5.png";
import image6 from "./images/image6.png";
import image7 from "./images/image7.png";
import { Footer3 } from "../../../Footer/Footer2";
import NoMobileScreen from "../../../Layouts/Error Pages/NoMobileScreen";
import mixpanel from "mixpanel-browser";
import { MdKeyboardArrowDown } from "react-icons/md";

const PersonalizedSection = () => {
  const containerVariant = (index) => {
    let yoffset;
    let xoffset;
    let time;

    switch (index) {
      case 0:
        yoffset = 0;
        xoffset = 140;
        time = 0.2;
        break;
      case 1:
        yoffset = -40;
        xoffset = 70;
        time = 0.4;
        break;
      case 2:
        yoffset = -80;
        xoffset = 0;
        time = 0.6;
        break;
      case 3:
        yoffset = -40;
        xoffset = -70;
        time = 0.4;
        break;
      case 4:
        yoffset = 0;
        xoffset = -140;
        time = 0.2;
        break;
    }

    return {
      from: {
        opacity: 0,
        y: "300px",
      },
      to: {
        opacity: 1,
        y: yoffset + "px",
        x: xoffset + "px",
        transition: {
          duration: time * 2,
          ease: "easeInOut",
        },
      },
    };
  };

  const imgSrc = [Banner1, Banner2, Banner3, Banner4, Banner5];

  return (
    <section className="personalized_section_sample_page">
      <div>
        {imgSrc?.map((e, i) => {
          return (
            <motion.img
              variants={containerVariant(i)}
              initial="from" // here default type is tween and not spring because it has duration
              whileInView="to"
              src={e}
              alt=""
              key={i}
            />
          );
        })}
      </div>
      <h2 className="header_sample_page01">Personalized Invitation Cards</h2>
      <p className="header_sample_page02" style={{ textAlign: "center" }}>
        Give your attendees a personalized touch with shareable invite cards
        they can proudly share on their social media platforms.
      </p>
    </section>
  );
};

function Sample() {
  const [openModel, setOpenModel] = useState(false);

  let imgSrcSection1 = [image1, image2, image4];
  let imgSrcSection2 = [image5, image6, image7];

  useEffect(() => {
    mixpanel.track("Page Visit");
  }, []);

  const imgSectionVariant = (index) => {
    return {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
        transition: {
          duration: index * 1,
          ease: "ease",
        },
      },
    };
  };

  const imgVariant = {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
      transition: {
        duration: 0.85,
        ease: "ease",
      },
    },
  };

  if (window.screen.width < 800) {
    return <NoMobileScreen />;
  }

  return (
    <div className="sample_page_wrapper">
      {/* Hero Section  */}
      <section className="main_header_component_event_page">
        <Navbar2
          open={openModel}
          close={() => {
            setOpenModel(false);
          }}
          noAccount={true}
        />

        {/* Main detail of the component */}

        <div className="main_title_event_box">
          <h1>Increase Your Event Registrations with anchors</h1>

          <button
            onClick={() => {
              localStorage.getItem("jwtToken") &&
              localStorage.getItem("isUser") === ""
                ? window.open("/dashboard", "_self")
                : window.open("/signup/creators", "_self");

              mixpanel.track("Host Your Event");
            }}
          >
            Host Your Event
          </button>
        </div>

        <a href="#benefits">
          <MdKeyboardArrowDown className="arrow_button_sample_page" />
        </a>
      </section>

      {/* benefits section ----------- */}

      <section className="benefits_sample_page" id="benefits">
        <h2>Focus on the experience, while anchors handles the rest.</h2>
        <section>
          <div className="left_division_sample_page">
            <h2 className="header_sample_page01">Stunning Event Pages</h2>
            <p className="header_sample_page02">
              Captivate your audience with visually appealing event pages that
              leave a lasting impression.
            </p>
            <button
              className="button_sample_page01"
              onClick={() => {
                window.open("https://go.anchors.in/PvlD");
                mixpanel.track("Check out Offering 1");
              }}
            >
              Check Out a Sample
            </button>
          </div>
          <div className="right_division_sample_page">
            {imgSrcSection1?.map((e, i) => {
              return (
                <motion.img
                  src={e}
                  alt=""
                  variants={imgSectionVariant(i)}
                  initial="from" // here default type is tween and not spring because it has duration
                  whileInView="to"
                />
              );
            })}
          </div>
        </section>
      </section>

      <section className="sample_page_divison_section">
        <div className="left_division_sample_page">
          <h2 className="header_sample_page01">
            Amplify with Referral Rewards
          </h2>
          <p className="header_sample_page02">
            Unlock the power of word-of-mouth marketing with our dynamic
            referral program and climb the leaderboard for maximum reach.
          </p>
          <button
            className="button_sample_page01"
            onClick={() => {
              window.open("/static/success");
              mixpanel.track("Check out Offering 2");
            }}
          >
            Check Out a Sample
          </button>
        </div>
        <div className="right_division_sample_page2">
          {imgSrcSection2?.map((e, i) => {
            return (
              <motion.img
                src={e}
                alt=""
                variants={imgSectionVariant(i)}
                initial="from" // here default type is tween and not spring because it has duration
                whileInView="to"
              />
            );
          })}
        </div>
      </section>

      <section className="sharing_section_sample_page" style={{width:"88vw",marginTop:"150px"}}>
        <motion.img
          src={require("./images/image8.png")}
          alt=""
          variants={imgVariant}
          initial="from" // here default type is tween and not spring because it has duration
          whileInView="to"
        />
        <div>
          <h2 className="header_sample_page01" style={{ textAlign: "right" }}>
            Host Events with Upto 3 Speakers!
          </h2>
          <p className="header_sample_page02" style={{ textAlign: "right" }}>
            Plan captivating events showcasing three speakers to ensure maximum
            engagement and excitement for your audience!
          </p>
        </div>
      </section>

      {/* Personalized section */}
      <PersonalizedSection />

      <section className="sharing_section_sample_page">
        <motion.img
          src={require("./images/image3.png")}
          alt=""
          variants={imgVariant}
          initial="from" // here default type is tween and not spring because it has duration
          whileInView="to"
        />
        <div>
          <h2 className="header_sample_page01" style={{ textAlign: "right" }}>
            Effortless Content Sharing
          </h2>
          <p className="header_sample_page02" style={{ textAlign: "right" }}>
            We streamline your event's design and content efforts, so you can
            focus on what matters most.
          </p>
        </div>
      </section>

      <section className="extra_section_sample_page">
        <h3>Are you ready to revolutionize your event hosting experience?</h3>
        <button
          className="button_sample_page01"
          onClick={() => {
            localStorage.getItem("jwtToken") &&
            localStorage.getItem("isUser") === ""
              ? window.open("/dashboard", "_self")
              : window.open("/signup/creators", "_self");
            mixpanel.track("Yes, I'm ready!");
          }}
        >
          Yes, I'm ready!{" "}
        </button>
      </section>
      <Footer3 />
    </div>
  );
}

export default Sample;
