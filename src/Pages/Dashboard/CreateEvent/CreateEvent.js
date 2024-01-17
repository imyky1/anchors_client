import React, { useContext, useEffect, useRef, useState } from "react";
import "./CreateEvent.css";
import { CreateEventDemo2 } from "../../../Components/Editor/New UI/Create Services/CreateServiceDemo";
import { IoArrowBackOutline } from "react-icons/io5";
import { FirstPage, FourthPage, SecondPage, ThirdPage } from "./Steps";
import { IoMdCheckmark } from "react-icons/io";
import { linkedinContext } from "../../../Context/LinkedinState";
import mixpanel from "mixpanel-browser";
import { toast } from "react-toastify";
import ServiceContext from "../../../Context/services/serviceContext";
import { host } from "../../../config/config";
import { toBlob } from "html-to-image";
import PNGIMG from "../../../Utils/Images/default_user.png";
import { NewCongratsServiceModal } from "../../../Components/Modals/ServiceSuccess/Modal";
import { LoadThree } from "../../../Components/Modals/Loading";
import { useNavigate } from "react-router-dom";

const StepsChecker = ({ currentPage }) => {
  return (
    <div className="steps_checker_create_event">
      <section className={currentPage === 1 && `active_step_create_event`}>
        <span className={currentPage > 1 && "passed_step_create_event"}>
          {currentPage > 1 ? <IoMdCheckmark color="#FAFAFA" size={12} /> : "1"}
        </span>
        <p>Event Details</p>
      </section>
      <div></div>
      <section className={currentPage === 2 && `active_step_create_event`}>
        <span className={currentPage > 2 && "passed_step_create_event"}>
          {currentPage > 2 ? <IoMdCheckmark color="#FAFAFA" size={12} /> : "2"}
        </span>
        <p>Speaker Details </p>
      </section>
      <div></div>
      <section className={currentPage === 3 && `active_step_create_event`}>
        <span className={currentPage > 3 && "passed_step_create_event"}>
          {currentPage > 3 ? <IoMdCheckmark color="#FAFAFA" size={12} /> : "3"}
        </span>
        <p>Description</p>
      </section>
      <div></div>
      <section className={currentPage === 4 && `active_step_create_event`}>
        <span className={currentPage > 4 && "passed_step_create_event"}>
          {currentPage > 4 ? <IoMdCheckmark color="#FAFAFA" size={12} /> : "4"}
        </span>
        <p>Add Gamification</p>
      </section>
    </div>
  );
};

const HeaderEvent01 = () => {
  const navigate = useNavigate();
  return (
    <div className="headers_create_event">
      <IoArrowBackOutline
        color="#EEEEEE"
        onClick={() => {
          navigate(-1);
        }}
      />

      <section>
        <h2>Create your event</h2>
        <span>Webinars, Workshops, Q&A, AMA’s!</span>
      </section>
    </div>
  );
};

