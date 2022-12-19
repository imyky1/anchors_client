import React, { useContext, useState, useEffect } from "react";
import "./Model.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { creatorContext } from "../../Context/CreatorState";
import ReactEditor from "../Editor/Editor";
import { host } from "../../config/config";
import { emailcontext } from "../../Context/EmailState";
import mixpanel from "mixpanel-browser";

function Email_Model_One({
  open,
  onClose,
  progress,
  creatorID,
  serviceName,
  serviceSlug,
  serviceCopyURL,
}) {
  const context = useContext(creatorContext);
  const {
    getAllSubscribers,
    getSubsInfo,
    getBasicCreatorInfo,
    basicCreatorInfo,
  } = context;

  const [users, setUsers] = useState(0);
  const [sending, setsending] = useState(false);

  useEffect(() => {
    getBasicCreatorInfo(creatorID).then(() => {});
    getUserMails();
  }, []);

  //EMail Sending API Context

  const getUserMails = async () => {
    const subsData = await getAllSubscribers();
    const subsInfod = await getSubsInfo(subsData);
    if (subsInfod.length !== 0) {
      let users = "";
      for (let index = 0; index < subsInfod.length; index++) {
        let email = subsInfod[index]?.email ? subsInfod[index]?.email : "";
        users = users + email + ",";
      }
      setUsers(users.split(",").filter((e) => e.length !== 0).length);
      return users;
    }
    return null;
  };

  const sendMail = async (userMails) => {
    const res = await fetch(
      "https://6ht3n8kja3.execute-api.ap-south-1.amazonaws.com/sendEmail",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorName: basicCreatorInfo?.name,
          senderEmail: `${basicCreatorInfo?.name
            ?.split(" ")
            .join("_")
            .toLowerCase()}@anchors.in`,
          receiverEmail: "singhyuvraj0506@gmail.com,raviahirwar660@gmail.com",
          message: {
            greet: "Hey Buddy",
            main: `This is your friend ${basicCreatorInfo?.name} and I hope you enjoyed all the resources over Anchors.\nRecently I uploaded one more resource on <b>\"${serviceName}\"</b>.I think you gonna love this and find it helpful.\nSo what are you waiting for Check here...`,
            closing: `Your Friend`,
          },
          subject: `Message from ${basicCreatorInfo?.name}`,
          buttonText: "Go to Service",
          link: `https://www.anchors.in/r/${serviceCopyURL}`,
        }),
      }
    );
    console.log(res);
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    progress(0);
    setsending(true);
    //mixpanel.track("Email Sent to Subscribers", {
    //    serviceName: "The Service Name",
    //    creatorName: "CreatorName"
    //})
    const userMails = await getUserMails();
    console.log(userMails);
    if (userMails) {
      await sendMail(userMails);
      toast.success("Email Sent Successfully", {
        position: "top-center",
        autoClose: 2000,
      });
      onClose();
    } else {
      console.log("No Subscribers");
    }
    progress(100);
    setsending(false);
    //setsent(true)
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div onClick={onClose} className="model">
        <div onClick={(e) => e.stopPropagation()} className="model_main_box">
          <span className="model_question">
            <span style={{ color: "green" }}>{users}</span>
            <br /> Total Subscribers
          </span>
          <span className="model_gyan">
            this email will be send to {users}, to notify about the service. Are
            you sure you want to send email to them?
          </span>

          <div className="model_buttons">
            <button className="model_button" onClick={onClose}>
              Cancel
            </button>
            <button className="model_button" onClick={handleSubmitEmail}>
              {!sending ? <>Please Send</> : <>Sending...</>}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

