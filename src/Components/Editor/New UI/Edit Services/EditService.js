import React, { useState, useRef, useContext, useEffect } from "react";
import Cropper from "react-easy-crop";
import { useNavigate, useParams } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import { LoadTwo } from "../../../Modals/Loading";
import Canvas from "../Create Services/Canvas";
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
import SuccessService from "../../../Modals/ServiceSuccess/Modal";
import getCroppedImg, { generateDownload } from "../../../helper/imageresize";
import "./EditService.css";
import { Button1 } from "../Create Services/InputComponents/buttons";
import ServiceContext from "../../../../Context/services/serviceContext";
import { toast } from "react-toastify";

function EditService({progress,openDefaultBanner,setDefaultBannerData,cname,FinalDefaultBannerFormData}) {
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
  const [allowPreview, setAllowPreview] = useState(false);
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
   const EditOptionDefaultBanner = () =>{
    setDefaultBannerData({sname:data?.sname,cname:cname,type:servicetype})
    openDefaultBanner()
  }

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
            if(FinalDefaultBannerFormData instanceof FormData){
              banner = await Uploadfile(FinalDefaultBannerFormData)
            }
            else{
              toast.info(`Save the default banner design from the Edit Option`, {
                position: "top-center",
                autoClose: 2500,
              });
              setOpenLoading(false)
              return null;
            }
          } else {
            banner = await Uploadfile(data1); /// uplaoding banner and files on s3
          }
        } else {
          banner = { url: serviceInfo?.simg };
        }
        if (ServiceDoc) {
          /// to check if the creator want soto to change the document or not
          var docs = await UploadDocuments(data2);
        } else {
          docs = { result: { Location: serviceInfo?.surl } };
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
          allowPreview,
          noOfPage
        };
        updateService(serviceInfo?._id, newData).then((e) => {
          if (e?.success) {
            toast.success("Service Edited Succesfully", {
              position: "top-center",
              autoClose: 1500,
            });
            setTimeout(() => {
              navigate("/mycontents");
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
      compareJWT(e[0]).then((e2) => {
        // setcheck(e2);
        setOpenLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    setdata({
      sname: serviceInfo?.sname,
      sdesc: serviceInfo?.sdesc,
      smrp: serviceInfo?.smrp,
      ssp: serviceInfo?.ssp,
    });
    setTags(serviceInfo?.tags);
    setContent(serviceInfo?.ldesc);
    setNoOfPages(serviceInfo?.noOfPages)

    if(serviceInfo?.allowPreview){
        setAllowPreview(serviceInfo?.allowPreview)
    }
    if (serviceInfo?.isPaid) {
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
          <h1 className="create_text_01">
            Edit{" "}
            {servicetype === "pdf"
              ? "PDF"
              : servicetype === "excel"
              ? "Excel sheet"
              : servicetype === "video"
              ? "Video"
              : ""}
          </h1>
          <p className="create_text_02">
            {servicetype === "pdf"
              ? "Express yourself and share concepts, tricks and tips and many more things via any document format."
              : servicetype === "excel"
              ? "From curated lists to opportunity lists, you can upload whatever you want via simple (or complex) Excel sheets"
              : servicetype === "video"
              ? "Add a personal touch with Interview Q&A's, How-to Tutorials, Lectures etc. to engage your audience"
              : ""}
          </p>
        </section>

        {/* form section of create container ---------------------------------------- */}
        <section className="create_form_box">
          {/* left side---------------------------------------------------------------------------- */}
          <div className="left_section_form">
            <TextField1
              label="Service Title"
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
              disabled = {defaultbanner}
              onChangeFunction={handleChangeFileBanner}
              defaultRadioLabel = "Use Default Image"
              defaultRadioOnChange={(e) => {
                e.target.checked
                  ? setDefaultBanner(true)
                  : setDefaultBanner(false)
              }}
            />
            <span className="preview_edit_service" onClick={()=>{window.open(serviceInfo?.simg)}} >
              Preview Banner
            </span>

            {(BannerImage || defaultbanner) ? (
              <>
                {" "}
                <Button
                  variant="outlined"
                  onClick={()=>{defaultbanner ? EditOptionDefaultBanner() : setImagePreview((prev) => !prev)}}
                  className="imageresizeopenerbutton"
                >
                  {defaultbanner ? "Edit default Banner" : "Preview Image and Resize"}
                </Button>
                <br />
              </>
            ) : (
              ""
            )}
            
            <Editor1
              label="Describe about Service"
              placeholder="Please describe about your service briefly"
              info="This will help audience to download"
              Content={Content}
              required={true}
              setContent={(e) => setContent(e)}
            />
          </div>

          {/* right side----------------- ---------------------------------------------------------------------------*/}
          <div className="right_section_form">
            <Dropdown1
              label="Service Type "
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
              label="Upload Document"
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
            <span className="preview_edit_service" onClick={()=>{window.open(serviceInfo?.stype === 1 ? "/viewExcel" : "/viewPdf"); sessionStorage.setItem("link", serviceInfo?.surl);}}>
              {`Preview ${servicetype === "excel" ? "Excel Sheet" : "Document"}`}
            </span>

            <Tags1
              label="Enter Tags"
              placeholder="Press enter to add tags"
              info="This will help in recommendation"
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
              Advanced customize &nbsp;<i className="fa-solid fa-plus "></i>
            </span>
          </section>
        )}

        {advanced && (
          <section className="advanced_custom_mode_create">
            <span className="create_text_03">Advanced customize</span>
            <section>
              {/* left section -------------------------- */}
              <div className="left_section_form">
                <Editor1
                  name="sdesc"
                  label="Describe about Service"
                  placeholder="Guidelines to use it"
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

                {/* <RadioField1
                  label={
                    servicetype === "video" ? "Allow Download" : "Allow Preview"
                  }
                  onChange={setAllowPreview}
                  value={allowPreview}
                  id="asdas"
                /> */}
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

export default EditService;
