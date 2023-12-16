import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";
import { BiCheckCircle } from "react-icons/bi";
import { IoCopy } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEventSeat } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi2";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { TbCopy } from "react-icons/tb";
import {
  Button1,
  Button3,
} from "../../Editor/New UI/Create Services/InputComponents/buttons";

// Popup coming from down
const CongratsServiceCreation = ({ link, type, slug }) => {
  const navigate = useNavigate();

  return (
    <div className="model_outside_wrapper_success_modal">
      <div className="congratualtion_popup_outer">
        <div className="congratualtion_popup_inside">
          <RxCross2
            color="grey"
            style={{
              position: "absolute",
              right: "5vw",
              top: "40px",
              cursor: "pointer",
            }}
            size={25}
            onClick={() => {
              navigate("/dashboard");
            }}
          />
          <div className="congratualtion_popup_inside_symbol">
            <BiCheckCircle
              className="congratualtion_popup_inside_symbol_design"
              size={66}
              color="#10B981"
            />
          </div>
          <div className="congratualtion_popup_inside_symbol_middle">
            {type === "service" ? "Uploaded successfully" : "Congratulations"}
            <section>
              {type === "service"
                ? "Now its time to spread the word"
                : "Event Created Successfully!"}
            </section>
          </div>
          <div className="congratualtion_popup_inside_symbol_last">
            {type === "service" ? (
              <>
                <button
                  className="button_serviceModal_creation01"
                  onClick={() => {
                    toast.info("Copied link successfully");
                    navigator.clipboard.writeText(link);
                  }}
                >
                  Unique tracking link
                </button>
                <button
                  className="button_serviceModal_creation01"
                  onClick={() => {
                    navigate(`/dashboard/shareTemplate/${slug}`);
                  }}
                >
                  Get the message template
                </button>
              </>
            ) : (
              <>
                <div
                  className="congratualtion_popup_inside_symbol_last_01"
                  onClick={() => {
                    toast.info("Copied link successfully");
                    navigator.clipboard.writeText(link);
                  }}
                >
                  {link}
                  <IoCopy size={20} />
                </div>
                <button
                  className="congratualtion_popup_inside_symbol_last_button"
                  onClick={() => {
                    navigate("/dashboard/mycontents");
                  }}
                >
                  Go to My Events
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Normal center popup-----

// used in 1. Service successfull creation
// 2. edit profile updated

const NewCongratsServiceCreation = ({
  link,
  type,
  slug,
  firstTimeModalOpenDashboard,
  onClose
}) => {
  const navigate = useNavigate();

  const Data = {
    service: {
      text: "Service Uploaded Successfully",
      subtext: "Let's tell the world  about it!",
      button1: {
        text: "Unique Tracking Link",
        rightIcon: <TbCopy size={24} />,
        action: () => {
          toast.info("Copied link successfully");
          navigator.clipboard.writeText(link);
        },
      },
      button2: {
        text: "AI-Generated Templates",
        rightIcon: <AiOutlineArrowRight size={24} />,
        action: () => {
          navigate(`/dashboard/shareTemplate/${slug}`);
        },
      },
      svgColor: "#10B981",
    },

    event: {
      text: "Event Created Successfully",
      subtext: "Let's invite people to it now!",
      button1: {
        text: "Unique Tracking Link",
        rightIcon: <TbCopy size={24} />,
        action: () => {
          toast.info("Copied link successfully");
          navigator.clipboard.writeText(link);
        },
      },
      button2: {
        text: "Go to Events",
        rightIcon: <AiOutlineArrowRight size={24} />,
        action: () => {
          navigate(`/dashboard/mycontents`);
        },
      },
      svgColor: "#10B981",
    },
    editProfile: {
      text: "Your profile is now updated!",
      subtext: "Let's start earning, shall we?",
      button1: {
        text: "Host Event",
        leftIcon: <MdOutlineEventSeat size={24} />,
        action: () => {
          firstTimeModalOpenDashboard
            ? window.open("/dashboard?firstTime=true", "_self")
            : navigate(`/dashboard/createevent`);
        },
      },
      button2: {
        text: "Create Service",
        leftIcon: <HiDocumentText size={24} />,
        action: () => {
          firstTimeModalOpenDashboard
            ? window.open("/dashboard?firstTime=true", "_self")
            : navigate("/dashboard", "_self");
        },
      },
      svgColor: "#10B981",
      crossLink: "/dashboard/editprofile",
    },
    setGoal:{
      text: "Congratulations",
      subtext: "You Have Successfully Set Your Goal",
      button1: {
        text: "Continue",
        rightIcon: <AiOutlineArrowRight size={24} />,
        action: () => {
          onClose()
        },
      },
      svgColor: "#10B981",
      crossLink: "/dashboard",
    }
  };

  return (
    <div className="model_outside_wrapper_success_modal">
      <div className="new_congratualtion_popup_outer">
        <div className="congratualtion_popup_inside">
          <RxCross2
            className="chnageStatusModalCross"
            size={25}
            onClick={() => {
              window.open(Data[type]?.crossLink ?? "/dashboard", "_self");
            }}
          />
          <div className="congratualtion_popup_inside_symbol">
            <BiCheckCircle
              className="congratualtion_popup_inside_symbol_design"
              size={66}
              color={Data[type]?.svgColor}
            />
          </div>
          <div className="new_congratualtion_popup_inside_symbol_middle">
            {Data[type]?.text}
            <section>{Data[type]?.subtext}</section>
          </div>
          <div className="congratualtion_popup_inside_symbol_last">
          {Data[type]?.button1 &&
            <button
              className="button_serviceModal_creation01"
              onClick={Data[type]?.button1.action}
            >
              {Data[type]?.button1?.leftIcon && Data[type]?.button1?.leftIcon}
              {Data[type]?.button1?.text}
              {Data[type]?.button1?.rightIcon && Data[type]?.button1?.rightIcon}
            </button>}

            {Data[type]?.button2 &&
            <button
              className="button_serviceModal_creation01"
              onClick={Data[type]?.button2?.action}
            >
              {Data[type]?.button2?.leftIcon && Data[type]?.button2?.leftIcon}
              {Data[type]?.button2?.text}
              {Data[type]?.button2?.rightIcon && Data[type]?.button2?.rightIcon}
            </button>}
          </div>
        </div>
      </div>
    </div>
  );
};

//  sample static data modal ---------------

export const StaticSampleDataModal = ({ type, onClose }) => {
  const [pageNumber, setPageNumber] = useState(0);

  const Data = {
    pdfTitle: [
      <>
        <h1>The title should :</h1>
        <ul>
          <li>Have clear purpose</li>
          <li>Encourage people to click & check it out</li>
          <li>Be Simple (& catchy)</li>
        </ul>
      </>,
      <>
        <h1>Example :</h1>
        <ul>
          <li>Master Product Management without Coding: The Ultimate Guide</li>
          <li>The Ultimate guide - Provides a hook for people to click</li>
          <li>Master Product Management - Has clear purpose</li>
          <li>
            Without Coding - Targets a problem and defines an audience too
          </li>
        </ul>
      </>,
    ],

    pdfDescription: [
      <>
        <h1>
          The following sections, if covered, ensure a high conversion rate -
        </h1>
        <ul>
          <li>What is included in this document?</li>
          <li>Who is this for?</li>
          <li>How can people benefit from it?</li>
        </ul>

        <p>Try to generalise as little as possible. Keep it personalised</p>
      </>,
      <>
        <h1>Personalisation</h1>
        <p>
          Imagine a career that opens doors to exciting opportunities, high
          earning potential, and the chance to shape innovative products. But
          you might be wondering, "Is it possible for someone without coding
          knowledge?
        </p>
        <br />
        <p>
          I'm Ravi, and I've been right where you are. I didn't start with a
          coding background, but I had a burning passion for product management.
          I knew that this was my dream career, and I made it happen. The
          knowledge, strategies, and resources I used are now condensed into a
          single, comprehensive guide. I want to share this guide with you and
          help you unlock your Product Management potential.
        </p>
      </>,
      <>
        <h1>What is included in this document?</h1>
        <p>
          Inside "Master the Art of Product Management Without Coding," you'll
          discover:
        </p>
        <ul>
          <li>
            A step-by-step roadmap to becoming a proficient Product Manager,
            covering everything from market research to product launch.
          </li>

          <li>
            Real-world examples and case studies that turn theory into practical
            knowledge.
          </li>

          <li>
            Downloadable resources, including templates and checklists to
            streamline your tasks.
          </li>

          <li>
            A bonus list of 1000+ companies actively hiring Product Managers.
          </li>

          <li>
            Lifetime access, ensuring you remain up-to-date with industry
            changes.
          </li>

          <li>
            This is your complete guide, your blueprint to success, and your
            ticket to a career without boundaries.
          </li>
        </ul>
      </>,
      <>
        <h1>Who is this for?</h1>
        <p>
          If you belong to any of the following groups, then this document is
          tailored for you:
        </p>
        <ul>
          <li>
            A college student who aspires to break into Product Management but
            lacks coding skills.
          </li>
          <li>
            A professional seeking to transition from a non-coding background to
            a career in Product Management.
          </li>
          <li>
            Anyone with the ambition to excel as a Product Manager and create
            exceptional products.
          </li>
          <li>
            Even if you possess coding skills but desire to become a Product
            Manager, this document is equally valuable for achieving your goal.
          </li>
        </ul>
      </>,
      <>
        <h1>How can people benefit from it?</h1>
        <p>
          This is your complete guide, your blueprint to success, and your
          ticket to a career without boundaries. By investing in this guide,
          you're investing in your future, career, and dreams. Start your
          journey to success today!
        </p>
      </>,
    ],

    eventDescription: [
      <>
        <p>
          In "Product Management Unleashed: Master Without Coding", we will
          empower you to excel in Product Management without having to learn
          coding skills, by sharing hands-on knowledge with real-world examples
          and case studies. Additionally, you will get -
        </p>
        <ul>
          <li>
            Exclusive Insights: Gain wisdom from accomplished Product Managers
            who've soared to success without coding.
          </li>
          <li>
            Ultimate Guide Preview: Get a sneak peek of our comprehensive guide
            filled with knowledge, strategies, and resources.
          </li>
          <li>Q&A Session</li>
          <li>Self-Paced Learning</li>
        </ul>
        <p>
          This event is ideal for aspiring product managers, career changers,
          and those with coding skills seeking to transition into Product
          Management.
        </p>
        <p>
          Register now to open doors to exciting opportunities, high earning
          potential, and the chance to shape innovative products. We have
          limited seats, filling fast! Don't miss out on priceless
          knowledge—act!
        </p>
      </>,
    ],
  };

  return (
    <div className="model_outside_wrapper_success_modal">
      <div
        className="new_congratualtion_popup_outer"
        style={{ padding: "40px" }}
      >
        <div className="data_static_modal_main_body_box congratualtion_popup_inside">
          <RxCross2
            className="chnageStatusModalCross"
            size={25}
            onClick={onClose}
          />
          <h1>Sample Content</h1>
          <div className="data_static_modal_content_data_main_body">
            {Data[type][pageNumber]}
          </div>

         { Data[type]?.length > 1 && <div className="button_static_modal_content_modal">
            <Button1
              text={Data[type]?.length === pageNumber + 1 ? "Finish" : "Next"}
              icon={<AiOutlineArrowRight />}
              onClick={() => {
                if (Data[type]?.length === pageNumber + 1) {
                  onClose();
                } else {
                  setPageNumber(pageNumber + 1);
                }
              }}
            />
            <span>
              {pageNumber + 1}/{Data[type]?.length}
            </span>
            {pageNumber !== 0 && (
              <Button3
                text="Previous"
                icon={<AiOutlineArrowLeft />}
                onClick={() => {
                  setPageNumber(pageNumber - 1);
                }}
              />
            )}
          </div>}
        </div>
      </div>
    </div>
  );
};

export const NewCongratsServiceModal = NewCongratsServiceCreation;
