import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { creatorContext } from "../../../../Context/CreatorState";
import ServiceContext from "../../../../Context/services/serviceContext";
import { LoadTwo } from "../../../Modals/Loading";
import SuccessService from "../../../Modals/ServiceSuccess/Modal";
import {
  Editor1,
  SocialFields,
  TextField1,
} from "../Create Services/InputComponents/fields_Labels";
import "./EditProfile.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Cropper from "react-easy-crop";

import {
  TextField,
  MenuItem,
  ThemeProvider,
  createTheme,
  Button,
  Modal,
  Box,
  Typography,
  Slider,
} from "@mui/material";
import getCroppedImg, { generateDownload } from "../../../helper/imageresize";
import { SuperSEO } from "react-super-seo";

const EditProfile = (props) => {
  const {
    allCreatorInfo,
    getAllCreatorInfo,
    basicNav,
    setCreatorInfo,
    generateInviteCode,
    getTellUsMoreFormData,
  } = useContext(creatorContext);
  const { Uploadfile } = useContext(ServiceContext);
  const [showPopup, setshowPopup] = useState(false); // success popup

  const [data, setdata] = useState({
    name: "",
    tagLine: "",
    linkedInLink: "",
    ytLink: "",
    instaLink: "",
    fbLink: "",
    teleLink: "",
    twitterLink: "",
    dob: "",
    topmateLink: "",
    profile: "",
  });
  const [phone, setPhone] = useState(0);
  const [Content, setContent] = useState();
  const [previewSourceOne, setPreviewSourceOne] = useState(""); // saves the data of file selected in the form
  //Image preview and resize opening model
  const [openimagePreview, setImagePreview] = useState(false);
  const [imagetocrop, setImageToCrop] = useState(null);

  const data1 = new FormData();
  data1.append("file", previewSourceOne);

  useEffect(() => {
     getTellUsMoreFormData().then((e) => {
       if (e?.success) {
         setPhone(e?.form?.contactNumber);
       }
     });
    getAllCreatorInfo();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setdata({
      ...data,
      ...allCreatorInfo,
    });
    setContent(allCreatorInfo?.aboutMe);
    setPhone(allCreatorInfo?.phone);
    // eslint-disable-next-line
  }, [getAllCreatorInfo]);

  const [openLoading, setOpenLoading] = useState(false);

  // Change in values of input tags
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  const changephone = (e) => {
    setPhone(e.target.value);
  };

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
  const openimageresizebar = () => {
    setImagePreview((prev) => !prev);
  };

  const downloadcroppedimage = () => {
    generateDownload(imagetocrop, croppedArea);
  };
  const savecroppedImage = async () => {
    const img = await getCroppedImg(
      imagetocrop,
      croppedArea,
      previewSourceOne?.name
    );
    setPreviewSourceOne(img);
    setImagePreview(false);
    setShowimg(URL.createObjectURL(img));
  };

  const [showimg, setShowimg] = useState(null);


  function importData() {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (_) => {
      // you can use this method to get file and perform respective operations
      let files = Array.from(input.files);
      setShowimg(URL.createObjectURL(files[0]));
      setPreviewSourceOne(files[0]);
      const file = files[0];
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedArea(null);
      if (files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.addEventListener("load", () => {
          setImageToCrop(reader.result);
        });
        setPreviewSourceOne(file);
      }
    };
    input.click();
  }
  let phone_number = phone;
  const onSubmit = async (e) => {
    let sample_number = phone;
    props.progress(0);
    setOpenLoading(true);
    e.preventDefault();
    sample_number = sample_number.toString();
    sample_number = sample_number.length;

    if (data?.name && data?.tagLine && data?.dob && sample_number === 10) {
      var profile = previewSourceOne && (await Uploadfile(data1));
      const newData = {
        ...data,
        aboutMe: Content,
        profile: previewSourceOne
          ? profile?.url
          : data?.profile
          ? data?.profile
          : basicNav?.photo,
        phone: phone_number,
      };
      const success = setCreatorInfo(newData);
      if (success) {
        //toast.success("Changes Saved Successfully ", {
        //  position: "top-center",
        //  autoClose: 2000,
        //});
        setTimeout(async () => {
          await generateInviteCode(); // generates invite code it not exists otherwise
        }, 1500);
        setOpenLoading(false);
        setshowPopup(true);
      } else {
        setOpenLoading(false);
        toast.error("Changes Not Saved ", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      setOpenLoading(false);
      toast.info("Fill all the details properly", {
        position: "top-center",
        autoClose: 1500,
      });
    }

    props.progress(100);
  };

  return (
    <>
      {showPopup && <SuccessService type="Profile Information" />}
      <ToastContainer />
      {openLoading && <LoadTwo open={openLoading} />}
      <div className="personalinfo_wrap">
        <div className="personalinfo_top">
          <h1>Personal Information </h1>
          <span>Update your personal informations here</span>
        </div>
        <div className="personalinfo_photosection">
          <span>
            Profile Picture <span style={{ color: "red" }}>*</span>{" "}
          </span>
          <div className="personalinfo_photocontainer">
            <div className="personalinfo_photo">
              <img
                className="profileinfo_imagec"
                src={
                  showimg
                    ? showimg
                    : data?.profile !== ""
                    ? data?.profile
                    : basicNav?.photo
                }
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "data:image/png;base64,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";
                }}
              />
            </div>
            <div className="personalinfo_upload">
              <button
                className="personalinfo_buttonupload"
                onClick={() => importData()}
              >
                Upload Image
              </button>
              {previewSourceOne ? (
                <>
                  {" "}
                  <Button
                    variant="outlined"
                    onClick={openimageresizebar}
                    className="imageresizeopenerbutton"
                  >
                    Preview Image and Resize
                  </Button>
                  <br />
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="personalinfo_formwrap">
          <div className="perosnalinfo_leftform">
            <TextField1
              label="Full Name"
              name="name"
              id="name"
              required={true}
              value={data?.name !== "" ? data.name : basicNav?.name}
              placeholder="Enter Name Here"
              onChange={handleChange}
            />
            <TextField1
              label="Tagline"
              name="tagLine"
              id="tagLine"
              required={true}
              value={data.tagLine}
              placeholder="Ex Product Manager"
              onChange={handleChange}
            />
          </div>
          <div className="perosnalinfo_rightform">
            <TextField1
              label="Contact Number"
              name="phone"
              id="phone"
              required={true}
              value={phone}
              type="number"
              onChange={changephone}
            />

            <TextField1
              label="Date Of Birth"
              name="dob"
              id="dob"
              required={true}
              type="Date"
              value={data?.dob?.slice(0, 10)}
              placeholder="dd/mm/yyyy"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="personalinfo_aboutme">
          <Editor1
            name="about"
            label="About Me"
            placeholder="Please describe yourself"
            Content={Content}
            setContent={(e) => setContent(e)}
          />
        </div>
        <div className="personalinfo_linebreak"></div>
        <div className="personalinfo_socialwrap">
          <h2>Update your social media links </h2>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname">Linkedin Link</span>
            <SocialFields
              placeholder="https://www.linkedin.com/in/username"
              value={data?.linkedInLink}
              name="linkedInLink"
              id="linkedIn"
              onChange={handleChange}
            />
            {allCreatorInfo?.linkedInLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname"> Instagram Link</span>
            <SocialFields
              placeholder="https://www.instagram.com/username"
              value={data?.instaLink}
              name="instaLink"
              id="instagram"
              onChange={handleChange}
            />
            {allCreatorInfo?.instaLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname"> Telegram Link</span>
            <SocialFields
              placeholder="https://t.me/username"
              value={data?.teleLink}
              name="teleLink"
              id="teleLink"
              onChange={handleChange}
            />
            {allCreatorInfo?.teleLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname"> Youtube Link</span>
            <SocialFields
              placeholder="https://www.youtube.com/@channelname"
              value={data?.ytLink}
              name="ytLink"
              id="ytLink"
              onChange={handleChange}
            />
            {allCreatorInfo?.ytLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname"> TopMate Link</span>
            <SocialFields
              placeholder="https://topmate.io/username"
              value={data?.topmateLink}
              name="topmateLink"
              id="topmateLink"
              onChange={handleChange}
            />
            {allCreatorInfo?.topmateLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname"> Twitter Link</span>
            <SocialFields
              placeholder="https://twitter.com/username"
              value={data?.twitterLink}
              name="twitterLink"
              id="twitterLink"
              onChange={handleChange}
            />
            {allCreatorInfo?.twitterLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="personalinfo_savebutton">
          <button onClick={onSubmit}>Save & Update</button>
        </div>
      </div>
      {openimagePreview && previewSourceOne ? (
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
                      aspect={1 / 1}
                      cropShape="round"
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
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={savecroppedImage}
                  >
                    Save
                  </Button>
                  {/* <Button
                        variant="contained"
                        color="secondary"
                        onClick={downloadcroppedimage}
                      >
                        Download
                      </Button> */}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setImagePreview(false)}
                  >
                    Cancel
                  </Button>
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
      <SuperSEO title="Anchors - Edit Profile" />
    </>
  );
};

export default EditProfile;
