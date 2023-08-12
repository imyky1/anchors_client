import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Create.css";
import { Button1 } from "./InputComponents/buttons";
import {
  Dropdown1,
  Editor1,
  RadioField1,
  Tags1,
  TextField1,
  UploadField1,
  UploadField2,
  UploadField3,
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
import { FiSend } from "react-icons/fi";
import CreateServiceDemo from "./CreateServiceDemo";

function Create({
  progress,
  openDefaultBanner,
  setDefaultBannerData,
  cname,
  FinalDefaultBannerFormData,
  defaultImageobjectUrl,
}) {
  const navigate = useNavigate();

  // for checking the type of service we need to create --------------------------------------
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const [CreateType, setCreateType] = useState(); // decides the type of document choosed in query
  const [draftCreated, setDraftCreated] = useState({
    status: false,
    service: {},
  }); // checks if the draft is created or not --------
  const [showPopup, setshowPopup] = useState({
    open: false,
    link: "",
    buttonType: "",
  }); // success popup data

  const [paid, setpaid] = useState(); // decides the form acc to paid or free service type
  const [advanced, setAdvanced] = useState(false); // sets the advanced customize settings
  const [openLoading, setOpenLoading] = useState(false); // controlls the loader

  const [showimg, setShowimg] = useState(null); // img url thats being uploaded

  // state for image cropping
  const [imagetocrop, setImageToCrop] = useState(null);
  const [openimagePreview, setImagePreview] = useState(false);

  // default banner
  const [defaultbanner, setDefaultBanner] = useState(false); // decides wheter to user checked the default banner-----

  // service Context --------------------------------------------------
  const {
    getslugcount,
    addservice,
    UploadDocuments,
    Uploadfile,
    updateService,
    getserviceinfo,
    serviceInfo,
  } = useContext(ServiceContext);
  const [data, setdata] = useState({
    sname: "",
    sdesc: "",
    smrp: "0",
    ssp: "0",
  });

  let [Tags, setTags] = useState([]);
  const [Content, setContent] = useState();
  const [BannerImage, setBannerImage] = useState();

  // allow preview variables
  const [allowDownload, setAllowDownload] = useState(false);
  const [noOfPage, setNoOfPages] = useState("0");
  const [ServiceDoc, setServiceDoc] = useState();

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
      setShowimg(URL.createObjectURL(file));
      setBannerImage(file);
    }
  };

  const data1 = new FormData();
  const data2 = new FormData();
  data1.append("file", BannerImage);
  data2.append("file", ServiceDoc);

  // check for the type of the service that needs to be created
  useEffect(() => {
    setCreateType(query.get("type"));
  }, [query]);

  // get duplicate service data -----------------------------
  useEffect(() => {
    if (query.get("duplicate")) {
      getserviceinfo(query.get("duplicate"));
    }
  }, []);

  useEffect(() => {
    if (query.get("duplicate")) {
      setdata({
        sname: serviceInfo?.service?.sname,
        sdesc: serviceInfo?.service?.sdesc,
        smrp: serviceInfo?.service?.smrp,
        ssp: serviceInfo?.service?.ssp,
      });
      setTags(serviceInfo?.service?.tags);
      setContent(serviceInfo?.service?.ldesc);
      setNoOfPages(serviceInfo?.service?.noOfPages);

      if (serviceInfo?.service?.allowDownload) {
        setAllowDownload(serviceInfo?.service?.allowDownload);
      }
      if (serviceInfo?.service?.isPaid) {
        setpaid("Paid");
      } else {
        setpaid("Free");
      }
    }
  }, [getserviceinfo]);

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
    setShowimg(URL.createObjectURL(img));
    setImagePreview(false);
  };

  // changes handling in input field ---------------------------------
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  // responsible for generating slug
  const process = () => {
    let slug = data.sname.split(" ").join("-"); // creates the slug from the name
    //getslugcount(slug.toLowerCase());  // checks if similar slug already exists -----
    return slug;
  };

  // reupdate the draft ----------
  const updateTheDraft = async (buttonType) => {
    progress(0);
    setOpenLoading(true);
    if (data.sname.length > 1 && Content.length > 10) {
      try {
        var banner;
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
        } else {
          banner = { url: draftCreated?.service?.simg };
        }
        if (ServiceDoc) {
          /// to check if the creator want soto to change the document or not
          var docs = await UploadDocuments(data2);
        } else {
          docs = { result: { Location: draftCreated?.service?.surl } };
        }
        const newData = {
          ...data,
          ldesc: Content,
          Tags,
          simg: banner?.url,
          surl: docs?.result?.Location,
          isPaid: paid === "Free" ? false : true,
          smrp: paid === "Free" ? 0 : data.smrp,
          ssp: paid === "Free" ? 0 : data.ssp,
          allowDownload,
          noOfPage,
          status: buttonType === "preview" ? 2 : 1,
        };
        updateService(draftCreated?.service?._id, newData).then((e) => {
          if (e?.success) {
            setDraftCreated({ status: true, service: e?.service }); // to know that document is already created
            setOpenLoading(false);
            setshowPopup({
              open: true,
              link:
                buttonType === "preview"
                  ? `/s/preview/${e.service.slug}`
                  : e?.shortLink,
              buttonType,
            });
          } else {
            toast.error(
              "Some error occured, Although we have saved your service as draft",
              {
                position: "top-center",
                autoClose: 3000,
              }
            );
          }
        });
      } catch (error) {
        setOpenLoading(false);
        toast.error(`Server side error please try after some time`, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      setOpenLoading(false);
      toast.info("Fill all the required fileds", {
        position: "top-center",
        autoClose: 3000,
      });
    }
    setOpenLoading(false);
    progress(100);
  };

  // form submission ----------------------------------------------------------
  const onSubmit = async (buttonType) => {
    let slug = process();
    let SlugCount = await getslugcount(slug.toLowerCase());
    setOpenLoading(true); // true on loader
    progress(0);
    if (
      data.sname.length > 1 &&
      ServiceDoc &&
      paid &&
      (BannerImage || defaultbanner)
    ) {
      if (Content?.length > 10) {
        try {
          var banner;
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
          var doc = await UploadDocuments(data2);
          if (banner?.success && doc?.success) {
            progress(75);
            let json = await addservice(
              data.sname,
              data.sdesc,
              Content,
              SlugCount === 0
                ? slug.toLowerCase()
                : slug.toLowerCase().concat("--", `${SlugCount}`),
              banner?.url,
              doc?.result?.Location,
              Tags,
              CreateType === "excel" ? 1 : CreateType === "video" ? 2 : 0, // type for pdf is 0 and excel is 1 and video is 2
              paid === "Free" ? false : true,
              paid === "Free" ? 0 : data.smrp,
              paid === "Free" ? 0 : data.ssp,
              allowDownload,
              noOfPage,
              buttonType === "preview" ? 2 : 1
            );
            if (json?.success) {
              if (buttonType === "preview") {
                setDraftCreated({ status: true, service: json?.service }); // to know that document is already created
              }
              setOpenLoading(false);
              setshowPopup({
                open: true,
                link:
                  buttonType === "preview"
                    ? `/s/preview/${json.service.slug}`
                    : json?.shortLink,
                buttonType,
              });
            } else {
              setOpenLoading(false);
              toast.error(`Service Not Created Please Try Again`, {
                position: "top-center",
                autoClose: 2000,
              });
            }
          } else {
            setOpenLoading(false);
            toast.error(`Facing issues while uploading files and images`, {
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
      type: CreateType,
    });
    openDefaultBanner();
  };

  // check is the query parameter is changed----------------------------------------
  if (!["pdf", "excel", "video", "event"].includes(CreateType)) {
    return navigate("/dashboard");
  }

  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}

      {showPopup?.open && (
        <SuccessService
          type={CreateType}
          link={showPopup?.link}
          buttonType={showPopup?.buttonType}
          onClose={() => {
            setshowPopup({ ...showPopup, open: false });
          }}
        />
      )}

      <div className="create_service_outside_wrapper">
        <div className="main_create_container_new_conatiner_live_demo">
          {/* Heading of the create section ------------------------ */}
          <section className="heading_create_box">
            <div>
              <h1 className="create_text_01">
                What is your{" "}
                {CreateType === "pdf"
                  ? "PDF"
                  : CreateType === "excel"
                  ? "Excel Sheet"
                  : CreateType === "video"
                  ? "Video"
                  : CreateType === "event"
                  ? "Event"
                  : ""}{" "}
                about?
              </h1>
              <p className="create_text_02">
                {CreateType === "pdf"
                  ? "You can upload helpful study material, interview questions, food recipes etc."
                  : CreateType === "excel"
                  ? "You can upload helpful study material, interview questions prep, list of companies hiring, etc"
                  : CreateType === "video"
                  ? "You can upload gorgeous art, DIY tutorials, Fashion Ideas etc."
                  : ""}
              </p>
            </div>
            {/* <button
              onClick={() => {
                mixpanel.track("Preview Sample Page");
                window.open(
                  CreateType === "pdf"
                    ? "https://www.anchors.in/s/list-of-top-10-youtube-channel-for-coding"
                    : CreateType === "excel"
                    ? "https://www.anchors.in/s/companies-list-hiring-for"
                    : CreateType === "video"
                    ? "https://www.anchors.in/s/top-10-profession-for-fresher-with-salary-package-5-8-lpa"
                    : ""
                );
              }}
            >
              <FiSend /> Preview Sample Page
            </button> */}
          </section>

          {/* form section of create container ---------------------------------------- */}
          <section className="create_form_box">
            {/* left side---------------------------------------------------------------------------- */}
            <div className="left_section_form" style={{ width: "100%" }}>
              <TextField1
                label="Title of Service"
                name="sname"
                id="sname"
                required={true}
                value={data?.sname}
                placeholder="Enter Title Here"
                onChange={handleChange}
              />

              <Dropdown1
                label="Is it paid/free?"
                placeholder="Choose a service type"
                value={["Free", "Paid"]}
                required={true}
                defaultValue={paid}
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
                    label="Selling Price "
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
                <UploadField3
                  label="Upload Banner Image"
                  id="bannerimage"
                  info="File Size Limit 15 MB Formats - jpg,png"
                  FileType=".jpg,.png,.jpeg"
                  required={true}
                  onChange={setBannerImage}
                  disabled={defaultbanner}
                  onChangeFunction={handleChangeFileBanner}
                />
                <UploadField3
                  label={`Upload your ${
                    CreateType === "pdf"
                      ? "Document"
                      : CreateType === "excel"
                      ? "Sheet"
                      : CreateType === "video"
                      ? "Video"
                      : ""
                  }`}
                  id="asd1515"
                  required={true}
                  onChange={setServiceDoc}
                  info={
                    CreateType === "pdf"
                      ? "File Size Limit 15 MB Formats - pdf"
                      : CreateType === "excel"
                      ? "File Size Limit 15 MB Formats -xls"
                      : CreateType === "video"
                      ? "File Size Limit 500 MB Formats -Avi,mp4"
                      : ""
                  }
                  FileType={
                    CreateType === "pdf"
                      ? ".pdf"
                      : CreateType === "excel"
                      ? ".xls,.cvv"
                      : CreateType === "video"
                      ? ".mp4,.avi"
                      : ""
                  }
                />
              </section>

              <section
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  marginBottom: "32px",
                  height:"36px"
                }}
              >
                <RadioField1
                  label="Use Default Image"
                  onChange={(e) => {
                    mixpanel.track("Use default banner");
                    setDefaultBanner(e);
                  }}
                  id="defaultimageradio"
                />

                {(BannerImage ||
                  defaultbanner) && (
                    <Button1
                      text={
                        defaultbanner
                          ? "Edit default Banner"
                          : "Preview Image and Resize"
                      }
                      onClick={() => {
                        if (defaultbanner) {
                          EditOptionDefaultBanner();
                          mixpanel.track("Edit default banner");
                        } else {
                          setImagePreview((prev) => !prev);
                          mixpanel.track("Edit Browse Banner");
                        }
                      }}
                    />
                  )}
              </section>

              <Editor1
                label={`Describe your ${
                  CreateType === "pdf"
                    ? "Document"
                    : CreateType === "excel"
                    ? "Sheet"
                    : CreateType === "video"
                    ? "Video"
                    : ""
                }`}
                placeholder={`Caption your ${
                  CreateType === "pdf"
                    ? "Document"
                    : CreateType === "excel"
                    ? "Sheet"
                    : CreateType === "video"
                    ? "Video"
                    : ""
                }`}
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
                id="servicecreateTags"
                setTags={setTags}
              />
            </div>
          </section>

          {/* Used to trigeer the advanced section ------------------------------------------------------------------ */}
          {!advanced && (
            <section className="adanced_remote_control">
              <span
                className="create_text_03"
                onClick={() => {
                  setAdvanced(!advanced);
                  mixpanel.track("Advance Customization ");
                }}
              >
                Advanced Customizations &nbsp;
                <i className="fa-solid fa-plus "></i>
              </span>
            </section>
          )}

          {advanced && (
            <section className="advanced_custom_mode_create">
              <span className="create_text_03">Advanced Customizations</span>
              <section>
                {/* left section -------------------------- */}
                <div className="left_section_form" style={{ width: "100%" }}>
                  <Editor1
                    name="sdesc"
                    label={`Describe your ${
                      CreateType === "pdf"
                        ? "Document"
                        : CreateType === "excel"
                        ? "Sheet"
                        : CreateType === "video"
                        ? "Video"
                        : ""
                    }`}
                    placeholder="Mention guidelines how your content can be useful for your audience"
                    Content={data.sdesc}
                    setContent={(e) => setdata({ ...data, sdesc: e })}
                  />

                  <TextField1
                    label={
                      CreateType === "video"
                        ? "Time Duration"
                        : CreateType === "excel"
                        ? "Number of items"
                        : "Number of Pages"
                    }
                    placeholder={
                      CreateType === "video"
                        ? "in minutes"
                        : CreateType === "excel"
                        ? "21"
                        : ""
                    }
                    onChange={(e) => setNoOfPages(e.target.value)}
                    value={noOfPage}
                  />

                  {/* Allow download section ------------------------------- */}
                  <RadioField1
                    label="Allow Download"
                    onChange={setAllowDownload}
                    value={allowDownload}
                    id="asdas"
                  />
                </div>
              </section>
            </section>
          )}

          <section className="buttons_form">
            {/* <Button1
              text="Preview"
              onClick={() => {
                draftCreated?.status
                  ? updateTheDraft("preview")
                  : onSubmit("preview");
              }}
            /> */}
            <Button1
              text="Save and Publish"
              onClick={() => {
                draftCreated?.status
                  ? updateTheDraft("save")
                  : onSubmit("save");
              }}
            />
            {/* <Button1
            text="Save and Publish"
            onClick={() => {
              TestBanner();
            }}
          /> */}
          </section>
        </div>

        {/* Live preview Section ------------- */}
        <div className="live_preview_edit_profile_page">
          <div className="live_preview_modal_design">
            <section>
              <img
                src={require("../../../../Utils/Images/mobile-screen.png")}
                alt=""
              />
              <CreateServiceDemo
                {...data}
                paid={paid}
                ldesc={Content}
                simg={defaultbanner ? defaultImageobjectUrl : showimg}
                stype={CreateType}
                noOfPage={noOfPage}
              />
            </section>
          </div>
        </div>
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

export default Create;