function Email_Model_Two({
  open,
  onClose,
  progress,
  creatorID,
  serviceID,
  serviceName,
  serviceSlug,
  serviceCopyURL,
  serviceBanner,
}) {
  const { getAllSubscribers, allSubscribers, basicNav } =
    useContext(creatorContext);

  const { saveEmailData, sendEmail, sendBulkEmailFromBackend } =
    useContext(emailcontext);

  useEffect(() => {
    if (document.querySelector(".mail_content")) {
      document.querySelector(".mail_content").innerHTML = Content;
    }
  }, [open]);

  useEffect(() => {
    getAllSubscribers();
  }, [creatorID]);

  const getUserMails = async () => {
    const subsData = await getAllSubscribers();
    if (subsData.length !== 0) {
      let users = [];
      const items = 100; // no of items allowed to email
      for (let index = 0; index < subsData.length; index++) {
        let temp = {};
        let email = subsData[index]?.userID?.email
          ? subsData[index]?.userID?.email
          : "";
        temp.to = email;
        users.push(temp);
      }

      let temp = [];
      var messageID = [];
      const numberOfMails =
        users?.length % items === 0
          ? parseInt(users?.length / items)
          : parseInt(users?.length / items) + 1;
      for (let i = 0; i < numberOfMails; i++) {
        temp.push(users.slice(items * i, items * i + items));
      }
      return temp;
    }
    return null;
  };


  const [sending, setsending] = useState(false);

  const [Subject, setSubject] = useState(`New Message from ${basicNav?.name}`);
  const [Content, setContent] = useState(
    `This is your friend ${basicNav?.name} and I hope you enjoyed all the resources over Anchors.Recently I uploaded one more resource on <b>\"${serviceName}\"</b>.I think you gonna love this and find it helpful.<br><br>So what are you waiting for Check here...`
  );

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    progress(0);
    setsending(true);
    mixpanel.track("Email Sent to Subscribers", {
      serviceName: serviceName,
      creatorName: basicNav?.name,
    });
    const userMails = await getUserMails();
    const userMails2 = [
      [{
        to: "magdalen.kulas@gmail.com",
      },
      {
        to: "randall88@parisian.net",
      },
      {
        to: "raviahirwar660@gmail.com",
      },
      {
        to: "jerry97@hotmail.com",
      },
      {
        to: "xjones@macejkovic.com",
      },
      {
        to: "singhyuvraj0506@gmail.com",
      },
      {
        to: "adrian.stehr@gmail.com",
      },
      {
        to: "rajpootyuvraj02@gmail.com",
      },
      {
        to: "jmertz@yahoo.com",
      },
      {
        to: "noelia22@toy.biz",
      },
      {
        to: "yoyouv2002@gmail.com",
      },
      {
        to: "ravi@anchors.in",
      }]
    ];
    //const items = 100; // no of items allowed to email
    if (userMails) {
      toast.info(
        `Sending Mail in Progress, it may take up to few minutes and it would be shown on your list once you refresh.`,
        { position: "top-center", autoClose: 5000 }
      );

      await sendBulkEmailFromBackend(
        serviceID,
        userMails,
        serviceName,
        basicNav?.name ? basicNav?.name : "Anchors",
        serviceSlug,
        serviceBanner,
        Subject,
        Content
      );

      //for (let index = 0; index < temp.length; index++) {
      //  (function (index) {
      //    setTimeout(async () => {
      //      var success = await sendEmail(
      //        temp[index],
      //        serviceName,
      //        serviceCopyURL
      //          ? `https://www.anchors.in/r/${serviceCopyURL}?utm_source=email_notify&utm_medium=email&utm_campaign={${serviceName}}`
      //          : `https://www.anchors.in/s/${serviceSlug}?utm_source=email_notify&utm_medium=email&utm_campaign={${serviceName}}`,
      //        serviceBanner,
      //        basicNav?.name ? basicNav?.name : "Anchors"
      //      );
      //      messageID.push(success[0].headers["x-message-id"]);
      //    }, 1000 * index);
      //  })(index);
      //}

      //setTimeout(() => {
      //  saveEmailData(
      //    serviceID,
      //    Subject,
      //    Content,
      //    messageID,
      //    "Notify",
      //    userMails.length
      //  );
      //  toast.success("Email Sent Successfully", {
      //    position: "top-center",
      //    autoClose: 2000,
      //  });
      setsending(false);
      onClose();
      //}, temp.length * 1000);
      //
      //setTimeout(() => {
      // window.location.reload();
      //}, userMails.length * 1000 + 2000);
    } else {
      toast.info("No Subscribers", {
        position: "top-center",
        autoClose: 2000,
      });
      setsending(false);
    }
    progress(100);
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div onClick={onClose} className="model">
        <div
          onClick={(e) => e.stopPropagation()}
          className="model_main_box email_box"
        >
          <span className="model_question">Send Email to Subscriber</span>

          <form noValidate autoComplete="off" className="email_form">
            <div>
              <label htmlFor="subjectEmail" className="entry_labels">
                Subject
              </label>
              <input
                type="text"
                name="subjectEmail"
                id="subjectEmail"
                placeholder="Subject"
                //onChange={(e) => {
                //  setSubject(e.target.value);
                //}}
                value={Subject}
              />
            </div>
            <div>
              <label htmlFor="contentEmail" className="entry_labels">
                Mail Content
              </label>
              <div className="mail_content"></div>
              {/* <div className="editorinemail">
                <ReactEditor
                  readOnly={false}
                  content={Content}
                  setContent={setContent}
                />
              </div> */}
            </div>
          </form>
          <p className="email_subs">
            The Email will be send to {allSubscribers?.length} users
          </p>

          <div>
            <button
              className="model_button email_button"
              onClick={handleSubmitEmail}
            >
              {sending ? <>Sending</> : <>Send Email</>}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export const Email_Model1 = Email_Model_One;
export const Email_Model2 = Email_Model_Two;
