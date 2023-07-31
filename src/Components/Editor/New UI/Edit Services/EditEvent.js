import React, { useState, useRef, useContext, useEffect } from "react";
import Cropper from "react-easy-crop";
import { useNavigate, useParams } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import { LoadTwo } from "../../../Modals/Loading";
import { Button, Modal, Slider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Dropdown1,
  Editor1,
  RadioField1,
  Tags1,
  TextField1,
  UploadField1,
  UploadField2,
} from "../Create Services/InputComponents/fields_Labels";
import getCroppedImg, { generateDownload } from "../../../helper/imageresize";
import "./EditService.css";
import { Button1 } from "../Create Services/InputComponents/buttons";
import ServiceContext from "../../../../Context/services/serviceContext";
import { toast } from "react-toastify";

function EditEvent({
  progress,
  openDefaultBanner,
  setDefaultBannerData,
  cname,
  FinalDefaultBannerFormData,
}) {
  const navigate = useNavigate();
  const { slug, servicetype } = useParams();

  // Contexts -----------------
  const {
    getserviceinfo,
    compareJWT,
    serviceInfo,
    UploadDocuments,
    Uploadfile,
    updateService,
  } = useContext(ServiceContext);

  //   States used in the page

  const [paid, setpaid] = useState(); // decides the form acc to paid or free service type
  const [advanced, setAdvanced] = useState(false); // sets the advanced customize settings
  const [openLoading, setOpenLoading] = useState(false); // controlls the loader

  const [data, setdata] = useState({
    sname: "",
    sdesc: "",
    smrp: 0,
    ssp: 0,
    CopyURL: "",
  });
  const [Tags, setTags] = useState([]);
  const [Content, setContent] = useState();
  const [BannerImage, setBannerImage] = useState();

  // state for image cropping
  const [imagetocrop, setImageToCrop] = useState(null);
  const [openimagePreview, setImagePreview] = useState(false);

  // allow preview variables
  const [allowDownload, setAllowDownload] = useState(false);
  const [noOfPage, setNoOfPages] = useState(0);
  const [ServiceDoc, setServiceDoc] = useState();

  // default banner
  const [defaultbanner, setDefaultBanner] = useState(false);

  // form data for uploads -----
  const data1 = new FormData();
  const data2 = new FormData();
  data1.append("file", BannerImage);
  data2.append("file", ServiceDoc);

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

  //   handles the image saving component
  const handleChangeFileBanner = (e) => {
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

  //Edit control of default banner button ------------
  const EditOptionDefaultBanner = () => {
    setDefaultBannerData({
      sname: data?.sname,
      cname: cname,
      type: servicetype,
    });
    openDefaultBanner();
  };

  // On submit func-----------------
  const onSubmit = async (e) => {
    progress(0);
    setOpenLoading(true);
    e?.preventDefault();
    if (data.sname.length > 3 && Content.length > 10) {
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
          banner = { url: serviceInfo?.service?.simg };
        }
        if (ServiceDoc) {
          /// to check if the creator want soto to change the document or not
          var docs = await UploadDocuments(data2);
        } else {
          docs = { result: { Location: serviceInfo?.service?.surl } };
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
          status: 1,
        };
        updateService(serviceInfo?.service?._id, newData).then((e) => {
          if (e?.success) {
            toast.success("Service Edited Succesfully", {
              position: "top-center",
              autoClose: 1500,
            });
            setTimeout(() => {
              navigate("/dashboard/mycontents");
            }, 1500);
          } else {
            toast.error("Some error occured", {
              position: "top-center",
              autoClose: 3000,
            });
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

  // useffect get details of the service from slug -------------------------------------------

  useEffect(() => {
    setOpenLoading(true);
    getserviceinfo(slug).then((e) => {
      compareJWT(e[0]?._id).then((e2) => {
        // setcheck(e2);
        setOpenLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    setdata({
      sname: serviceInfo?.service?.sname,
      sdesc: serviceInfo?.service?.sdesc,
      smrp: serviceInfo?.service?.smrp,
      ssp: serviceInfo?.service?.ssp,
    });
    setTags(serviceInfo?.service?.tags);
    setContent(serviceInfo?.service?.ldesc);
    setNoOfPages(serviceInfo?.service?.noOfPages);
    console.log(serviceInfo);

    if (serviceInfo?.service?.allowDownload) {
      setAllowDownload(serviceInfo?.service?.allowDownload);
    }
    if (serviceInfo?.service?.isPaid) {
      setpaid("Paid");
    } else {
      setpaid("Free");
    }
  }, [getserviceinfo]);

  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}

      {/* {showPopup && <SuccessService type={servicetype} link={data.CopyURL} />} */}
      <div className="main_create_container">
        {/* Heading of the create section ------------------------ */}
        <section className="heading_create_box">
          <div>
            <h1 className="create_text_01">What is your Event about?</h1>
            <p className="create_text_02">
              You can create events and workshops
            </p>
          </div>
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
              value={data?.sname}
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
                value={data?.smrp}
                onChange={handleChange}
              />
            )}
            <UploadField2
              label="Upload Banner Image"
              id="asdas"
              info="File Size Limit 15 MB Formats - jpg,png"
              FileType=".jpg,.png,.jpeg"
              required={true}
              onChange={setBannerImage}
              onChangeFunction={handleChangeFileBanner}
            />
            <span
              className="preview_edit_service"
              onClick={() => {
                window.open(serviceInfo?.service?.simg);
              }}
            >
              Preview Banner
            </span>

            {BannerImage || defaultbanner ? (
              <>
                {" "}
                <Button
                  variant="outlined"
                  onClick={() => {
                    defaultbanner
                      ? EditOptionDefaultBanner()
                      : setImagePreview((prev) => !prev);
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
            />

            <Editor1
              label={`Describe your ${
                servicetype === "pdf"
                  ? "Document"
                  : servicetype === "excel"
                  ? "Sheet"
                  : servicetype === "video"
                  ? "Video"
                  : ""
              }`}
              placeholder={`Caption your ${
                servicetype === "pdf"
                  ? "Document"
                  : servicetype === "excel"
                  ? "Sheet"
                  : servicetype === "video"
                  ? "Video"
                  : ""
              }`}
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
              defaultValue={paid}
            />
            {paid === "Paid" && (
              <TextField1
                label="Selling Price "
                placeholder="Min 99"
                name="ssp"
                id="ssp"
                type="number"
                required={true}
                value={data?.ssp}
                onChange={handleChange}
              />
            )}
            <UploadField1
              label={`Upload your ${
                servicetype === "pdf"
                  ? "Document"
                  : servicetype === "excel"
                  ? "Sheet"
                  : servicetype === "video"
                  ? "Video"
                  : ""
              }`}
              id="asd1515"
              required={true}
              onChange={setServiceDoc}
              info={
                servicetype === "pdf"
                  ? "File Size Limit 15 MB Formats - pdf"
                  : servicetype === "excel"
                  ? "File Size Limit 15 MB Formats -xls"
                  : servicetype === "video"
                  ? "File Size Limit 500 MB Formats -Avi,mp4"
                  : ""
              }
              FileType={
                servicetype === "pdf"
                  ? ".pdf"
                  : servicetype === "excel"
                  ? ".xls,.cvv"
                  : servicetype === "video"
                  ? ".mp4,.avi"
                  : ""
              }
            />
            <span
              className="preview_edit_service"
              onClick={() => {
                window.open(
                  serviceInfo?.service?.stype === 1 ? "/viewExcel" : "/viewPdf"
                );
                sessionStorage.setItem("link", serviceInfo?.service?.surl);
              }}
            >
              {`Preview ${
                servicetype === "excel" ? "Excel Sheet" : "Document"
              }`}
            </span>

            <Tags1
              label="Add Relevant Tags"
              placeholder="Press Enter to add tags"
              info="This will help in easy search and recommendation"
              tags={Tags}
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
              <div className="left_section_form">
                <Editor1
                  name="sdesc"
                  label={`Describe your ${
                    servicetype === "pdf"
                      ? "Document"
                      : servicetype === "excel"
                      ? "Sheet"
                      : servicetype === "video"
                      ? "Video"
                      : ""
                  }`}
                  placeholder="Mention guidelines how your content can be useful for your audience"
                  Content={data.sdesc}
                  setContent={(e) => setdata({ ...data, sdesc: e })}
                />
              </div>
              {/* right section -------------------------- */}
              <div className="right_section_form">
                <TextField1
                  label={
                    servicetype === "video"
                      ? "Time Duration"
                      : servicetype === "excel"
                      ? "Number of items"
                      : "Number of Pages"
                  }
                  type="number"
                  placeholder={
                    servicetype === "video"
                      ? "48 Mins"
                      : servicetype === "excel"
                      ? "21"
                      : ""
                  }
                  onChange={(e) => setNoOfPages(e.target.value)}
                  value={noOfPage}
                />

                {/* Allow preview section ------------------------------- */}
                <RadioField1
                  label="Allow Download"
                  onChange={setAllowDownload}
                  id="asdas"
                  value={allowDownload}
                />
              </div>
            </section>
          </section>
        )}

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
      <SuperSEO title="Anchors - Edit Service" />
    </>
  );
}

export default EditEvent;
