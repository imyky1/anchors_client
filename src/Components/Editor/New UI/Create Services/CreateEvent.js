import React, { useEffect, useState, useContext, useRef } from "react";
// import "./Create.css";
import "./Canvas.css";
import { Button1 } from "./InputComponents/buttons";
import {
  Dropdown1,
  Editor1,
  Tags1,
  TextField1,
  RadioField1,
  UploadField2,
  UploadField3,
  UploadField1,
} from "./InputComponents/fields_Labels";
import ServiceContext from "../../../../Context/services/serviceContext";
import { toast } from "react-toastify";
import { CongratsServiceModal } from "../../../Modals/ServiceSuccess/Modal";
import { LoadTwo } from "../../../Modals/Loading";
import { creatorContext } from "../../../../Context/CreatorState";
// imports for image cropping
import getCroppedImg, { generateDownload } from "../../../helper/imageresize";
import { Button, Modal, Slider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import RemoveIcon from "@mui/icons-material/Remove";
import Cropper from "react-easy-crop";
import { SuperSEO } from "react-super-seo";
import mixpanel from "mixpanel-browser";
import { BsPlus } from "react-icons/bs";

import PNGIMG from "../../../../Utils/Images/default_user.png";
import { toBlob } from "html-to-image";
import { CreateEventDemo } from "./CreateServiceDemo";

function CreateEvent({
  progress,
  openDefaultBanner,
  setDefaultBannerData,
  cname,
  ctagline,
  crating,
  cprofile,
}) {
  const params = new URLSearchParams(window.location.search);

  const [multipleSpeakers, setMultipleSpeakers] = useState(false); // tells if the evnt page has the multiple speaker option
  const [speakersArray, setSpeakersArray] = useState([{}]);
  const [isSpeakerSelected, setIsSpeakerSelected] = useState(false);
  const [speakersImagesArray, setSpeakersImagesArray] = useState([]); // stores images of the speaker ------------

  const [showPopup, setshowPopup] = useState({ open: false, link: "" }); // success popup data

  const [paid, setpaid] = useState(); // decides the form acc to paid or free service type
  const [openLoading, setOpenLoading] = useState(false); // controlls the loader

  // saving for preview in live eevnt
  const [showimg, setShowimg] = useState({});

  // state for image cropping
  const [imagetocrop, setImageToCrop] = useState([]); // first is banner image , rest are sepaker's profile image
  const [openimagePreview, setImagePreview] = useState({
    value: false,
    indexToCrop: null,
  });

  // default banner
  const [defaultbanner, setDefaultBanner] = useState(false); // decides wheter to user checked the default banner-----
  const htmlElementRef = useRef(null);

  // Multiple speaker handling -----------------
  useEffect(() => {
    if (params.get("type") === "multiplespeakers") {
      setMultipleSpeakers(true);
    }
  }, []);

  // service Context --------------------------------------------------
  const {
    addEvent,
    getslugcountEvent,
    Uploadfile,
    UploadEventVideo,
    UploadEventSpeakersProfile,
  } = useContext(ServiceContext);

  const { allCreatorInfo } = useContext(creatorContext);

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
  });

  const [Tags, setTags] = useState([]);
  const [Content, setContent] = useState();
  const [BannerImage, setBannerImage] = useState();
  const [seatCapacity, setSeatCapacity] = useState("");
  const [EventVideo, setEventVideo] = useState();

  const handleChangeFileBanner = (e) => {
    mixpanel.track("Browse banner");
    if (defaultbanner) {
      setDefaultBanner(false);
    }

    const file = e.target.files[0];
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedArea(null);
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.addEventListener("load", () => {
        let newArray = imagetocrop;
        newArray[0] = reader.result;
        setImageToCrop(newArray);
      });
      setBannerImage(file);
    }
  };

  const handleChangeSpeakerImage = (e, index) => {
    mixpanel.track(`Browse Speaker Image ${index + 1}`);
    const file = e.target.files[0];
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedArea(null);
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.addEventListener("load", () => {
        let newArray = imagetocrop;
        newArray[index + 1] = reader.result;
        setImageToCrop(newArray);
      });
      let newArray = speakersImagesArray;
      newArray[index] = file;
      setSpeakersImagesArray(newArray);
    }
  };

  // Image cropping
  // IMAGE RESIZE
  const [croppedArea, setCroppedArea] = useState(null); // Array of values ------------------
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // Array of values ------------------

  const [zoom, setZoom] = useState(1); // Array of values ------------------

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const savecroppedImage = async () => {
    const img = await getCroppedImg(
      imagetocrop[openimagePreview?.indexToCrop],
      croppedArea,
      openimagePreview?.indexToCrop === 0
        ? BannerImage?.name
        : speakersImagesArray[openimagePreview?.indexToCrop - 1]?.name
    );

    if (openimagePreview?.indexToCrop === 0) {
      setBannerImage(img);
    } else {
      let newArray = speakersImagesArray;
      newArray[openimagePreview?.indexToCrop - 1] = img;
      setSpeakersImagesArray(newArray);
    }
    setImagePreview({ value: false, indexToCrop: null });
  };

  const handleSpeaker = (value) => {
    setIsSpeakerSelected(!isSpeakerSelected);
    if (value) {
      let newArray = speakersArray;
      newArray[0] = {
        name: allCreatorInfo?.name,
        designation: allCreatorInfo?.tagLine,
        profile: allCreatorInfo?.profile,
        isCreator: true,
      };
      setSpeakersArray(newArray);
    } else {
      if (speakersArray.length === 1) {
        setSpeakersArray([{}]);
      } else {
        setSpeakersArray(speakersArray.slice(1));
      }
    }
  };

  // changes handling in input field ---------------------------------
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  const handleSpeakerChange = (value, index, field) => {
    let newArray = speakersArray;
    newArray[index] = { ...speakersArray[index], [field]: value };
    setSpeakersArray(newArray);
  };

  // responsible for generating slug
  const process = () => {
    let slug = data?.sname.split(" ").join("-"); // creates the slug from the name
    return slug;
  };

  const SaveSpeakerImages = async () => {
    for (let index = 0; index < speakersImagesArray.length; index++) {
      const element = speakersImagesArray[index];
      if (element) {
        let data1 = new FormData();
        data1.append("file", element);
        let speaker = await UploadEventSpeakersProfile(data1);
        let newArr = speakersArray;
        newArr[index] = {
          ...speakersArray[index],
          profile: speaker?.result?.Location,
        };
        setSpeakersArray(newArr);
      }
    }
  };

  const checkSpeakersData = () => {
    for (let index = 0; index < speakersArray.length; index++) {
      const element = speakersArray[index];
      if (
        !element?.name ||
        !element?.name?.length === 0 ||
        !element?.designation ||
        !element?.designation?.length === 0 ||
        (!speakersImagesArray[index] && (index !== 0 || !isSpeakerSelected))
      ) {
        return false;
      }
    }
    return true;
  };

  // form submission ----------------------------------------------------------
  const onSubmit = async () => {
    const data1 = new FormData();
    const data2 = new FormData();
    data1.append("file", BannerImage);
    data2.append("file", EventVideo);

    let slug = process();
    const SlugCount = await getslugcountEvent(slug.toLowerCase());

    let checkSpeakers = checkSpeakersData();

    setOpenLoading(true); // true on loader
    progress(0);

    if (
      data.sname.length > 3 &&
      data?.stype &&
      data?.meetlink &&
      data?.date &&
      data?.startTime &&
      data?.endTime &&
      paid
    ) {
      if (checkSpeakers || !multipleSpeakers) {
        if (Content?.length > 10) {
          if (multipleSpeakers) {
            await SaveSpeakerImages();
          }
          try {
            let banner = { success: true, url: "" };
            let eventVideo = { result: { Location: "" } };

            // Check for banner and saves if it is available
            if (BannerImage) {
              banner = await Uploadfile(data1); /// uplaoding banner and files on s3
            } else {
              // Generating a default Banner
              banner = await saveTheBannerEvent();
            }

            // Check for video and saves if it is available
            if (EventVideo) {
              eventVideo = await UploadEventVideo(data2);
              progress(50);
            }

            if (banner?.success) {
              progress(75);
              let json = await addEvent(
                data?.sname,
                "", // sdesc no value
                Content,
                SlugCount === 0
                  ? slug.toLowerCase()
                  : slug.toLowerCase().concat("--", `${SlugCount}`),
                banner?.url,
                Tags,
                data?.stype === "Offline" ? 0 : 1,
                paid === "Free" ? false : true,
                paid === "Free" ? 0 : data.smrp,
                paid === "Free" ? 0 : data.ssp,
                data?.date,
                { startTime: data?.startTime, endTime: data?.endTime },
                data?.benefits,
                seatCapacity === "Enter Manually"
                  ? data?.eventSeatCapacity
                  : "Unlimited",
                data?.meetlink,
                eventVideo?.result?.Location,
                multipleSpeakers ? speakersArray : null
              );

              if (json?.success) {
                //setservData(json.res);
                setOpenLoading(false);
                setshowPopup({ open: true, link: json?.shortLink });
              } else {
                setOpenLoading(false);
                toast.error(`Event Not Created Please Try Again`, {
                  position: "top-center",
                  autoClose: 2000,
                });
              }
            } else {
              setOpenLoading(false);
              toast.error(`Facing issues while uploading image`, {
                position: "top-center",
                autoClose: 2000,
              });
            }
          } catch (error) {
            setOpenLoading(false);
            console.log(error);
            toast.error(`Server side error please try after some time`, {
              position: "top-center",
              autoClose: 2000,
            });
          }
        } else {
          setOpenLoading(false);
          toast.info("Descibe your service properly", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      } else {
        setOpenLoading(false);
        toast.info("Enter speaker details properly", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } else {
      setOpenLoading(false);
      toast.info("Fill all the Mandatory Fields", {
        position: "top-center",
        autoClose: 3000,
      });
    }

    progress(100);
  };

  // Add new Speaker
  const handleAddSpeaker = () => {
    setSpeakersArray((prevSpeakers) => [...prevSpeakers, {}]);
  };

  const handleRemoveSpeaker = (index) => {
    let finalArr = speakersArray
      .slice(0, index)
      .concat(speakersArray.slice(index + 1));

    setSpeakersArray(finalArr);
  };

  //Edit control of default banner button ------------
  const EditOptionDefaultBanner = () => {
    setDefaultBannerData({
      sname: data?.sname,
      cname: cname,
      type: "Event",
    });
    openDefaultBanner();
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

  // Save the banner
  const saveTheBannerEvent = async () => {
    if (multipleSpeakers) {
      for (let index = 0; index < speakersImagesArray.length; index++) {
        const element = speakersImagesArray[index];
        let imgtag = document.getElementById(`speakersBannerImage${index}`);
        let dataURI;
        if (element) {
          dataURI = await getImageDataUri(element);
        } else {
          dataURI = allCreatorInfo?.profile;
        }
        imgtag.src = dataURI;
      }
    }

    const element = htmlElementRef.current;

    // Converting the image and saving it
    let blob = await toBlob(element);
    try {
      const file = new File([blob], "banner2.png", { type: blob.type });
      const data1 = new FormData();
      data1.append("file", file);
      let banner = await Uploadfile(data1);
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
      {openLoading && <LoadTwo open={openLoading} />}

      {showPopup?.open && (
        <CongratsServiceModal type="Event" link={showPopup?.link} />
      )}

      {/* Banners default ------- */}
      {/* <div className="default_previewer_wrapper" style={{ zIndex: "100" }}> */}
      {/* Html banner ------------------------------- */}
      {/* {multipleSpeakers ? (
          <div className="personalized_card_wrapper" ref={htmlElementRef}>
            <img src={require("./back2.jpeg")} alt="background" />
            <div className="texting_layer_banner">
              <section className="left_side_text">
                <h1>{data?.sname}</h1>
                <span>
                  by{" "}
                  {speakersArray?.map((e, index) => {
                    return (
                      <span key={index}>
                        {" "}
                        {`${e?.name?.split(" ")[0]}${
                          index !== speakersArray?.length - 2 &&
                          index !== speakersArray?.length - 1
                            ? ", "
                            : ""
                        } ${index === speakersArray?.length - 2 ? "&" : ""}`}
                      </span>
                    );
                  })}
                </span>
              </section>

              <section className="date_time_section_banner">
                <div>
                  <img src={DateIcon} alt="" />
                  <span>{getDate(data?.date)}</span>
                </div>
                <div>
                  <img src={TimeIcon} alt="" />
                  <span>{`${convertTime(data?.startTime)} - 
          ${convertTime(data?.endTime)}`}</span>
                </div>
              </section>

              <div className="all_speaker_details_section">
                {speakersArray?.map((e, i) => {
                  return (
                    <section
                      className="creator_profile_banner_multiple"
                      key={i}
                    >
                      <div className="text_box_creator_name_multiple">
                        <h4>Speaker</h4>
                        <span>{e?.name}</span>
                      </div>
                      <div className="creator_image_cover_banner_multiple">
                        <img
                          id={`speakersBannerImage${i}`}
                          src=""
                          alt=""
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = PNGIMG;
                          }}
                        />
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="personalized_card_wrapper" ref={htmlElementRef}>
            <img src={require("./back.png")} alt="background" />
            <div className="texting_layer_banner">
              <section className="left_side_text">
                <h1>{data?.sname}</h1>
                <span>by {allCreatorInfo?.name}</span>
              </section>

              <section className="creator_profile_banner">
                <div className="text_box_creator_name">
                  <h4>Speaker</h4>
                  <span>{allCreatorInfo?.name}</span>
                </div>
                <div className="creator_image_cover_banner">
                  <img
                    src={allCreatorInfo?.profile}
                    alt=""
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = PNGIMG;
                    }}
                  />
                </div>
              </section>

              <section className="date_time_section_banner">
                <div>
                  <img src={DateIcon} alt="" />
                  <span>{getDate(data?.date)}</span>
                </div>
                <div>
                  <img src={TimeIcon} alt="" />
                  <span>{`${convertTime(data?.startTime)} - 
            ${convertTime(data?.endTime)}`}</span>
                </div>
              </section>
            </div>
          </div>
        )}
      </div> */}

      <div className="default_previewer_wrapper" style={{ zIndex: "100" }}>
        {/* Html banner ------------------------------- */}
        <section
          className="event_invite_card_wrapper"
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

            {speakersArray[0]?.name ? (
              <>
                <div>
                  {/* event title section ----------- */}
                  <section className="event_title_data_event_invite_card_multiple_speakers">
                    <h3>{data?.sname}</h3>

                    <span>Hosted by {allCreatorInfo?.name}</span>
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
                                src={
                                  speakersImagesArray[index]
                                    ? URL.createObjectURL(
                                        speakersImagesArray[index]
                                      )
                                    : speaker?.isCreator
                                    ? data?.cprofile
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
              </>
            ) : (
              <>
                <div>
                  {/* event title section ----------- */}

                  <section className="event_title_data_event_invite_card">
                    <h3>{data?.sname}</h3>

                    <span>Hosted by {allCreatorInfo?.name}</span>
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

                  <section className="event_speaker_data_event_invite_card">
                    <span>
                      {allCreatorInfo?.name}, <span>Speaker</span>
                    </span>
                    <div>
                      <img
                        src={allCreatorInfo?.profile}
                        alt=""
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = PNGIMG;
                        }}
                      />
                    </div>
                  </section>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="create_service_outside_wrapper">
        <div className="main_create_container_new_conatiner_live_demo">
          {/* Heading of the create section ------------------------ */}
          <section className="heading_create_box">
            <div>
              <h1 className="create_text_01">What is your Event about?</h1>
              <p className="create_text_02">
                You can create events and workshops
              </p>
            </div>
            {/* <button
              onClick={() => {
                mixpanel.track("Preview Sample Page");
                window.open(
                  "https://www.anchors.in/e/how-to-become-a-product-manager"
                );
              }}
            >
              <FiSend /> Preview Sample Page
            </button> */}
          </section>

          {/* form section of create container ---------------------------------------- */}
          {/* <section className="create_form_box_event">
            <div className="main_box_1_create_form">
              <div className="left_section_form">
                <TextField1
                  label="Title of Event"
                  name="sname"
                  id="sname"
                  required={true}
                  placeholder="Enter Title Here"
                  onChange={handleChange}
                />
                {paid === "Paid" && (
                  <TextField1
                    label="Set Maximum Price"
                    placeholder="Max 500"
                    name="smrp"
                    id="smrp"
                    required={true}
                    onChange={handleChange}
                  />
                )}
                <UploadField2
                  label="Upload Banner Image"
                  id="asdas"
                  info="File Size Limit 15 MB Formats - jpg,png"
                  FileType=".jpg,.png,.jpeg"
                  onChange={setBannerImage}
                  onChangeFunction={handleChangeFileBanner}
                />
                {BannerImage || defaultbanner ? (
                  <>
                    {" "}
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (defaultbanner) {
                          EditOptionDefaultBanner();
                          mixpanel.track("Edit default banner");
                        } else {
                          setZoom(1);
                          setCrop({ x: 0, y: 0 });
                          setCroppedArea(null);
                          setImagePreview({ value: true, indexToCrop: 0 });
                          mixpanel.track("Edit Browse Banner");
                        }
                      }}
                      className="imageresizeopenerbutton"
                    >
                      {defaultbanner
                        ? "Edit default Banner"
                        : "Preview Image and Resize"}
                    </Button>
                    <br />
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="right_section_form">
                <Dropdown1
                  label="Is it paid/free?"
                  placeholder="Choose a service type"
                  value={["Free", "Paid"]}
                  required={true}
                  selectedValue={(e) => {
                    setpaid(e);
                  }}
                  onClick={() => {
                    mixpanel.track(`${paid} Service`);
                  }}
                />
                {paid === "Paid" && (
                  <TextField1
                    label="Selling Price "
                    placeholder="Min 99"
                    name="ssp"
                    id="ssp"
                    required={true}
                    onChange={handleChange}
                  />
                )}
                <UploadField1
                  label={`Upload your Preview Video`}
                  id="asd1515"
                  onChange={setEventVideo}
                  info="File Size Limit 500 MB Formats -Avi,mp4"
                  FileType=".mp4,.avi,.mov"
                />
              </div>
            </div>

            {isSpeakerSelected && (
              <div className="map_speaker_details_field">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "40px",
                    marginBottom: "30px",
                  }}
                >
                  <div className="map_speaker_details_field_inside">
                    <div className="map_speaker_details_field_inside_frame">
                      <div className="create_text_04">Speaker Details</div>
                      <TextField1
                        label="Name"
                        name="name"
                        id="name"
                        placeholder="Enter name"
                        value={allCreatorInfo?.name}
                      />

                      <UploadField2
                        label="Profile Image"
                        id={`speakerImage0`}
                        onChange={(e)=>{return null}}
                        info={
                          isSpeakerSelected
                            ? "Profile Image Selected"
                            : "File Size Limit 15 MB Formats - jpg,png"
                        }
                        FileType=".jpg,.png,.jpeg"
                        onChangeFunction={(e) => handleChangeSpeakerImage(e, 0)}
                      />

                      {speakersImagesArray[0] && (
                        <Button1
                          text={"Preview Image and Resize"}
                          onClick={() => {
                            setZoom(1);
                            setCrop({ x: 0, y: 0 });
                            setCroppedArea(null);
                            setImagePreview({
                              value: true,
                              indexToCrop: 1,
                            });
                          }}
                        />
                      )}

                    </div>
                    <div className="create_speaker_toggle_spacing0">
                      <div className="create_speaker_toggle">
                        I am the speaker
                        <RadioField1
                          onChange={(value) => handleSpeaker(value)}
                          value={isSpeakerSelected}
                        />
                      </div>
                      <TextField1
                        label="Designation"
                        name="designation"
                        id="designation"
                        placeholder="Enter designation"
                        value={allCreatorInfo?.tagLine}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {multipleSpeakers && (
              <div className="map_speaker_details_field">
                {(isSpeakerSelected
                  ? speakersArray?.slice(1)
                  : speakersArray
                )?.map((speaker, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "40px",
                      marginBottom: "30px",
                    }}
                  >
                    <div className="map_speaker_details_field_inside">
                      <div className="map_speaker_details_field_inside_frame">
                        <div className="create_text_04">Speaker Details</div>
                        <TextField1
                          label="Name"
                          name="name"
                          id={`name${isSpeakerSelected ? index + 1 : index}`}
                          placeholder="Enter name"
                          onChange={(e) => {
                            handleSpeakerChange(
                              e.target.value,
                              isSpeakerSelected ? index + 1 : index,
                              e.target.name
                            );
                          }}
                        />

                        <UploadField2
                          label="Profile Image"
                          id={`speakerImage${
                            isSpeakerSelected ? index + 1 : index
                          }`}
                          info="File Size Limit 15 MB Formats - jpg,png"
                          FileType=".jpg,.png,.jpeg"
                          onChange={(e)=>{return null}}
                          onChangeFunction={(e) =>
                            handleChangeSpeakerImage(
                              e,
                              isSpeakerSelected ? index + 1 : index
                            )
                          }
                        />

                        {speakersImagesArray[
                          isSpeakerSelected ? index + 1 : index
                        ] && (
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setZoom(1);
                              setCrop({ x: 0, y: 0 });
                              setCroppedArea(null);
                              setImagePreview({
                                value: true,
                                indexToCrop: isSpeakerSelected
                                  ? index + 2
                                  : index + 1,
                              });
                            }}
                            className="imageresizeopenerbutton"
                          >
                            Preview Image and Resize
                          </Button>
                        )}
                      </div>
                      <div className="create_speaker_toggle_spacing0">
                        {index === 0 && !isSpeakerSelected && (
                          <div className="create_speaker_toggle">
                            I am the speaker
                            <RadioField1
                              onChange={(value) => handleSpeaker(value)}
                              value={isSpeakerSelected}
                            />
                          </div>
                        )}
                        <TextField1
                          label="Designation"
                          name="designation"
                          id={`designation${
                            isSpeakerSelected ? index + 1 : index
                          }`}
                          placeholder="Enter designation"
                          onChange={(e) =>
                            handleSpeakerChange(
                              e.target.value,
                              isSpeakerSelected ? index + 1 : index,
                              e.target.name
                            )
                          }
                        />

                        {(index !== 0 || isSpeakerSelected) && (
                          <Button1
                            text="Remove Speaker"
                            onClick={() =>
                              handleRemoveSpeaker(
                                isSpeakerSelected ? index + 1 : index
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {multipleSpeakers && speakersArray.length < 3 && (
              <div className="create_text_04" onClick={handleAddSpeaker}>
                Add Speaker
                <BsPlus
                  style={{
                    marginBottom: "-3px",
                    fontSize: "17px",
                    marginLeft: "-1px",
                    fontWeight: "bolder",
                    cursor: "pointer",
                  }}
                />{" "}
              </div>
            )}

            <div className="main_box_1_create_form1">
              <div className="left_section_form">
                <Dropdown1
                  label="Is it Online/Offline?"
                  placeholder="Choose the mode of event"
                  value={["Online", "Offline"]}
                  required={true}
                  defaultValue="Online"
                  id="stype"
                  selectedValue={(e) => {
                    setdata({ ...data, stype: e });
                  }}
                  onClick={() => {
                    mixpanel.track(`${paid} Service`);
                  }}
                />

                <TextField1
                  label="Event Date"
                  name="date"
                  type="date"
                  id="date"
                  required={true}
                  onChange={handleChange}
                />

                <Editor1
                  label={`Benefits of leaderboard`}
                  placeholder={`Caption your Event`}
                  info="A brief description gives your audience some context"
                  Content={data?.benefits}
                  id="benefits"
                  required={true}
                  setContent={(e) => setdata({ ...data, benefits: e })}
                />

                <Editor1
                  label={`Describe your Event`}
                  placeholder={`Caption your Event`}
                  info="A brief description gives your audience some context"
                  Content={Content}
                  required={true}
                  setContent={(e) => setContent(e)}
                />
              </div>
              <div className="right_section_form">
                <TextField1
                  label={data.stype === "Offline" ? "Venue" : "Meet Link"}
                  name="meetlink"
                  id="meetlink"
                  required={true}
                  placeholder="Enter Title Here"
                  onChange={handleChange}
                />

                <section
                  style={{
                    width: "100%",
                    gap: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    marginBottom: "32px",
                  }}
                >
                  <TextField1
                    label="Event Start Time"
                    name="startTime"
                    type="time"
                    id="startTime"
                    required={true}
                    placeholder="Enter Title Here"
                    onChange={handleChange}
                  />
                  <TextField1
                    label="Event End Time"
                    name="endTime"
                    type="time"
                    id="endTime"
                    required={true}
                    placeholder="Enter Title Here"
                    onChange={handleChange}
                  />
                </section>

                <Tags1
                  label="Add Relevant Tags"
                  placeholder="Press Enter to add tags"
                  info="This will help in easy search and recommendation"
                  tags={Tags}
                  id="eventTags"
                  name="eventTags"
                  setTags={setTags}
                />

                <Dropdown1
                  label="Max Capacity?"
                  placeholder="Choose the capacity of the event"
                  value={["Unlimited", "Enter Manually"]}
                  required={true}
                  defaultValue="Unlimited"
                  selectedValue={(e) => {
                    setSeatCapacity(e);
                  }}
                  onClick={() => {
                    mixpanel.track(`${paid} Service`);
                  }}
                />

                {seatCapacity === "Enter Manually" && (
                  <TextField1
                    label="No of Seats"
                    type="text"
                    id="eventSeatCapacity"
                    name="eventSeatCapacity"
                    value={data?.eventSeatCapacity}
                    placeholder="Enter the number of seats in the event"
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>
          </section> */}

          <section className="create_form_box_event">
            <div className="main_box_1_create_form">
              <div className="left_section_form" style={{ width: "100%" }}>
                <TextField1
                  label="Title of Event"
                  name="sname"
                  id="sname"
                  required={true}
                  placeholder="Enter Title Here"
                  onChange={handleChange}
                />
                <Dropdown1
                  label="Is it paid/free?"
                  placeholder="Choose a service type"
                  value={["Free", "Paid"]}
                  required={true}
                  selectedValue={(e) => {
                    setpaid(e);
                  }}
                  onClick={() => {
                    mixpanel.track(`${paid} Service`);
                  }}
                />

                {paid === "Paid" && (
                  <section
                    style={{
                      width: "100%",
                      gap: "10px",
                      display: "grid",
                      gridTemplateColumns: "repeat(2,1fr)",
                      marginBottom: "32px",
                    }}
                  >
                    <TextField1
                      label="Set Maximum Price"
                      placeholder="Max 500"
                      name="smrp"
                      id="smrp"
                      required={true}
                      onChange={handleChange}
                    />

                    <TextField1
                      label="Selling Price "
                      placeholder="Min 99"
                      name="ssp"
                      id="ssp"
                      required={true}
                      onChange={handleChange}
                    />
                  </section>
                )}

                {isSpeakerSelected && (
                  <div className="map_speaker_details_field">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "40px",
                        marginBottom: "30px",
                      }}
                    >
                      <div className="map_speaker_details_field_inside">
                        <div className="map_speaker_details_field_inside_frame">
                          <div className="create_text_04">Speaker Details</div>
                          <TextField1
                            label="Name"
                            name="name"
                            id="name"
                            placeholder="Enter name"
                            value={allCreatorInfo?.name}
                          />

                          <UploadField3
                            label="Profile Image"
                            id={`speakerImage0`}
                            info={
                              isSpeakerSelected
                                ? "Profile Image Selected"
                                : "File Size Limit 15 MB Formats - jpg,png"
                            }
                            onChange={() => {
                              return null;
                            }}
                            FileType=".jpg,.png,.jpeg"
                            onChangeFunction={(e) =>
                              handleChangeSpeakerImage(e, 0)
                            }
                          />

                          {speakersImagesArray[0] && (
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setZoom(1);
                                setCrop({ x: 0, y: 0 });
                                setCroppedArea(null);
                                setImagePreview({
                                  value: true,
                                  indexToCrop: 1,
                                });
                              }}
                              className="imageresizeopenerbutton"
                            >
                              Preview Image and Resize
                            </Button>
                          )}
                        </div>
                        <div className="create_speaker_toggle_spacing0">
                          <div className="create_speaker_toggle">
                            I am the speaker
                            <RadioField1
                              onChange={(value) => handleSpeaker(value)}
                              value={isSpeakerSelected}
                            />
                          </div>
                          <TextField1
                            label="Designation"
                            name="designation"
                            id="designation"
                            placeholder="Enter designation"
                            value={allCreatorInfo?.tagLine}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {multipleSpeakers && (
                  <div className="map_speaker_details_field">
                    {(isSpeakerSelected
                      ? speakersArray?.slice(1)
                      : speakersArray
                    )?.map((speaker, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "40px",
                          marginBottom: "30px",
                        }}
                      >
                        <div className="map_speaker_details_field_inside">
                          <div className="map_speaker_details_field_inside_frame">
                            <div className="create_text_04">
                              Speaker Details
                            </div>
                            <TextField1
                              label="Name"
                              name="name"
                              id={`name${
                                isSpeakerSelected ? index + 1 : index
                              }`}
                              placeholder="Enter name"
                              onChange={(e) => {
                                handleSpeakerChange(
                                  e.target.value,
                                  isSpeakerSelected ? index + 1 : index,
                                  e.target.name
                                );
                              }}
                            />

                            <UploadField3
                              label="Profile Image"
                              id={`speakerImage${
                                isSpeakerSelected ? index + 1 : index
                              }`}
                              info="File Size Limit 15 MB Formats - jpg,png"
                              FileType=".jpg,.png,.jpeg"
                              onChange={() => {
                                return null;
                              }}
                              onChangeFunction={(e) =>
                                handleChangeSpeakerImage(
                                  e,
                                  isSpeakerSelected ? index + 1 : index
                                )
                              }
                            />

                            {speakersImagesArray[
                              isSpeakerSelected ? index + 1 : index
                            ] && (
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setZoom(1);
                                  setCrop({ x: 0, y: 0 });
                                  setCroppedArea(null);
                                  setImagePreview({
                                    value: true,
                                    indexToCrop: isSpeakerSelected
                                      ? index + 2
                                      : index + 1,
                                  });
                                }}
                                className="imageresizeopenerbutton"
                              >
                                Preview Image and Resize
                              </Button>
                            )}
                          </div>
                          <div className="create_speaker_toggle_spacing0">
                            {index === 0 && !isSpeakerSelected && (
                              <div className="create_speaker_toggle">
                                I am the speaker
                                <RadioField1
                                  onChange={(value) => handleSpeaker(value)}
                                  value={isSpeakerSelected}
                                />
                              </div>
                            )}
                            <TextField1
                              label="Designation"
                              name="designation"
                              id={`designation${
                                isSpeakerSelected ? index + 1 : index
                              }`}
                              placeholder="Enter designation"
                              onChange={(e) =>
                                handleSpeakerChange(
                                  e.target.value,
                                  isSpeakerSelected ? index + 1 : index,
                                  e.target.name
                                )
                              }
                            />

                            {(index !== 0 || isSpeakerSelected) && (
                              <Button1
                                text="Remove Speaker"
                                onClick={() =>
                                  handleRemoveSpeaker(
                                    isSpeakerSelected ? index + 1 : index
                                  )
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {multipleSpeakers && speakersArray.length < 3 && (
                  <div
                    className="create_text_04"
                    onClick={handleAddSpeaker}
                    style={{ marginTop: "-30px" }}
                  >
                    Add Speaker
                    <BsPlus
                      style={{
                        marginBottom: "-3px",
                        fontSize: "17px",
                        marginLeft: "-1px",
                        fontWeight: "bolder",
                        cursor: "pointer",
                      }}
                    />{" "}
                  </div>
                )}

                <Dropdown1
                  label="Is it Online/Offline?"
                  placeholder="Choose the mode of event"
                  value={["Online", "Offline"]}
                  required={true}
                  defaultValue="Online"
                  id="stype"
                  selectedValue={(e) => {
                    setdata({ ...data, stype: e });
                  }}
                  onClick={() => {
                    mixpanel.track(`${paid} Service`);
                  }}
                />

                <TextField1
                  label={data.stype === "Offline" ? "Venue" : "Meet Link"}
                  name="meetlink"
                  id="meetlink"
                  required={true}
                  placeholder="Enter Title Here"
                  onChange={handleChange}
                />

                <TextField1
                  label="Event Date"
                  name="date"
                  type="date"
                  id="date"
                  required={true}
                  onChange={handleChange}
                />

                <section
                  style={{
                    width: "100%",
                    gap: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    marginBottom: "32px",
                  }}
                >
                  <TextField1
                    label="Event Start Time"
                    name="startTime"
                    type="time"
                    id="startTime"
                    required={true}
                    placeholder="Enter Title Here"
                    onChange={handleChange}
                  />
                  <TextField1
                    label="Event End Time"
                    name="endTime"
                    type="time"
                    id="endTime"
                    required={true}
                    placeholder="Enter Title Here"
                    onChange={handleChange}
                  />
                </section>

                <section
                  style={{
                    width: "100%",
                    gap: "25px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    marginBottom: "32px",
                  }}
                >
                  <UploadField3
                    label="Upload Banner Image"
                    id="asdas"
                    info="File Size Limit 15 MB Formats - jpg,png"
                    FileType=".jpg,.png,.jpeg"
                    onChange={setBannerImage}
                    onChangeFunction={handleChangeFileBanner}
                  />
                  <UploadField3
                    label={`Upload your Preview Video`}
                    id="asd1515"
                    onChange={setEventVideo}
                    info="File Size Limit 500 MB Formats -Avi,mp4"
                    FileType=".mp4,.avi,.mov"
                  />
                </section>

                <Editor1
                  label={`Benefits of leaderboard`}
                  placeholder={`Caption your Event`}
                  info="A brief description gives your audience some context"
                  Content={data?.benefits}
                  id="benefits"
                  required={true}
                  setContent={(e) => setdata({ ...data, benefits: e })}
                />

                <Editor1
                  label={`Describe your Event`}
                  placeholder={`Caption your Event`}
                  info="A brief description gives your audience some context"
                  Content={Content}
                  required={true}
                  setContent={(e) => setContent(e)}
                />

                <Tags1
                  label="Add Relevant Tags"
                  placeholder="Press Enter to add tags"
                  info="This will help in easy search and recommendation"
                  tags={Tags}
                  id="eventTags"
                  name="eventTags"
                  setTags={setTags}
                />

                <Dropdown1
                  label="Max Capacity?"
                  placeholder="Choose the capacity of the event"
                  value={["Unlimited", "Enter Manually"]}
                  required={true}
                  defaultValue="Unlimited"
                  selectedValue={(e) => {
                    setSeatCapacity(e);
                  }}
                  onClick={() => {
                    mixpanel.track(`${paid} Service`);
                  }}
                />

                {seatCapacity === "Enter Manually" && (
                  <TextField1
                    label="No of Seats"
                    type="text"
                    id="eventSeatCapacity"
                    name="eventSeatCapacity"
                    value={data?.eventSeatCapacity}
                    placeholder="Enter the number of seats in the event"
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>
          </section>

          <section className="buttons_form">
            <Button1 text="Save and Publish" onClick={onSubmit} />
          </section>
        </div>

        <div className="live_preview_edit_profile_page">
          <div className="live_preview_modal_design">
            <section>
              <img
                src={require("../../../../Utils/Images/mobile-screen.png")}
                alt=""
              />
              <CreateEventDemo
                {...data}
                paid={paid}
                ldesc={Content}
                seatCapacity={seatCapacity}
                cname={cname}
                cprofile={cprofile}
                crating={crating}
                ctagline={ctagline}
                multipleSpeakers={multipleSpeakers}
                speakersArray={speakersArray}
                speakersImagesArray={speakersImagesArray}
              />
            </section>
          </div>
        </div>
      </div>

      {/* Live preview Section ------------- */}
      {openimagePreview?.value ? (
        <Modal
          open={openimagePreview?.value}
          onClose={() => setImagePreview({ value: false, indexToCrop: null })}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="ultimatewrapper_imageprev">
            <div className="container_imageresize">
              <div className="container-cropper">
                <>
                  <div className="cropper">
                    <Cropper
                      image={imagetocrop[openimagePreview?.indexToCrop]}
                      crop={crop}
                      zoom={zoom}
                      aspect={
                        openimagePreview?.indexToCrop === 0 ? 3 / 1 : 1 / 1
                      }
                      cropShape={
                        openimagePreview?.indexToCrop === 0 ? "rect" : "round"
                      }
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                </>
              </div>

              <div className="container-buttons">
                <div className="slider-imagecrop">
                  <div>
                    {" "}
                    <AddIcon />
                  </div>
                  <div className="slider-imagecrop-wrap">
                    <Slider
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e, zoom) => setZoom(zoom)}
                    />
                  </div>
                  <div>
                    {" "}
                    <RemoveIcon />
                  </div>
                </div>
                <div className="button-preview">
                  {" "}
                  <button onClick={savecroppedImage}>Save</button>
                  <button
                    onClick={() =>
                      setImagePreview({ value: false, indexToCrop: null })
                    }
                  >
                    Cancel
                  </button>
                </div>
                <span className="warningspan_imagepreview">
                  *Do not save if you want the full image to be covered in
                  banner.
                </span>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}
      <SuperSEO title="Anchors - Create Service" />
    </>
  );
}

export default CreateEvent;
