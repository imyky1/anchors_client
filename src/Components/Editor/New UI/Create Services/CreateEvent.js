import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Create.css";
import { Button1 } from "./InputComponents/buttons";
import {
  Dropdown1,
  Editor1,
  Tags1,
  TextField1,
  UploadField1,
  UploadField2,
} from "./InputComponents/fields_Labels";
import ServiceContext from "../../../../Context/services/serviceContext";
import { toast } from "react-toastify";
import SuccessService from "../../../Modals/ServiceSuccess/Modal";
import { LoadTwo } from "../../../Modals/Loading";

// imports for image cropping
import getCroppedImg, { generateDownload } from "../../../helper/imageresize";
import { Button, Modal, Slider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Cropper from "react-easy-crop";
import { SuperSEO } from "react-super-seo";
import mixpanel from "mixpanel-browser";
import {FiSend} from "react-icons/fi"

function CreateEvent({
  progress,
  openDefaultBanner,
  setDefaultBannerData,
  cname,
  FinalDefaultBannerFormData,
}) {

  const [showPopup, setshowPopup] = useState({ open: false, link: "" }); // success popup data

  const [paid, setpaid] = useState(); // decides the form acc to paid or free service type
  const [openLoading, setOpenLoading] = useState(false); // controlls the loader

  // state for image cropping
  const [imagetocrop, setImageToCrop] = useState(null);
  const [openimagePreview, setImagePreview] = useState(false);

  // default banner
  const [defaultbanner, setDefaultBanner] = useState(false); // decides wheter to user checked the default banner-----

  // service Context --------------------------------------------------
  const {
    addEvent,
    getslugcountEvent,
    Uploadfile,
    UploadEventVideo
  } = useContext(ServiceContext);
  const [data, setdata] = useState({
    sname: "",
    sdesc: "",
    smrp: 0,
    ssp: 0,
    benefits: "",
    stype: "Online",
    meetlink: "", // or venuerin case of offline
    date: "",
    startTime: "",
    endTime: "",
    noOfSeats: "",
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
        setImageToCrop(reader.result);
      });
      setBannerImage(file);
    }
  };
  
  const data1 = new FormData();
  const data2 = new FormData();
  data1.append("file", BannerImage);
  data2.append("file", EventVideo);


  // Image cropping
  // IMAGE RESIZE
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const savecroppedImage = async () => {
    const img = await getCroppedImg(
      imagetocrop,
      croppedArea,
      BannerImage?.name
    );
    setBannerImage(img);
    setImagePreview(false);
  };

  // changes handling in input field ---------------------------------
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  // responsible for generating slug
  const process = () => {
    let slug = data?.sname.split(" ").join("-"); // creates the slug from the name
    return slug;
  };

  // form submission ----------------------------------------------------------
  const onSubmit = async () => {
    let slug = process();
    const SlugCount = await getslugcountEvent(slug.toLowerCase());

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
      if (Content?.length > 10) {
        try {
          let banner = { success:true,url: "" };
          let eventVideo = {result:{Location:""}}

          // Check for banner and saves if it is available
          if (BannerImage || defaultbanner) {
            // to check if the creator has uploaded banner image o upload
            if (defaultbanner) {
              if (FinalDefaultBannerFormData instanceof FormData) {
                banner = await Uploadfile(FinalDefaultBannerFormData);
              } else {
                toast.info(
                  `Save the default banner design from the Edit Option`,
                  {
                    position: "top-center",
                    autoClose: 2500,
                  }
                );
                setOpenLoading(false);
                return null;
              }
            } else {
              banner = await Uploadfile(data1); /// uplaoding banner and files on s3
            }
          } 

          // Check for video and saves if it is available
          if (EventVideo) {
            eventVideo = await UploadEventVideo(data2);
            progress(50)
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
              seatCapacity === "Enter Manually" ? data?.noOfSeats : "Unlimited",
              data?.meetlink,
              eventVideo?.result?.Location
            );

            if (json?.success) {
              //setservData(json.res);
              setOpenLoading(false);
              setshowPopup({ open: true, link: json?.shortLink });
            } else {
              setOpenLoading(false);
              toast.error(`Service Not Created Please Try Again`, {
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
      toast.info("Fill all the Mandatory Fields", {
        position: "top-center",
        autoClose: 3000,
      });
    }

    progress(100);
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

  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}

      {showPopup?.open && (
        <SuccessService type="Event" link={showPopup?.link} />
      )}

      <div className="main_create_container">
        {/* Heading of the create section ------------------------ */}
        <section className="heading_create_box">
          <div>
          <h1 className="create_text_01">What is your Event about?</h1>
          <p className="create_text_02">You can create events and workshops</p>
          </div>
          <button onClick={()=>{mixpanel.track("Preview Sample Page");window.open("https://www.anchors.in/e/how-to-become-a-product-manager")}}><FiSend/> Preview Sample Page</button>
        </section>

        {/* form section of create container ---------------------------------------- */}
        <section className="create_form_box">
          {/* left side---------------------------------------------------------------------------- */}
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
                type="number"
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
              // disabled={defaultbanner}
              onChangeFunction={handleChangeFileBanner}
              // defaultRadioLabel="Use Default Image"
              // defaultRadioOnChange={(e) => {
              //   mixpanel.track("Use default banner");
              //   e.target.checked
              //     ? setDefaultBanner(true)
              //     : setDefaultBanner(false);
              // }}
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
                      setImagePreview((prev) => !prev);
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

            <Dropdown1
              label="Is it Online/Offline?"
              placeholder="Choose the mode of event"
              value={["Online", "Offline"]}
              required={true}
              defaultValue="Online"
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
              placeholder="Enter Title Here"
              onChange={handleChange}
            />

            <Editor1
              label={`Benefits of leaderboard`}
              placeholder={`Caption your Event`}
              info="A brief description gives your audience some context"
              Content={data?.benefits}
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

          {/* right side----------------- ---------------------------------------------------------------------------*/}
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
                type="number"
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
                type="number"
                placeholder="Enter the number of seats in the event"
                onChange={(e) =>
                  setdata({ ...data, noOfSeats: e.target.value })
                }
              />
            )}
          </div>
        </section>


        <section className="buttons_form">
          <Button1 text="Save and Publish" onClick={onSubmit} />
        </section>
      </div>
      {openimagePreview && BannerImage ? (
        <Modal
          open={openimagePreview}
          onClose={() => setImagePreview(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="ultimatewrapper_imageprev">
            <div className="container_imageresize">
              <div className="container-cropper">
                <>
                  <div className="cropper">
                    <Cropper
                      image={imagetocrop}
                      crop={crop}
                      zoom={zoom}
                      aspect={3 / 1}
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
                  <button onClick={() => setImagePreview(false)}>Cancel</button>
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
