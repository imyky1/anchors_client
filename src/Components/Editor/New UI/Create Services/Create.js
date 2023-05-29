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


function Create({progress,openDefaultBanner,setDefaultBannerData,cname,FinalDefaultBannerFormData}) {
  const navigate = useNavigate();

  // for checking the type of service we need to create --------------------------------------
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const paramsType = query.get("type");
  const [CreateType, setCreateType] = useState(); // decides the type of document choosed in query
  const [showPopup, setshowPopup] = useState({open:false,link:""}); // success popup data

  const [paid, setpaid] = useState(); // decides the form acc to paid or free service type
  const [advanced, setAdvanced] = useState(false); // sets the advanced customize settings
  const [openLoading, setOpenLoading] = useState(false); // controlls the loader

  // state for image cropping
  const [imagetocrop, setImageToCrop] = useState(null);
  const [openimagePreview, setImagePreview] = useState(false);


  // default banner
  const [defaultbanner, setDefaultBanner] = useState(false);      // decides wheter to user checked the default banner-----

  // service Context --------------------------------------------------
  const {
    slugCount,
    getslugcount,
    addservice,
    UploadDocuments,
    Uploadfile,
    UploadBanners,
    checkCpyUrl,
  } = useContext(ServiceContext);
  const [data, setdata] = useState({
    sname: "",
    sdesc: "",
    smrp: 0,
    ssp: 0,
    guidelines: "",
  });

  const [Tags, setTags] = useState([]);
  const [Content, setContent] = useState();
  const [BannerImage, setBannerImage] = useState();

  // allow preview variables
  const [allowPreview, setAllowPreview] = useState(false);
  const [noOfPage, setNoOfPages] = useState(0);
  const [ServiceDoc, setServiceDoc] = useState(); 

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

  const data1 = new FormData();
  const data2 = new FormData();
  data1.append("file", BannerImage);
  data2.append("file", ServiceDoc);

  // check for the type of the service that needs to be created
  useEffect(() => {
    setCreateType(paramsType);
  }, [paramsType]);

  // genrating copy url string -----------------------------------------------
  // const generateCopyURL = async () => {
  //   var result = "";
  //   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  //   var charactersLength = characters.length;
  //   for (var i = 0; i < 2; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }
  //   checkCpyUrl(result).then((check) => {
  //     if (check) {
  //       setdata({ ...data, CopyURL: result });
  //     } else {
  //       generateCopyURL();
  //     }
  //   });
  // };


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
    let slug = data.sname.split(" ").join("-"); // creates the slug from the name
    //getslugcount(slug.toLowerCase());  // checks if similar slug already exists -----
    return slug;
  };
  

  // form submission ----------------------------------------------------------
  const onSubmit = async () => {
    let slug = process();
    let SlugCount = await getslugcount(slug.toLowerCase());
    setOpenLoading(true); // true on loader
    progress(0);
    if (
      data.sname.length > 3 &&
      ServiceDoc &&
      paid &&
      (BannerImage || defaultbanner)
    ) {
      if (Content?.length > 10) {
        try {
          var banner;
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
                allowPreview,
                noOfPage,
                data.guidelines
              );
              if (json?.success) {
                //setservData(json.res);
                setOpenLoading(false);
                setshowPopup({open:true,link:json?.shortLink});
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
  const EditOptionDefaultBanner = () =>{
    setDefaultBannerData({sname:data?.sname,cname:cname,type:CreateType})
    openDefaultBanner()
  }



  // check is the query parameter is changed----------------------------------------
  if (!["pdf", "excel", "video"].includes(CreateType)) {
    return navigate("/dashboard");
  }

  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}

      {showPopup?.open && <SuccessService type={CreateType} link={showPopup?.link} />}

      <div className="main_create_container">
        {/* Heading of the create section ------------------------ */}
        <section className="heading_create_box">
          <h1 className="create_text_01">
            What is your{" "}
            {CreateType === "pdf"
              ? "PDF"
              : CreateType === "excel"
              ? "Excel Sheet"
              : CreateType === "video"
              ? "Video"
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
        </section>

        {/* form section of create container ---------------------------------------- */}
        <section className="create_form_box">
          {/* left side---------------------------------------------------------------------------- */}
          <div className="left_section_form">
            <TextField1
              label="Title of Service"
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
                  setContent={(e) => setdata({ ...data, guidelines: e })}
                />
              </div>
              {/* right section -------------------------- */}
              <div className="right_section_form">
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
                />

                {/* Allow preview section ------------------------------- */}
                {/* <RadioField1
                  label={
                    CreateType === "video" ? "Allow Download" : "Allow Preview"
                  }
                  onChange={setAllowPreview}
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
                  <button onClick={savecroppedImage}>
                    Save
                  </button>
                  <button onClick={() => setImagePreview(false)}>
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

export default Create;
