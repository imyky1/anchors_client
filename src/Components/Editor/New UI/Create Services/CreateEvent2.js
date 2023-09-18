import React, { useEffect, useState, useContext, useRef } from "react";
import "./Canvas.css";
import { Button1, Button3 } from "./InputComponents/buttons";
import {
  Dropdown1,
  Editor1,
  Tags1,
  TextField1,
  RadioField1,
  UploadField3,
  Select1,
  DatePicker1,
  TimePicker1,
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

import DateIcon from "./calendar.svg";
import TimeIcon from "./clock.svg";
import PNGIMG from "../../../../Utils/Images/default_user.png";
import { toBlob } from "html-to-image";
import { CreateEventDemo } from "./CreateServiceDemo";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

const FirstPage = ({
  data,
  handleChange,
  paid,
  setpaid,
  setCurrentPage,
  setdata,
}) => {
  return (
    <>
      <section className="create_form_box">
        {/* left side---------------------------------------------------------------------------- */}
        <div className="left_section_form" style={{ width: "100%" }}>
          <Select1
            value={["Paid", "Free"]}
            selectedValue={(e) => {
              setpaid(e);
              setdata({ ...data, ssp: 0, smrp: 0 });
            }}
            defaultValue={paid}
          />

          <TextField1
            label="Title of Event"
            name="sname"
            id="sname"
            required={true}
            value={data?.sname}
            placeholder="Enter Title Here"
            onChange={handleChange}
          />

          {/* <TextField1
            label="Event Date"
            name="date"
            type="date"
            id="date"
            required={true}
            value={data?.date}
            onChange={handleChange}
          /> */}

          <DatePicker1
            label="Event Date"
            name="date"
            type="date"
            id="date"
            required={true}
            value={data?.date}
            placeholder="Select Event Date"
            onChange={(date)=>{setdata({...data,date:date})}}
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
              value={data?.startTime}
              placeholder="Enter Title Here"
              onChange={handleChange}
            />
            <TextField1
              label="Event End Time"
              name="endTime"
              type="time"
              id="endTime"
              required={true}
              value={data?.endTime}
              placeholder="Enter Title Here"
              onChange={handleChange}
            />
          </section>

          <Select1
            label="Event Mode"
            required={true}
            value={["Online", "Offline"]}
            selectedValue={(e) => {
              setdata({ ...data, stype: e });
            }}
            defaultValue={data?.stype}
          />

          {paid === "Paid" && (
            <section
              style={{
                width: "100%",
                gap: "25px",
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
                value={data?.smrp}
                required={true}
                onChange={handleChange}
              />

              <TextField1
                label="Discounted Price"
                placeholder="Min 99"
                name="ssp"
                id="ssp"
                required={true}
                value={data?.ssp}
                onChange={handleChange}
              />
            </section>
          )}

          <section
            style={{
              width: "100%",
              gap: "25px",
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              marginBottom: "32px",
            }}
          >
            <TextField1
              label={data?.stype === "Offline" ? "Venue" : "Meet Link"}
              name="meetlink"
              id="meetlink"
              required={true}
              value={data?.meetlink}
              placeholder="Enter Title Here"
              onChange={handleChange}
            />
            <TextField1
              label="No of Seats"
              required={true}
              type="text"
              id="eventSeatCapacity"
              name="eventSeatCapacity"
              value={data?.eventSeatCapacity}
              placeholder="Enter the number of seats in the event"
              onChange={handleChange}
            />
          </section>
        </div>
      </section>

      <section className="buttons_form">
        <Button1
          text="Next"
          icon={<AiOutlineArrowRight />}
          onClick={() => {
            setCurrentPage(2);
          }}
        />
      </section>
    </>
  );
};

const SecondPage = ({
  data,
  setdata,
  setBannerImage,
  handleChangeFileBanner,
  setEventVideo,
  Content,
  setContent,
  onSubmit,
  setCurrentPage,
  isSpeakerSelected,
  allCreatorInfo,
  handleChangeSpeakerImage,
  handleSpeaker,
  speakersArray,
  speakersImagesArray,
  handleAddSpeaker,
  setImagePreview,
  setZoom,
  setCrop,
  setCroppedArea,
  handleSpeakerChange,
  handleRemoveSpeaker,
}) => {
  return (
    <>
      <section className="create_form_box">
        {/* left side---------------------------------------------------------------------------- */}
        <div className="left_section_form" style={{ width: "100%" }}>
          {
            <div className="create_speaker_toggle">
              Are you a speaker too? <span style={{ color: "red" }}>*</span>
              <RadioField1
                onChange={(value) => handleSpeaker(value)}
                value={isSpeakerSelected}
              />
            </div>
          }

          {isSpeakerSelected && (
            <div className="map_speaker_details_field">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "40px",
                }}
              >
                <div className="map_speaker_details_field_inside">
                  <div className="map_speaker_details_field_inside_frame">
                    <div className="create_text_04">
                      Add Speaker Details{" "}
                      <span style={{ color: "red" }}>*</span>
                    </div>
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
                      onChangeFunction={(e) => handleChangeSpeakerImage(e, 0)}
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

          {(isSpeakerSelected
            ? speakersArray.length > 1
            : speakersArray.length > 0) && (
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
                    marginBottom: "40px",
                  }}
                >
                  <div className="map_speaker_details_field_inside">
                    <div className="map_speaker_details_field_inside_frame">
                      <div className="create_text_04">
                        Add Speaker Details{" "}
                        <span style={{ color: "red" }}>*</span>
                      </div>
                      <TextField1
                        label="Name"
                        name="name"
                        value={
                          isSpeakerSelected
                            ? speakersArray[index + 1]?.name
                            : speakersArray[index]?.name
                        }
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
                      <TextField1
                        label="Designation"
                        name="designation"
                        value={
                          isSpeakerSelected
                            ? speakersArray[index + 1]?.designation
                            : speakersArray[index]?.designation
                        }
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

                      <Button1
                        text="Remove Speaker"
                        onClick={() =>
                          handleRemoveSpeaker(
                            isSpeakerSelected ? index + 1 : index
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {speakersArray.length < 3 && (
            <div
              className="create_text_04"
              onClick={handleAddSpeaker}
              style={{ cursor: "pointer" }}
            >
              Add Speaker
              <BsPlus
                style={{
                  marginBottom: "-3px",
                  fontSize: "17px",
                  marginLeft: "-1px",
                  fontWeight: "bolder",
                }}
              />{" "}
            </div>
          )}

          <Editor1
            label={`Describe your Event`}
            placeholder={`Caption your Event`}
            info="A brief description gives your audience some context"
            Content={Content}
            required={true}
            setContent={(e) => setContent(e)}
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
        </div>
      </section>

      <section className="buttons_form">
        <Button1
          text="Publish"
          icon={<AiOutlineArrowRight />}
          onClick={onSubmit}
        />
        <Button3
          text="Previous"
          icon={<AiOutlineArrowLeft />}
          onClick={() => {
            setCurrentPage(1);
          }}
        />
      </section>
    </>
  );
};

function CreateEvent2({
  progress,
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

  const [paid, setpaid] = useState("Paid"); // decides the form acc to paid or free service type
  const [openLoading, setOpenLoading] = useState(false); // controlls the loader

  const [currentPage, setCurrentPage] = useState(1); // deciding the form to shows

  // state for image cropping
  const [imagetocrop, setImageToCrop] = useState([]); // first is banner image , rest are sepaker's profile image
  const [openimagePreview, setImagePreview] = useState({
    value: false,
    indexToCrop: null,
  });

  // default banner
  const [defaultbanner, setDefaultBanner] = useState(false); // decides wheter to user checked the default banner-----
  const htmlElementRef = useRef(null);

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
  const [seatCapacity, setSeatCapacity] = useState("Enter Manually");
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
      // Create a new array with the same length as the original array
      const shiftedArray = [];
      const shiftedArray2 = [];
      imagetocrop.splice(1, 0, "");

      // Insert the new element at the beginning
      shiftedArray[0] = {
        name: allCreatorInfo?.name,
        designation: allCreatorInfo?.tagLine,
        profile: allCreatorInfo?.profile,
        isCreator: true,
      };

      // Shift elements to the left in speaker array data
      for (let i = 1; i < speakersArray.length + 1; i++) {
        shiftedArray[i] = speakersArray[i - 1];
        shiftedArray2[i] = speakersImagesArray[i - 1];
      }

      if (shiftedArray.length > 3) {
        shiftedArray.pop();
      }

      if (shiftedArray2.length > 3) {
        shiftedArray2.pop();
      }

      setSpeakersArray(shiftedArray);
      setSpeakersImagesArray(shiftedArray2);
    } else {
      if (speakersArray.length === 1) {
        setSpeakersArray([{}]);
        setSpeakersImagesArray([]);
      } else {
        setSpeakersArray(speakersArray.slice(1));
        setSpeakersImagesArray(speakersImagesArray.slice(1));
      }
      setImageToCrop(imagetocrop.slice(0, 1).concat(imagetocrop.slice(2)));
    }
  };

  // changes handling in input field ---------------------------------
  const handleChange = (e) => {
    setdata({ ...data, [e?.target?.name]: e?.target?.value });
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
    if (speakersArray.length === 0) {
      setMultipleSpeakers(false);
      return true;
    }

    if (Object.keys(speakersArray[0]).length === 0) {
      setMultipleSpeakers(false);
      return true;
    }

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
      } else {
        setMultipleSpeakers(true);
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
                speakersArray ?? null
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

    let finalArr2 = speakersImagesArray
      .slice(0, index)
      .concat(speakersImagesArray.slice(index + 1));

    let finalArr3 = imagetocrop
      .slice(0, index + 1)
      .concat(speakersImagesArray.slice(index + 2));

    setSpeakersArray(finalArr);
    setSpeakersImagesArray(finalArr2);
    setImageToCrop(finalArr3);
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


  useEffect(() => {
    window.scrollTo(0,0)
  }, [currentPage])
  


  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}

      {showPopup?.open && (
        <CongratsServiceModal type="Event" link={showPopup?.link} />
      )}

      {/* Banners default ------- */}
      <div className="default_previewer_wrapper" style={{ zIndex: "-10" }}>
        {/* Html banner ------------------------------- */}
        {multipleSpeakers ? (
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
      </div>

      <div className="create_service_outside_wrapper">
        <div className="main_create_container_new_conatiner_live_demo">
          {/* Heading of the create section ------------------------ */}
          {currentPage === 1 && (
            <section className="heading_create_box">
              <div>
                <h1 className="create_text_01">Host an Event!</h1>
                <p className="create_text_02">Webinars, workshops, Q&A!</p>
              </div>
            </section>
          )}

          {/* First Section ------------- */}
          {currentPage === 1 && (
            <FirstPage
              data={data}
              handleChange={handleChange}
              paid={paid}
              setpaid={setpaid}
              setCurrentPage={setCurrentPage}
              setdata={setdata}
            />
          )}

          {/* Second Page ---- */}
          {currentPage === 2 && (
            <SecondPage
              data={data}
              setdata={setdata}
              setBannerImage={setBannerImage}
              handleChangeFileBanner={handleChangeFileBanner}
              setEventVideo={setEventVideo}
              Content={Content}
              setContent={setContent}
              onSubmit={onSubmit}
              setCurrentPage={setCurrentPage}
              isSpeakerSelected={isSpeakerSelected}
              allCreatorInfo={allCreatorInfo}
              handleChangeSpeakerImage={handleChangeSpeakerImage}
              handleSpeaker={handleSpeaker}
              speakersArray={speakersArray}
              speakersImagesArray={speakersImagesArray}
              handleAddSpeaker={handleAddSpeaker}
              multipleSpeakers={multipleSpeakers}
              setImagePreview={setImagePreview}
              setZoom={setZoom}
              setCrop={setCrop}
              setCroppedArea={setCroppedArea}
              handleSpeakerChange={handleSpeakerChange}
              handleRemoveSpeaker={handleRemoveSpeaker}
            />
          )}
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

export default CreateEvent2;
