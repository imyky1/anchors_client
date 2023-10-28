import React, { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "./Sharing.css";
import {
  AiOutlineLinkedin,
  AiOutlineInstagram,
  AiOutlineYoutube,
} from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import { FaTelegram } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ServiceContext from "../../../../Context/services/serviceContext";

const generateServiceTemplates = (serviceInfo) => {
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
        <b>{serviceInfo?.service?.sname}</b> which I believe you'll find
        valuable. <br />
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
        <b>{serviceInfo?.service?.sname}</b>, which took me hours of hard work.
        Not only am I excited to see your response to it, but also full of hope
        that such things keep reaching the right people, helping them in any way
        or form. <br /> Here's the URL to access it:{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>{" "}
        <br />
        <br /> Let me know your thoughts in the comments!
      </p>
    ),
    Insta01: (
      <p>
        🚀 Exciting News! <b>{serviceInfo?.service?.sname}</b> 🚀 <br />
        <br /> Hello y'all, <br /> I'm excited to introduce you to
        <b>{serviceInfo?.service?.sname}</b>, which is all about changing the
        game & creating impact. I hope that it will be helpful for you all. Tap
        the following URL to get all the details, and let's embark on this
        journey of impact together:{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>
      </p>
    ),
    Insta02: (
      <p>
        Hey insta fan,
        <br />
        <br /> I've just launched <b>{serviceInfo?.service?.sname}</b> and it is
        the ONLY thing you need to see on the internet today! Find more details
        via the following URL and let me know what more content you'd like from
        me:{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>{" "}
        😄
      </p>
    ),
    wATe01: (
      <p>
        Hey there! <br />
        <br /> I've just launched <b>{serviceInfo?.service?.sname}</b>, and I'm
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
        <br /> I've recently created <b>{serviceInfo?.service?.sname}</b>, and
        given our association, I'd love to hear your thoughts on it! Here's the
        URL:{" "}
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
        <br /> I'm elated to introduce you to{" "}
        <b>{serviceInfo?.service?.sname}</b>, a project that's close to me. It
        offers a deep dive into the topics covered in the video. So join me on
        this journey and open the following URL to get started:{" "}
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
        Sharing a recent launch of <b>{serviceInfo?.service?.sname}</b> with
        you, which offers a deeper insight into the topics covered in the video.
        It is available via this link:{" "}
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

// Event sharing templates ----------
const generateEventTemplates = (serviceInfo) => {
  const clickableUrl =
    serviceInfo?.event?.copyURL.length > 7
      ? serviceInfo?.event?.copyURL
      : `https://www.anchors.in/e/${serviceInfo?.event?.slug}`;
  return {
    link01: (
      <p>
        It just happened and I couldn't wait to share it with you all! <br />
        <br /> Join me at our upcoming event on{" "}
        <b>{new Date(serviceInfo?.event?.startDate).toDateString()}</b> .
        We've got a lot in store and tons of valuable insights to share. Don't
        miss out – mark your calendars! 👥📆
        <br />
        <br /> See you there!{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>
      </p>
    ),
    link02: (
      <p>
        Ready for an unforgettable event experience? <br />
        <br /> Save the date for <b>{serviceInfo?.event?.sname}</b> on {" "}
        <b>{new Date(serviceInfo?.event?.startDate).toDateString()}</b>.
        We're bringing a range of valuable content, engaging discussions, and a
        vibrant community. <br /><br /> Get ready for an enriching experience! 💡💬{" "}
        <br />
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>
      </p>
    ),
    Insta01: (
      <p>
        🌟 Get ready for a one-of-a-kind event! <br />
        <br /> Join us on{" "}
        <b>
          {new Date(serviceInfo?.event?.startDate).toDateString()}
        </b>{" "}
        for <b>{serviceInfo?.event?.sname}</b>. We're serving up knowledge,
        inspiration, and a dash of fun. Link in the bio.
        <br />
        Stay tuned for details! 📚🗨️
        <br />
        <br />
        #eventalert #savethedate #upcomingevent #staytuned
      </p>
    ),
    Insta02: (
      <p>
        🎉 The countdown begins! <br />
        <br /> Join us on{" "}
        <b>
          {new Date(serviceInfo?.event?.startDate).toDateString()}
        </b>{" "}
        for <b>{serviceInfo?.event?.sname}</b>. It's a gathering of
        like-minded individuals, knowledge sharing, and memorable moments. Link
        in the bio.
        <br />
        Stay tuned for updates! 🌆🗓️
        <br />
        <br />
        #eventtime #getready #upcomingevent #staytuned
      </p>
    ),
    wATe01: (
      <p>
        Hey there! <br />
        <br /> I'm delighted to invite you to our upcoming event,{" "}
        <b>{serviceInfo?.event?.sname}</b>, on{" "}
        <b>{new Date(serviceInfo?.event?.startDate).toDateString()}</b>.
        It's going to be an outstanding experience, and I'd love to see you
        there.<br/><br/> Check out all the details via this link -{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>
      </p>
    ),
    wATe02: (
      <p>
        It's happening! We're hosting <b>{serviceInfo?.event?.sname}</b>, on{" "}
        <b>{new Date(serviceInfo?.event?.startDate).toDateString()}</b>.
        You're personally invited to join us for a day filled with inspiration
        and connections. Find all necessary details here -{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>
      </p>
    ),
    utube01: (
      <p>
        🎥 Additonally, we're thrilled to share exciting news. We're hosting an
        upcoming event, <b>{serviceInfo?.event?.sname}</b>, on{" "}
        <b>{new Date(serviceInfo?.event?.startDate).toDateString()}</b>.
        We'll be covering a variety of topics, offering valuable insights, and
        providing a platform for engaging discussions. Don't forget to book your
        slot and get a chance to ask me questions one-on-one!<br/><br/> Here's the link{" "}
        <a href={clickableUrl} style={{ color: "grey" }}>
          {clickableUrl}
        </a>
        .<br />
        <br /> Be sure to subscribe for the latest event updates and keep an eye
        out for event-related content!
      </p>
    ),
    utube02: (
      <p>
      As mentioned in the video, we want to share something special. Save the date for <b>{serviceInfo?.event?.sname}</b>, on{" "}
      <b>{new Date(serviceInfo?.event?.startDate).toDateString()}</b>.
      Our event promises an enriching experience with a diverse range of content and discussions. Be sure to book your slot today and avail the Early Bird Offer!<br/> <br/> Here's the link - {" "}
      <a href={clickableUrl} style={{ color: "grey" }}>
        {clickableUrl}
      </a>
      .<br />
      <br /> 🎥 Don't forget to subscribe for the latest event updates, and stay tuned for exclusive event-related content!
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
      <img
        src={serviceInfo?.service?.mobileSimg ?? serviceInfo?.service?.simg ?? serviceInfo?.event?.simg}
      />
      <section id={id}>{text}</section>
      <button
        onClick={() => {
          copyTemplate();
        }}
      >
        Copy Template <IoCopyOutline size={20} />
      </button>
    </div>
  );
};

const Template = () => {
  const navigate = useNavigate();
  const { serviceInfo, getserviceinfo, compareJWT,geteventinfo,eventInfo } =
    useContext(ServiceContext);
  const [approvedUser, setapprovedUser] = useState(false);
  const [serviceType, setServiceType] = useState();  // event or service

  const { slug } = useParams();

    // custom hook to get querries
    function useQuery() {
      const { search } = useLocation();
      return useMemo(() => new URLSearchParams(search), [search]);
    }
    const query = useQuery();
  

  useEffect(() => {
    if (query.get("type") === "event") {
      setServiceType("event");
      geteventinfo(slug).then((e) => {
        // console.log('e',e);
        compareJWT(e[0]?._id).then((result) => {
          if (result) {
            setapprovedUser(true);
          } else {
            navigate("dashboard/mycontent");
          }
        });
      });
    }
    else{
      setServiceType("download");
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
    }
  }, [query]);

  const templateSection = serviceType === "event" ? generateEventTemplates(eventInfo) : generateServiceTemplates(serviceInfo);

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
              serviceInfo={serviceType === "event" ? eventInfo : serviceInfo}
              id="wAte01"
            />
            <Card
              text={templateSection?.wATe02}
              serviceInfo={serviceType === "event" ? eventInfo : serviceInfo}
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
              serviceInfo={serviceType === "event" ? eventInfo : serviceInfo}
              id="link01"
            />
            <Card
              text={templateSection?.link02}
              serviceInfo={serviceType === "event" ? eventInfo : serviceInfo}
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
              serviceInfo={serviceType === "event" ? eventInfo : serviceInfo}
              id="Insta01"
            />
            <Card
              text={templateSection?.Insta02}
              serviceInfo={serviceType === "event" ? eventInfo : serviceInfo}
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
              serviceInfo={serviceType === "event" ? eventInfo : serviceInfo}
              id="wATe03"
            />
            <Card
              text={templateSection?.wATe02}
              serviceInfo={serviceType === "event" ? eventInfo : serviceInfo}
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
              serviceInfo={serviceType === "event" ? eventInfo : serviceInfo}
              id="utube01"
            />
            <Card
              text={templateSection?.utube02}
              serviceInfo={serviceType === "event" ? eventInfo : serviceInfo}
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
