import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Sharing.css";
import {
  AiOutlineLinkedin,
  AiOutlineInstagram,
  AiOutlineYoutube,
} from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import { FaTelegram } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import ServiceContext from "../../../../Context/services/serviceContext";

const generateTemplates = (serviceInfo) => {
  const clickableUrl =
    serviceInfo?.service?.copyURL.length > 7
      ? serviceInfo?.service?.copyURL
      : `https://www.anchors.in/s/${serviceInfo?.service?.slug}`;
  return {
    link01: (
      <p>
        I've got something for you!🔥 <br />
        <br /> One thing important to a content creator is to be able to create
        meaningful impact. On that note, I'm introducing my latest post,{" "}
        {serviceInfo?.service?.sname} which I believe you'll find valuable.{" "}
        <br />
        <br /> Simply copy and paste the following URL to access it:{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>{" "}
        <br />
        <br /> Thank you for your continuous support on this journey!✨
      </p>
    ),
    link02: (
      <p>
        Another day of doing something meaningful! 😇 <br />
        <br /> I'm excited to introduce my latest launch,{" "}
        {serviceInfo?.service?.sname}, which took me hours of hard work. Not
        only am I excited to see your response to it, but also full of hope that
        such things keep reaching the right people, helping them in any way or
        form. <br /> Here's the URL to access it:{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>{" "}
        <br />
        <br /> Let me know your thoughts in the comments!
      </p>
    ),
    Insta01: (
      <p>
        🚀 Exciting News! {serviceInfo?.service?.sname} 🚀 <br />
        <br /> Hello y'all, <br /> I'm excited to introduce you to
        {serviceInfo?.service?.sname}, which is all about changing the game &
        creating impact. I hope that it will be helpful for you all. Tap the
        following URL to get all the details, and let's embark on this journey
        of impact together:{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>
      </p>
    ),
    Insta02: (
      <p>
        Hey insta fan,
        <br />
        <br /> I've just launched {serviceInfo?.service?.sname} and it is the
        ONLY thing you need to see on the internet today! Find more details via
        the following URL and let me know what more content you'd like from me:{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>{" "}
        😄
      </p>
    ),
    wATe01: (
      <p>
        Hey there! <br />
        <br /> I've just launched {serviceInfo?.service?.sname}, and I'm
        delighted to share it with you 😋 Your feedback is invaluable to me, so
        please check it out here{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>
        , and I'd love to hear your thoughts.🤝🏻 <br />
        <br /> Thank you for your continued support!
      </p>
    ),
    wATe02: (
      <p>
        Hi there! <br />
        <br /> I've recently created {serviceInfo?.service?.sname}, and given
        our association, I'd love to hear your thoughts on it! Here's the URL:{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>
        .Also, please share it ahead with whoever might find it useful 🥰 <br />
        <br /> Many thanks!
      </p>
    ),
    utube01: (
      <p>
        Hello, fantastic viewers,
        <br />
        <br /> I'm elated to introduce you to {serviceInfo?.service?.sname}, a
        project that's close to me. It offers a deep dive into the topics
        covered in the video. So join me on this journey and open the following
        URL to get started:{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>
        .<br />
        <br /> Your support and feedback are what keeps me going. Let's make a
        difference together!
      </p>
    ),
    utube02: (
      <p>
        Sharing a recent launch of {serviceInfo?.service?.sname} with you, which
        offers a deeper insight into the topics covered in the video. It is
        available via this link:{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
          <br />
          <br />
        </a>{" "}
        Can't wait to hear your thoughts in the comments and create more such
        content for you!
      </p>
    ),
  };
};

const Card = ({ text, serviceInfo, id }) => {
  const navigate = useNavigate();

  let copyTemplate = () => {
    // Create a temporary DOM element to parse the HTML
    const tempElement = document.getElementById(id);

    // Extract the text content from the <p> element
    const paragraphText = tempElement.querySelector("p")?.textContent;
    navigator.clipboard.writeText(paragraphText);
    toast.info("Copied Template successfully");
  };

  return (
    <div className="Card_wrapper_01">
      <img src={serviceInfo?.service?.mobileSimg ?? serviceInfo?.service?.simg } />
      <section id={id}>{text}</section>
      <button
        onClick={() => {
          // toast.info("Copied link successfully");
          // navigator.clipboard.writeText(
          //   serviceInfo?.service?.copyURL.length > 7
          //     ? serviceInfo?.service?.copyURL
          //     : `https://www.anchors.in/s/${serviceInfo?.service?.slug}`
          // );
          copyTemplate();
        }}
      >
        Copy Template
      </button>
    </div>
  );
};

const Template = () => {
  const navigate = useNavigate();
  const { serviceInfo, getserviceinfo, compareJWT } =
    useContext(ServiceContext);
  const [approvedUser, setapprovedUser] = useState(false);

  const { slug } = useParams();

  useEffect(() => {
    getserviceinfo(slug).then((e) => {
      // console.log('e',e);
      compareJWT(e[0]?._id).then((result) => {
        if (result) {
          setapprovedUser(true);
        } else {
          navigate("dashboard/mycontent");
        }
      });
    });
  }, []);

  const templateSection = generateTemplates(serviceInfo);

  return (
    <div>
      <div className="template_wrapper_00">
        <span style={{ paddingLeft: "20px" }}>
          <h1>Sharing Boost Conversion</h1>
          <p>Now sharing is very easy</p>
        </span>
        <div className="template_wrapper_00_sharing">
          <span style={{ background: "#282828", padding: "8px 20px" }}>
            <BsWhatsapp />
            Whatsapp Template
          </span>
          <section>
            <Card
              text={templateSection?.wATe01}
              serviceInfo={serviceInfo}
              id="wAte01"
            />
            <Card
              text={templateSection?.wATe02}
              serviceInfo={serviceInfo}
              id="wAte02"
            />
          </section>
          <p>Note : copy or edit If you want to change message.</p>
        </div>
        <div className="template_wrapper_00_sharing">
          <span style={{ background: "#282828", padding: "8px 20px" }}>
            <AiOutlineLinkedin />
            LinkedIn Template
          </span>
          <section>
            <Card
              text={templateSection?.link01}
              serviceInfo={serviceInfo}
              id="link01"
            />
            <Card
              text={templateSection?.link02}
              serviceInfo={serviceInfo}
              id="link02"
            />
          </section>
          <p>Note : copy or edit If you want to change message.</p>
        </div>
        <div className="template_wrapper_00_sharing">
          <span
            style={{
              background: "#282828",
              padding: "8px 20px",
            }}
          >
            <AiOutlineInstagram />
            Instagram Template
          </span>
          <section>
            <Card
              text={templateSection?.Insta01}
              serviceInfo={serviceInfo}
              id="Insta01"
            />
            <Card
              text={templateSection?.Insta02}
              serviceInfo={serviceInfo}
              id="Insta02"
            />
          </section>
          <p>Note : copy or edit If you want to change message.</p>
        </div>
        <div className="template_wrapper_00_sharing">
          <span style={{ background: "#282828", padding: "8px 20px" }}>
            <FaTelegram />
            Telegram Template
          </span>
          <section>
            <Card
              text={templateSection?.wATe01}
              serviceInfo={serviceInfo}
              id="wATe03"
            />
            <Card
              text={templateSection?.wATe02}
              serviceInfo={serviceInfo}
              id="wATe04"
            />
          </section>
          <p>Note : copy or edit If you want to change message.</p>
        </div>
        <div className="template_wrapper_00_sharing">
          <span style={{ background: "#282828", padding: "8px 20px" }}>
            <AiOutlineYoutube />
            Youtube Video Template
          </span>
          <section>
            <Card
              text={templateSection?.utube01}
              serviceInfo={serviceInfo}
              id="utube01"
            />
            <Card
              text={templateSection?.utube02}
              serviceInfo={serviceInfo}
              id="utube02"
            />
          </section>
          <p>Note : copy or edit If you want to change message.</p>
        </div>
      </div>
    </div>
  );
};
export default Template;
