import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Create2.css";
import { Button1, Button3 } from "./InputComponents/buttons";
import {
  Editor1,
  RadioField1,
  Select1,
  TextField1,
  UploadField3,
} from "./InputComponents/fields_Labels";
import ServiceContext from "../../../../Context/services/serviceContext";
import { toast } from "react-toastify";
import SuccessService from "../../../Modals/ServiceSuccess/Modal";
import { LoadTwo } from "../../../Modals/Loading";

// imports for image cropping
import getCroppedImg from "../../../helper/imageresize";
import { Modal, Slider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Cropper from "react-easy-crop";
import { SuperSEO } from "react-super-seo";
import mixpanel from "mixpanel-browser";
import CreateServiceDemo from "./CreateServiceDemo";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

const FirstPage = ({
  data,
  handleChange,
  setDefaultBanner,
  BannerImage,
  defaultbanner,
  EditOptionDefaultBanner,
  setImagePreview,
  CreateType,
  setServiceDoc,
  setBannerImage,
  handleChangeFileBanner,
  paid,
  setpaid,
  onSubmit,
  setdata
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
              setdata({...data,ssp:0,smrp:0})
            }}
            defaultValue={paid}
          />

          <TextField1
            label="Title of Service"
            name="sname"
            id="sname"
            required={true}
            value={data?.sname}
            placeholder="Keep it catchy"
            onChange={handleChange}
          />

          <section
            style={{
              width: "100%",
              marginBottom: "20px",
              height: "36px",
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
            }}
          >
            <RadioField1
              label="Use Customized Banner"
              onChange={(e) => {
                mixpanel.track("Use default banner");
                setDefaultBanner(e);
              }}
              id="defaultimageradio"
            />

            {(BannerImage || defaultbanner) && (
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
              label={`Upload ${
                CreateType === "pdf"
                  ? "PDF"
                  : CreateType === "excel"
                  ? "Excel"
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
              helperText="For example, crypto tips, book summaries, podcast recos, study notes, project guides etc."
            />

            <UploadField3
              label="Upload Banner"
              id="bannerimage"
              info={
                defaultbanner
                  ? "Using default Banner"
                  : "File Size Limit 15 MB Formats - jpg,png"
              }
              FileType=".jpg,.png,.jpeg"
              required={true}
              onChange={setBannerImage}
              disabled={defaultbanner}
              onChangeFunction={handleChangeFileBanner}
              helperText="Create & upload your banner, stand out!"
            />
          </section>

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
        </div>
      </section>

      <section className="buttons_form">
        <Button1
          text="Save and Next"
          icon={<AiOutlineArrowRight />}
          onClick={onSubmit}
        />
      </section>
    </>
  );
};

const SecondPage = ({
  Content,
  setContent,
  setNoOfPages,
  noOfPage,
  setAllowDownload,
  allowDownload,
  CreateType,
  onSubmit,
  setCurrentPage,
}) => {
  return (
    <>
      <section className="create_form_box">
        {/* left side---------------------------------------------------------------------------- */}
        <div className="left_section_form" style={{ width: "100%" }}>
          <Editor1
            label={`Add ${
              CreateType === "pdf"
                ? "document"
                : CreateType === "excel"
                ? "sheet"
                : CreateType === "video"
                ? "video"
                : ""
            } description`}
            placeholder={`Summarize your ${
              CreateType === "pdf"
                ? "document"
                : CreateType === "excel"
                ? "excel"
                : CreateType === "video"
                ? "video"
                : ""
            }`}
            Content={Content}
            required={true}
            setContent={(e) => setContent(e)}
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
            <TextField1
              label={
                CreateType === "video"
                  ? "Time Duration"
                  : CreateType === "excel"
                  ? "Number of items"
                  : "Number of Pages"
              }
              type="number"
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
            <div
              style={{
                display: "inline-block",
                width: "max-content",
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RadioField1
                label="Allow Download"
                onChange={setAllowDownload}
                value={allowDownload}
                id="asdas"
              />
            </div>
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
    serviceID: null,
  }); // checks if the draft is created or not --------
  const [showPopup, setshowPopup] = useState({
    open: false,
    link: "",
    buttonType: "",
  }); // success popup data

  // Pages control state
  const [currentPage, setCurrentPage] = useState(1);

  const [paid, setpaid] = useState("Paid"); // decides the form acc to paid or free service type
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
    addBasicService,
    addFinalService,
    UploadDocuments,
    Uploadfile,
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
  const [allowDownload, setAllowDownload] = useState(true);
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
    return slug;
  };

  // form submission ----------------------------------------------------------

  // Page two submisson ------------
  const onSubmitSecondForm = async () => {
    setOpenLoading(true); // true on loader
    progress(0);
    if (draftCreated?.serviceID) {
      if (Content?.length > 10) {
        try {
          progress(75);
          let json = await addFinalService(
            draftCreated?.serviceID,
            Content,
            allowDownload,
            noOfPage
          );
          if (json?.success) {
            setOpenLoading(false);
            setshowPopup({
              open: true,
              link: json?.shortLink,
            });
          } else {
            setOpenLoading(false);
            toast.error(`Service Not Created Please Try Again`, {
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
      toast.error("Something wrong happened, try recreating the service", {
        position: "top-center",
        autoClose: 3000,
      });
    }
    progress(100);
  };

  // Page one submisson ------------
  const onSubmitFormOne = async () => {
    let slug = process();
    let SlugCount = await getslugcount(slug.toLowerCase(),draftCreated?.serviceID);
    setOpenLoading(true); // true on loader
    progress(0);
    if (
      data.sname.length > 1 &&
      ServiceDoc && paid &&
      (BannerImage || defaultbanner)
    ) {
      if(data?.ssp <= data?.smrp){
      try {
        var banner;
        //  means that the banner and the doc uploaded already is not saved earlier
        if (defaultbanner) {
          if (FinalDefaultBannerFormData instanceof FormData) {
            banner = await Uploadfile(FinalDefaultBannerFormData);
          } else {
            toast.info(`Save the default banner design from the Edit Option`, {
              position: "top-center",
              autoClose: 2500,
            });
            setOpenLoading(false);
            return null;
          }
        } else {
          banner = await Uploadfile(data1); /// uplaoding banner and files on s3
        }
        var doc = await UploadDocuments(data2);
        if (banner?.success && doc?.success) {
          progress(75);
          let json = await addBasicService(
            draftCreated?.serviceID,
            data.sname,
            data.sdesc,
            Content,
            Tags,
            CreateType === "excel" ? 1 : CreateType === "video" ? 2 : 0, // type for pdf is 0 and excel is 1 and video is 2
            paid === "Free" ? false : true,
            paid === "Free" ? 0 : data.smrp,
            paid === "Free" ? 0 : data.ssp,
            allowDownload,
            noOfPage,
            banner?.url,
            doc?.result?.Location,
            SlugCount === 0
              ? slug.toLowerCase()
              : slug.toLowerCase().concat("--", `${SlugCount}`),
          );
          if (json?.success) {
            setCurrentPage(currentPage + 1);
            setDraftCreated({ status: true, serviceID: json?.serviceID }); // to know that document is already created
            setOpenLoading(false);
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
    }
    else{
      setOpenLoading(false);
        toast.error(`Pricing is invalid`, {
          position: "top-center",
          autoClose: 2000,
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
              <h1 className="create_text_01">Share your expertise!</h1>
              <p className="create_text_02">
                {CreateType === "pdf"
                  ? "Guides, summaries, tips & more"
                  : CreateType === "excel"
                  ? "Finances, Jobs, Tips & more!"
                  : CreateType === "video"
                  ? "Webinars, workshops, Q&A!"
                  : ""}
              </p>
            </div>
          </section>

          {/* First Section ------------- */}
          {currentPage === 1 && (
            <FirstPage
              data={data}
              setdata={setdata}
              handleChange={handleChange}
              setDefaultBanner={setDefaultBanner}
              BannerImage={BannerImage}
              defaultbanner={defaultbanner}
              EditOptionDefaultBanner={EditOptionDefaultBanner}
              setImagePreview={setImagePreview}
              CreateType={CreateType}
              setServiceDoc={setServiceDoc}
              setBannerImage={setBannerImage}
              handleChangeFileBanner={handleChangeFileBanner}
              paid={paid}
              setpaid={setpaid}
              onSubmit={onSubmitFormOne}
            />
          )}

          {/* Second Page ---- */}
          {currentPage === 2 && (
            <SecondPage
              Content={Content}
              setContent={setContent}
              setNoOfPages={setNoOfPages}
              noOfPage={noOfPage}
              setAllowDownload={setAllowDownload}
              allowDownload={allowDownload}
              CreateType={CreateType}
              onSubmit={onSubmitSecondForm}
              setCurrentPage={setCurrentPage}
            />
          )}
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
