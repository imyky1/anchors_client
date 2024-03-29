import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Create.css";
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
import {
  NewCongratsServiceModal,
  StaticSampleDataModal,
} from "../../../Modals/ServiceSuccess/Modal";
import { LoadFour, LoadTwo } from "../../../Modals/Loading";

// imports for image cropping
import getCroppedImg from "../../../helper/imageresize";
import { Modal, Slider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Cropper from "react-easy-crop";
import { SuperSEO } from "react-super-seo";
import mixpanel from "mixpanel-browser";
import CreateServiceDemo from "./CreateServiceDemo";
import {
  AiFillEye,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { BsArrowLeftShort } from "react-icons/bs";
import { SiOpenai } from "react-icons/si";
import GptModal from "../../../Modals/GptModal";

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
  setdata,
}) => {
  const [openSampleContent, setOpenSampleContent] = useState(false);

  return (
    <>
      {openSampleContent && (
        <StaticSampleDataModal
          type="pdfTitle"
          onClose={() => {
            setOpenSampleContent(false);
          }}
        />
      )}

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
            label="Title of Service"
            name="sname"
            id="sname"
            required={true}
            value={data?.sname}
            placeholder="Keep it catchy"
            onChange={handleChange}
            labelHelperText={{
              text: (
                <>
                  (Sample) <AiFillEye size={16} />{" "}
                </>
              ),
              action: () => {
                setOpenSampleContent(true);
              },
            }}
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
                info={
                  defaultbanner
                    ? "you have to edit banner again if you change your title"
                    : null
                }
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
  sname
}) => {
  const [openSampleContent, setOpenSampleContent] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [useAI, setuseAI] = useState(true)

  const {generateAiDescription} = useContext(ServiceContext)

  const handleAIGeneration  = async () =>{
    
    if(!sname){
      toast.error("Enter the service title",{
        position:'top-center',
        autoClose:1500
      })
      return 0;
    }

    setOpenLoading(true)
    
    let data = await generateAiDescription(sname)

    if(data?.success){
      setuseAI(false)
      setOpenLoading(false)
      setContent(data?.desc)
    } 

    else{
      setOpenLoading(false)
      toast.info("AI genration functionilty is facing some error, Try again later!!!",{
        position:"top-center",
        autoClose:2000
      })
    }
  }

  return (
    <>
      {openSampleContent && (
        <StaticSampleDataModal
          type="pdfDescription"
          onClose={() => {
            setOpenSampleContent(false);
          }}
        />
      )}

      {openLoading && <LoadFour/>}

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
            info={
              <>
                <SiOpenai size={16} color={useAI ? "#FF5C5C" : "grey"} />
                Click on to Generate description with AI
              </>
            }
            infoStyle={{ color: useAI ? "#FF5C5C" : "grey", cursor: "pointer" }}
            infoClick={() => {
              useAI ? handleAIGeneration() : console.log("AI Cannot be used")
            }}
            labelHelperText={{
              text: (
                <>
                  (Sample) <AiFillEye size={16} />{" "}
                </>
              ),
              action: () => {
                setOpenSampleContent(true);
              },
            }}
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
          text={window.screen.width > 600 ? "Publish" : "Save and Next"}
          icon={<AiOutlineArrowRight />}
          onClick={onSubmit}
        />
        {window.screen.width > 600 && (
          <Button3
            text="Previous"
            icon={<AiOutlineArrowLeft />}
            onClick={() => {
              setCurrentPage(1);
            }}
          />
        )}
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
  MobileFinalDefaultBannerFormData,
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
    slug: "",
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
    UploadBanners,
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

    // warnings and the alerts -----------------
    if (Content?.length < 10 || !Content) {
      toast.info("Add a description for your digital product.", {
        position: "top-center",
        autoClose: 1500,
      });
    } else if (!noOfPage) {
      toast.info("Specify the number of pages in your digital product.", {
        position: "top-center",
        autoClose: 1500,
      });
    } else if (draftCreated?.serviceID) {
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
              slug: json?.service?.slug,
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
    let SlugCount = await getslugcount(
      slug.toLowerCase(),
      draftCreated?.serviceID
    );
    setOpenLoading(true); // true on loader
    progress(0);

    // warnings and the alerts -----------------
    if (data.sname.length < 1) {
      toast.info("Provide a title to list a digital product.", {
        position: "top-center",
        autoClose: 1500,
      });
    } else if (!ServiceDoc) {
      toast.info("Upload a document for your digital product.", {
        position: "top-center",
        autoClose: 1500,
      });
    } else if (!(BannerImage || defaultbanner)) {
      toast.info(
        "Upload a banner or select default banner for your digital product.",
        {
          position: "top-center",
          autoClose: 2500,
        }
      );
    } else if (
      data.sname.length > 1 &&
      ServiceDoc &&
      paid &&
      (BannerImage || defaultbanner)
    ) {
      if ((data?.ssp <= data?.smrp && data?.smrp > 0) || paid === "Free") {
        try {
          var banner = null;
          var mobBanner = null;
          //  means that the banner and the doc uploaded already is not saved earlier
          if (defaultbanner) {
            if (FinalDefaultBannerFormData instanceof FormData) {
              banner = await UploadBanners(FinalDefaultBannerFormData);
              mobBanner = await UploadBanners(MobileFinalDefaultBannerFormData);
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
            banner = await UploadBanners(data1); /// uplaoding banner and files on s3
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
              banner?.result?.Location,
              mobBanner?.result?.Location,
              doc?.result?.Location,
              SlugCount === 0
                ? slug.toLowerCase()
                : slug.toLowerCase().concat("--", `${SlugCount}`)
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
      } else {
        setOpenLoading(false);
        toast.error(`Pricing is invalid`, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      toast.info("Something wrong happened, try recreating the service", {
        position: "top-center",
      });
    }

    setOpenLoading(false);
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
        <NewCongratsServiceModal
          type="service"
          link={showPopup?.link}
          slug={showPopup?.slug}
        />
      )}

      <div className="create_service_outside_wrapper">
        {/* MObile ui navbar ---------------- */}
        {window.screen.width < 600 && (
          <section className="navbar_ui_covering_section_mobile_active">
            <BsArrowLeftShort
              size={22}
              onClick={() => {
                if (currentPage === 1) {
                  navigate(-1);
                } else {
                  setCurrentPage(currentPage - 1);
                }
              }}
            />
            Share your expertise!
          </section>
        )}

        <div className="main_create_container_new_conatiner_live_demo">
          {/* Heading of the create section ------------------------ */}

          {window.screen.width > 600 && (
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
          )}

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
              sname={data?.sname}
            />
          )}
        </div>

        {/* Live preview Section ------------- */}
        {window.screen.width > 600 && (
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
        )}
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
