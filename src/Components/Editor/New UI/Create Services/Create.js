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
} from "./InputComponents/fields_Labels";
import ServiceContext from "../../../../Context/services/serviceContext";
import { toast } from "react-toastify";
import SuccessService from "../../../Modals/ServiceSuccess/Modal";
import { LoadTwo } from "../../../Modals/Loading";

// imports for image cropping
import getCroppedImg, { generateDownload } from "../../../helper/imageresize";
import {
  Button,
  Modal,
  Slider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Cropper from "react-easy-crop";
import { SuperSEO } from "react-super-seo";
import Canvas from "./Canvas";
import { creatorContext } from "../../../../Context/CreatorState";

function Create(props) {
  const navigate = useNavigate();

  // for checking the type of service we need to create --------------------------------------
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const paramsType = query.get("type");
  const [CreateType, setCreateType] = useState(); // decides the type of document choosed in query
  const [showPopup, setshowPopup] = useState(false); // success popup

  const [paid, setpaid] = useState(); // decides the form acc to paid or free service type
  const [advanced, setAdvanced] = useState(false); // sets the advanced customize settings
  const [openLoading, setOpenLoading] = useState(false); // controlls the loader

  // state for image cropping
  const [imagetocrop, setImageToCrop] = useState(null);
  const [openimagePreview, setImagePreview] = useState(false);

  // getting creator info
  const { getAllCreatorInfo, basicNav, allCreatorInfo } =
    useContext(creatorContext);
  useEffect(() => {
    getAllCreatorInfo();
    // eslint-disable-next-line
  }, []);
  // default banner
  const [defaultbanner, setDefaultBanner] = useState(false);
  // const [defaultBannerPreview, setDefaultBannerPreview] = useState(false);
  const [defaultBannerUrl, setURLBANNER] = useState(null);

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
    CopyURL: "",
  });
  const [Tags, setTags] = useState([]);
  const [Content, setContent] = useState();
  const [BannerImage, setBannerImage] = useState();

  // allow preview variables
  const [allowPreview, setAllowPreview] = useState(false);
  const [noOfPage, setNoOfPages] = useState(0);
  const [ServiceDoc, setServiceDoc] = useState();
  const [showdefaultselect, setShowDefaultSelect] = useState(true);
  const DefaultCanvas = useRef(null);

  const handleChangeFileBanner = (e) => {
    if (defaultbanner) {
      setDefaultBanner(false);
    }
    setShowDefaultSelect(false);

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
    sessionStorage.removeItem("canvas");
  }, [paramsType]);

  // genrating copy url string -----------------------------------------------
  const generateCopyURL = async () => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < 2; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    checkCpyUrl(result).then((check) => {
      if (check) {
        setdata({ ...data, CopyURL: result });
      } else {
        generateCopyURL();
      }
    });
  };
  function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], { type: mimeString });
  }
  const [textToShow, setTextToShow] = useState("");

  // Image cropping
  // IMAGE RESIZE
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });
  const imageref = useRef(null);

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
      BannerImage?.name
    );
    setBannerImage(img);
    setImagePreview(false);
  };

  // changes handling in input field ---------------------------------
  const handleChange = (e) => {
    if (e.target.name === "sname") {
      setTextToShow(e.target.value);
    }
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  // responsible for generating slug and copyURL
  const process = () => {
    //generateCopyURL();
    let slug = data.sname.split(" ").join("-"); // creates the slug from the name
    //getslugcount(slug.toLowerCase());  // checks if similar slug already exists -----
    return slug;
  };
  const [generateBanner, setGenerateBanner] = useState(false);

  useEffect(() => {
    generateCopyURL();
  }, [data.sname]);

  // form submission ----------------------------------------------------------
  const onSubmit = async () => {
    let slug = process();
    let SlugCount = await getslugcount(slug.toLowerCase());
    setOpenLoading(true); // true on loader
    props.progress(0);
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
            setGenerateBanner(true);

            setTimeout(async () => {
              let canvasImage = sessionStorage.getItem("canvas");
              console.log(canvasImage);
              // this can be used to download any image from webpage to local disk
              let xhr = new XMLHttpRequest();
              xhr.responseType = "blob";
              xhr.onload = function () {
                let a = document.createElement("a");
                a.href = window.URL.createObjectURL(xhr.response);
                a.download = "image_name.png";
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                a.remove();
              };
              xhr.open("GET", canvasImage); // This is to download the canvas Image
              xhr.send();
              const data3 = new FormData();

              var blob = dataURItoBlob(canvasImage);
              data3.append("file", blob, `${Date.now()}.png`);
              console.log(data3);
              banner = await Uploadfile(data3);
              var doc = await UploadDocuments(data2);
              let json;

              if (banner.success && doc.success) {
                props.progress(75);
                json = await addservice(
                  data.sname,
                  data.sdesc,
                  Content,
                  SlugCount === 0
                    ? slug.toLowerCase()
                    : slug.toLowerCase().concat("--", `${SlugCount}`),
                  data.CopyURL,
                  banner?.url,
                  doc?.result?.Location,
                  Tags,
                  CreateType === "excel" ? 1 : CreateType === "video" ? 2 : 0, // type for pdf is 0 and excel is 1 and video is 2
                  paid === "Free" ? false : true,
                  paid === "Free" ? 0 : data.smrp,
                  paid === "Free" ? 0 : data.ssp,
                  allowPreview,
                  allowPreview ? noOfPage : 0
                );
                if (json.success) {
                  //setservData(json.res);
                  setOpenLoading(false);
                  setshowPopup(true);
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
            }, 1000);
          } else {
            banner = await Uploadfile(data1); /// uplaoding banner and files on s3
            var doc = await UploadDocuments(data2);
            let json;

            if (banner.success && doc.success) {
              props.progress(75);
              json = await addservice(
                data.sname,
                data.sdesc,
                Content,
                SlugCount === 0
                  ? slug.toLowerCase()
                  : slug.toLowerCase().concat("--", `${SlugCount}`),
                data.CopyURL,
                banner?.url,
                doc?.result?.Location,
                Tags,
                CreateType === "excel" ? 1 : CreateType === "video" ? 2 : 0, // type for pdf is 0 and excel is 1 and video is 2
                paid === "Free" ? false : true,
                paid === "Free" ? 0 : data.smrp,
                paid === "Free" ? 0 : data.ssp,
                allowPreview,
                allowPreview ? noOfPage : 0
              );
              if (json.success) {
                //setservData(json.res);
                setOpenLoading(false);
                setshowPopup(true);
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

    props.progress(100);
  };

  // check is the query parameter is changed----------------------------------------
  if (!["pdf", "excel", "video"].includes(CreateType)) {
    return navigate("/dashboard");
  }

  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}

      {showPopup && <SuccessService type={CreateType} link={data.CopyURL} />}
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
              : ""}{" "} about?
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
            <UploadField1
              label="Upload Banner Image"
              id="asdas"
              info="File Size Limit 15 MB Formats - jpg,png"
              FileType=".jpg,.png,.jpeg"
              required={true}
              onChange={setBannerImage}
              onChangeFunction={handleChangeFileBanner}
            />
            {BannerImage ? (
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
            {showdefaultselect ? (
              <div className="radiofiled_container_01 min-heightfield">
                <span className="label_type_02">Use Default Image </span>
                <label className="switch_type_01">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      e.target.checked
                        ? setDefaultBanner(true)
                        : setDefaultBanner(false)
                    }
                  />
                  <span className="slider_type_01 round_type_01"></span>
                </label>
                {/* {defaultbanner ? (
                <Button
                  variant="outlined"
                  onClick={setDefaultBannerPreview}
                  className="imageresizeopenerbutton"
                  style={{ marginLeft: "25px" }}
                >
                  Preview Default Banner
                </Button>
              ) : (
                ""
              )} */}
              </div>
            ) : (
              ""
            )}
            <Editor1
              label={`Describe your ${CreateType === "pdf"
              ? "Document"
              : CreateType === "excel"
              ? "Sheet"
              : CreateType === "video"
              ? "Video"
              : ""}`}
              placeholder={`Caption your ${CreateType === "pdf"
              ? "Document"
              : CreateType === "excel"
              ? "Sheet"
              : CreateType === "video"
              ? "Video"
              : ""}`}
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
              label={`Upload your ${CreateType === "pdf"
              ? "Document"
              : CreateType === "excel"
              ? "Sheet"
              : CreateType === "video"
              ? "Video"
              : ""}`}
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
            <section style={{ marginTop: "47px" }}></section>
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
              Advanced Customizations &nbsp;<i className="fa-solid fa-plus "></i>
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
                  label={`Describe your ${CreateType === "pdf"
                  ? "Document"
                  : CreateType === "excel"
                  ? "Sheet"
                  : CreateType === "video"
                  ? "Video"
                  : ""}`}
                  placeholder="Mention guidelines how your content can be useful for your audience"
                  Content={data.sdesc}
                  setContent={(e) => setdata({ ...data, sdesc: e })}
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
                <RadioField1
                  label={
                    CreateType === "video" ? "Allow Download" : "Allow Preview"
                  }
                  onChange={setAllowPreview}
                  id="asdas"
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
      <SuperSEO title="Anchors - Create Service" />
      {generateBanner ? (
        <Canvas
          textToShow={textToShow}
          width="1200"
          height="450"
          imgBackground={allCreatorInfo.profile}
          creator_name={basicNav.name}
          setURL={setURLBANNER}
        />
      ) : (
        ""
      )}
      {/* <Modal
        open={defaultBannerPreview}
        onClose={() => setDefaultBannerPreview(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="ultimatewrapper_defaultbanner">
          <div className="container_defaultbanner">
            <Canvas
              textToShow={data.sname}
              width="1200"
              height="450"
              imgBackground="https://www.anchors.in:5000/api/file/1670005634078--himanshu.bf15583cd698b88970c3.jpg"
              imgBack="../backgroundimg.png"
              creator_name="HIMANSHU SHEKHAR"
              setURL={setURLBANNER}
            />
          </div>
        </div>
      </Modal> */}
    </>
  );
}

export default Create;