const CreateEvent = ({ progress, crating }) => {
  const params = new URLSearchParams(window.location.search);

  const [data, setdata] = useState({
    sname: "",
    sdesc: "",
    smrp: 0,
    ssp: 0,
    simg: "",
    benefits: "",
    stype: "Online",
    meetlink: "", // or venue in case of offline
    date: "",
    startTime: "",
    endTime: "",
    eventSeatCapacity: 0,
    contactPhone: null,
    contactEmail: null,
  });

  const htmlElementRef = useRef(null);

  const [speakersArray, setSpeakersArray] = useState([{}]);
  const [speakersImagesArray, setSpeakersImagesArray] = useState([]); // stores images of the speaker ------------
  const [isSpeaker, setIsSpeaker] = useState(false);

  const [Content, setContent] = useState();
  const [BannerImage, setBannerImage] = useState();

  const [currentPage, setCurrentPage] = useState(1); // deciding the form to shows
  const [paid, setpaid] = useState("Paid"); // decides the form acc to paid or free service type
  const [openLoading, setOpenLoading] = useState(false); // controlls the loader
  const [scrollPreviewSection, setScrollPreviewSection] = useState(null);
  const [showPopup, setshowPopup] = useState({ open: false, link: "" }); // success popup data
  const [openBanner, setOpenBanner] = useState(false);

  const [draftEventId, setDraftEventId] = useState(null);

  const { verifiedData } = useContext(linkedinContext);

  // service Context --------------------------------------------------
  const { UploadBanners,geteventusingid } = useContext(ServiceContext);

  useEffect(() => {
    window.scroll(0, 0);
  }, [currentPage]);


  useEffect(() => {
    if(params.get("draft")){
      setDraftEventId(params.get("draft"))
      geteventusingid(params.get("draft")).then((e)=>{
        setContent(e?.ldesc ?? "")
        setpaid(e?.isPaid ? "Paid" : "Free")
        setdata({
          sname: e?.sname,
          smrp: e?.smrp,
          ssp: e?.ssp,
          simg: e?.simg ?? "",
          benefits: e?.benefits ?? "",
          stype: e?.stype === 0 ? "Offline" : "Online",
          meetlink: e?.meetlink, // or venue in case of offline
          date: new Date(e?.startDate),
          startTime: e?.time?.startTime,
          endTime: e?.time?.endTime,
          eventSeatCapacity: e?.maxCapacity,
          contactPhone: e?.contactDetails?.phone ?? null,
          contactEmail: e?.contactDetails?.email ?? null,
        })

        setSpeakersArray(e?.speakerDetails ?? [{}])
        setIsSpeaker(e?.speakerDetails[0]?.isCreator ?? false)
      })
    }
  }, [])


  // Function to convert image file to data URI
  const getImageDataUri = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  // Default banner fucntion -------------
  const convertTime = (inputTime) => {
    if (inputTime) {
      var timeParts = inputTime?.split(":");
      var hours = parseInt(timeParts[0]);
      var minutes = parseInt(timeParts[1]);

      var period = hours >= 12 ? "PM" : "AM";
      hours = hours > 12 ? hours - 12 : hours;

      var convertedTime =
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0") +
        " " +
        period;

      return convertedTime;
    }
  };

  const getDate = (date) => {
    let d = new Date(date);

    let newDate = d.toDateString().split(" ");

    return (
      newDate[0] + " | " + newDate[1] + " " + newDate[2] + " " + newDate[3]
    );
  };

  // Save the banner
  const saveTheBannerEvent = async () => {
    for (let index = 0; index < speakersImagesArray.length; index++) {
      const element = speakersImagesArray[index];
      let imgtag = document.getElementById(`speakersBannerImage${index}`);
      let dataURI;
      if (element) {
        dataURI = await getImageDataUri(element);
      } else {
        dataURI = verifiedData?.data?.profile
          ? `${host}/api/file/proxyImage?imageUrl=${verifiedData?.data?.profile}`
          : PNGIMG;
      }
      imgtag.src = dataURI;
    }

    const element = htmlElementRef.current;

    // Converting the image and saving it
    let blob = await toBlob(element);
    try {
      const file = new File([blob], "banner2.png", { type: blob.type });
      const data1 = new FormData();
      data1.append("file", file);
      let banner = await UploadBanners(data1);
      return banner;
    } catch (error) {
      console.log(error);
    }
  };

  // event banner color code -------
  let colorCodes = [
    "#121212",
    "linear-gradient(142deg, #231919 0.94%, #002A3B 47.59%, #121212 98.41%)",
    "linear-gradient(142deg, #231919 0.94%, #300 47.59%, #121212 98.41%)",
    "linear-gradient(142deg, #231919 0.94%, #091800 47.59%, #121212 98.41%)",
    "linear-gradient(142deg, #231919 0.94%, #002F2C 47.59%, #121212 98.41%",
  ];

  return (
    <>
      {openLoading && <LoadThree open={openLoading} />}

      {showPopup?.open && (
        <NewCongratsServiceModal
          type="event"
          link={showPopup?.link}
          slug={showPopup?.slug}
        />
      )}

      {/* default banner */}
      <div
        className="default_previewer_wrapper"
        style={{ zIndex: openBanner ? "10" : "-10" }}
      >
        <div>
          {/* Html banner ------------------------------- */}
          <section
            className="event_invite_card_wrapper"
            ref={htmlElementRef}
            style={{
              background:
                colorCodes[Math.floor(Math.random() * colorCodes.length)],
            }}
          >
            <div>
              {/* user section data  */}
              <section id="invite-card-opacity-layer-160"></section>
              <section id="invite-card-opacity-layer-123"></section>
              <section id="invite-card-opacity-layer-87"></section>

              <div>
                {/* event title section ----------- */}
                <section
                  className="event_title_data_event_invite_card_multiple_speakers"
                  style={{ position: "unset", margin: "auto" }}
                >
                  <h3>{data?.sname}</h3>

                  <span>Hosted by {verifiedData?.data?.name}</span>
                </section>
              </div>

              {/* event date and time section ----------- */}
              <div
                style={{
                  position: "absolute",
                  right: "32px",
                  alignItems: "flex-end",
                }}
              >
                <section className="event_date_data_event_invite_card">
                  <span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="vuesax/linear/calendar">
                        <g id="vuesax/linear/calendar_2">
                          <g id="calendar">
                            <path
                              id="Vector"
                              d="M8 2V5"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-miterlimit="10"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              id="Vector_2"
                              d="M16 2V5"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-miterlimit="10"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              id="Vector_3"
                              d="M3.5 9.08997H20.5"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-miterlimit="10"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              id="Vector_4"
                              d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-miterlimit="10"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              id="Vector_5"
                              d="M15.6947 13.7H15.7037"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              id="Vector_6"
                              d="M15.6947 16.7H15.7037"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              id="Vector_7"
                              d="M11.9955 13.7H12.0045"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              id="Vector_8"
                              d="M11.9955 16.7H12.0045"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              id="Vector_9"
                              d="M8.29431 13.7H8.30329"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              id="Vector_10"
                              d="M8.29431 16.7H8.30329"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                        </g>
                      </g>
                    </svg>{" "}
                    {getDate(data?.date)}
                  </span>

                  <span>
                    {" "}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="ci:clock">
                        <path
                          id="Vector"
                          d="M12 7V12H17M12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.3869 21 12 21Z"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                    </svg>
                    {convertTime(data?.startTime) +
                      "-" +
                      convertTime(data?.endTime)}
                  </span>
                </section>

                {/* event speaker section ----------- */}
                <section className="event_invite_multiple_speakers_details_section">
                  <h4
                    style={{
                      left:
                        speakersArray.length > 0
                          ? (speakersArray?.length - 1) * 5 + "px"
                          : "",
                    }}
                  >
                    Speakers
                  </h4>
                  <section>
                    {speakersArray?.map((speaker, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            left: `${
                              (speakersArray.length - (index + 1)) * 10
                            }px`,
                            zIndex: `${
                              (speakersArray.length - (index + 1)) * 4
                            }`,
                          }}
                        >
                          <div>
                            <img
                              id={`speakersBannerImage${index}`}
                              src={
                                speakersImagesArray[index]
                                  ? URL.createObjectURL(
                                      speakersImagesArray[index]
                                    )
                                  : speaker?.isCreator
                                  ? `${host}/api/file/proxyImage?imageUrl=${verifiedData?.data?.profile}`
                                  : PNGIMG
                              }
                              alt=""
                            />
                          </div>
                          <span>{speaker?.name}</span>
                        </div>
                      );
                    })}
                  </section>
                </section>
              </div>
            </div>
          </section>

          <section className="default_options_sections">
            <section>
              <button
                onClick={() => {
                  setOpenBanner(false);
                }}
              >
                Close
              </button>
            </section>
          </section>
        </div>
      </div>

      <div className="dashboard_outside_wrapper01">
        <div className="create_content_wrapper01">
          <section className="left_side_panel_create_event01">
            <HeaderEvent01 />
            <StepsChecker currentPage={currentPage} />

            {/* First Section ------------- */}
            {currentPage === 1 && (
              <FirstPage
                data={data}
                paid={paid}
                setpaid={setpaid}
                setCurrentPage={setCurrentPage}
                setdata={setdata}
                setScrollPreviewSection={setScrollPreviewSection}
                setDraftEventId={setDraftEventId}
                draftEventId={draftEventId}
                setOpenLoading={setOpenLoading}
                progress={progress}
              />
            )}

            {/* Second Page ---- */}
            {currentPage === 2 && (
              <SecondPage
                data={data}
                isSpeaker={isSpeaker}
                setIsSpeaker={setIsSpeaker}
                setCurrentPage={setCurrentPage}
                creatorData={verifiedData?.data}
                speakersArray={speakersArray}
                speakersImagesArray={speakersImagesArray}
                setSpeakersArray={setSpeakersArray}
                setSpeakersImagesArray={setSpeakersImagesArray}
                setScrollPreviewSection={setScrollPreviewSection}
                setOpenBanner={setOpenBanner}
                setOpenLoading={setOpenLoading}
                progress={progress}
                draftEventId={draftEventId}
              />
            )}

            {/* Third Page ---- */}
            {currentPage === 3 && (
              <ThirdPage
                Content={Content}
                setContent={setContent}
                setCurrentPage={setCurrentPage}
                setScrollPreviewSection={setScrollPreviewSection}
                setBannerImage={setBannerImage}
                bannerImage={BannerImage}
                setOpenLoading={setOpenLoading}
                progress={progress}
                draftEventId={draftEventId}
                saveTheBannerEvent={saveTheBannerEvent}
              />
            )}

            {/* Fourth Page ---- */}
            {currentPage === 4 && (
              <FourthPage
                data={data}
                setdata={setdata}
                setCurrentPage={setCurrentPage}
                setScrollPreviewSection={setScrollPreviewSection}
                setOpenLoading={setOpenLoading}
                progress={progress}
                draftEventId={draftEventId}
                setshowPopup={setshowPopup}
                creatorData={{
                  phone: verifiedData?.data?.phone,
                  email: verifiedData?.data?.email,
                }}
              />
            )}
          </section>

          {/* preview section ---------------------- */}
          <section className="right_side_panel_create_event01">
            <h2>Mobile Preview</h2>

            <div></div>
            {window.screen.width > 600 && (
              <section className="live_preview_create_event01">
                <div className="live_preview_modal_create_event">
                  <section>
                    <img
                      src={require("../../../Utils/Images/mobile-screen.png")}
                      alt=""
                    />
                    <CreateEventDemo2
                      scrollToSection={scrollPreviewSection}
                      {...data}
                      paid={paid}
                      ldesc={Content}
                      cname={verifiedData?.data?.name}
                      cprofile={verifiedData?.data?.profile}
                      crating={crating}
                      ctagline={verifiedData?.data?.tagline}
                      speakersArray={speakersArray}
                      speakersImagesArray={speakersImagesArray}
                      isSpeaker={isSpeaker}
                    />
                  </section>
                </div>
              </section>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
