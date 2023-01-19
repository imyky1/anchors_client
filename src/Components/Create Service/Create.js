import React, { useState, useContext, useEffect, useRef } from "react";
import "./Create.css";
import ServiceContext from "../../Context/services/serviceContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Editor from "../Editor/Editor";
import { LoadTwo } from "../Modals/Loading";
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
import EventCreated from "../Modals/eventcreated";
import ServiceCreated from "../Modals/servicecreated";

// editor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Cover from "../Modals/ImagePreview/Cover";
import getCroppedImg, { generateDownload } from "../helper/imageresize";

// Theme for MUI --------------------------------------------------------------------
export const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "red",
          "&$error": {
            color: "#db3131",
          },
        },
      },
    },
  },
});

function Create(props) {
  const context = useContext(ServiceContext);
  const navigate = useNavigate();
  const {
    slugCount,
    getslugcount,
    addservice,
    UploadDocuments,
    Uploadfile,
    UploadBanners,
    checkCpyUrl,
  } = context;
  const [openLoading, setOpenLoading] = useState(false);
  const [previewSourceOne, setPreviewSourceOne] = useState(""); // saves the data of file selected in the form
  const [previewSourceTwo, setPreviewSourceTwo] = useState(""); // saves the data of file selected in the form
  const [checkFormData, setCheckFormData] = useState(false); // checking if all the data is present or not in the form
  const [copyURL, setCopyURL] = useState(""); // saves the data of file selected in the form
  const [paid, setPaid] = useState("free"); // tracks if the service is free or paid so that allow participants has limited options
  const [Content, setContent] = useState("");
  const [data, setdata] = useState({
    sname: "",
    sdesc: "",
    slug: "",
    smrp: 0,
    ssp: 0,
  });

  const [servData, setservData] = useState([]);

  //Image preview and resize opening model
  const [openimagePreview, setImagePreview] = useState(false);

  // genrating copy url string
  const generateCopyURL = async () => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < 2; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    checkCpyUrl(result).then((check) => {
      if (check) {
        setCopyURL(result);
      } else {
        generateCopyURL();
      }
    });
  };

  /// TAGS section ------------------------------------------------------------------------
  const [tags, setTags] = useState(["Download"]);

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (value.includes(",")) {
      let arrcomma = value.split(",");
      setTags([...tags, ...arrcomma]);
      e.target.value = "";
      return;
    }
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
  };
  const removeTag = (index) => {
    setTags(tags.filter((e, i) => i !== index));
  };

  const [imagetocrop, setImageToCrop] = useState(null);

  // use effect to genrate slug and copy url-----------------------------------------------------------------
  useEffect(() => {
    generateCopyURL();
    let slug = data.sname.split(" ").join("-");
    setdata({ ...data, slug: slug });
    getslugcount(slug.toLowerCase());

    // eslint-disable-next-line
  }, [data.sname]);

  // uploading file using file input --------------------------------------------------------------------------
  const handleChangeFileOne = (e) => {
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
      setPreviewSourceOne(file);
    }
  };
  const handleChangeFileTwo = (e) => {
    const file = e.target.files[0];
    setPreviewSourceTwo(file);
  };
  const data1 = new FormData();
  const data2 = new FormData();
  data1.append("file", previewSourceOne);
  data2.append("file", previewSourceTwo);

  // Changing free and paid section layout ---------------------------------------------

  const handleOptionChange = (e) => {
    //  balancing the changing effect of free and paid option

    setPaid(e.target.value);
  };

  // Auto resize of textarea    -------------------------------------------

  ///const textarea2 = document.querySelector("#sdesc");
  ///textarea2?.addEventListener("input", autoResize, false);
  ///
  ///function autoResize() {
  ///  this.style.height = "auto";
  ///  this.style.height = this.scrollHeight + "px";
  ///}

  // Submit of form create the service ------------------------------------------------------------
  const onSubmit = async () => {
    setOpenLoading(true); // true on loader
    setCheckFormData(true); /// checking error in mui
    props.progress(0);
    if (data.sname.length > 3 && previewSourceOne && previewSourceTwo) {
      if (Content.length > 10) {
        setCheckFormData(false);
        try {
          var banner = await Uploadfile(data1); /// uplaoding banner and files on s3
          var doc = await UploadDocuments(data2);
          tags.shift();
          if (banner.success && doc.success) {
            props.progress(75);
            const json = await addservice(
              data.sname,
              data.sdesc,
              Content,
              slugCount === 0
                ? data.slug.toLowerCase()
                : data.slug.toLowerCase().concat("--", `${slugCount + 1}`),
              copyURL,
              banner?.url,
              doc?.result?.Location,
              tags,
              0,
              paid === "free" ? false : true,
              paid === "free" ? 0 : data.smrp,
              paid === "free" ? 0 : data.ssp
            );
            if (json.success) {
              setservData(json.res);
              setOpenLoading(false);
              props.setShowPopup(true);
            } else {
              setOpenLoading(false);
              toast.error(`Service Not Added Please Try Again`, {
                position: "top-center",
                autoClose: 2000,
              });
            }
          } else {
            setOpenLoading(false);
            toast.error(`Image or files is not uploaded Please Try Again`, {
              position: "top-center",
              autoClose: 2000,
            });
          }
        } catch (error) {
          setOpenLoading(false);
          toast.error(`Server side error please try after some time`, {
            position: "top-center",
            autoClose: 2000,
          });
        }
      } else {
        setOpenLoading(false);
        toast.info("Detailed description must contain atleast 11 characters", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } else {
      setOpenLoading(false);
      toast.info("Fill all the required inputs", {
        position: "top-center",
        autoClose: 3000,
      });
    }

    props.progress(100);
  };

  // Change in values of input tags ---------------------------------------------------------------------
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

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
      previewSourceOne?.name
    );
    setPreviewSourceOne(img);
    setImagePreview(false);
  };

  return (
    <>
      <ServiceCreated
        open={props.showpopup}
        onClose={() => {
          props.setShowPopup(false);
          navigate("/servicelist");
        }}
        Workshop={data}
        slug={copyURL}
        content={Content}
        progress={props.progress}
      />

      <ThemeProvider theme={theme}>
        {openLoading && <LoadTwo open={openLoading} />}
        <div className="create_box">
          <form className="workshop_form_create">
            <div className="left_side_form_create">
              <TextField
                label="Service Name"
                required
                variant="outlined"
                name="sname"
                id="sname"
                onChange={handleChange}
                value={data.sname}
                placeholder="25JS Interview Important Question..."
                error={checkFormData && data?.sname?.length <= 3}
                helperText={
                  checkFormData &&
                  data?.sname?.length <= 3 &&
                  "Service name must contain atleast 4 characters"
                }
              />
              <TextField
                multiline
                label="Brief Service Description"
                variant="outlined"
                name="sdesc"
                onChange={handleChange}
                value={data.sdesc}
                id="sdesc"
                placeholder="Very brief description of the service..."
              />
              <TextField
                name="sbanner"
                id="sbanner"
                required
                //label={!previewSourceOne?.name && "Banner Image"}
                placeholder="Upload Image (Aspect ratio- 3:1)"
                onFocus={(e) => {
                  e.target.type = "file";
                }}
                onChange={handleChangeFileOne}
                error={checkFormData && !previewSourceOne?.name}
                helperText={
                  checkFormData &&
                  !previewSourceOne?.name &&
                  "Banner Image is required"
                }
              />
              {/* {previewSourceOne ? (
                <>
                  {" "}
                  <Button
                    variant="outlined"
                    onClick={(prev) => setImagePreview(true)}
                  >
                    Preview Image and Resize
                  </Button>
                  <br />
                </>
              ) : (
                ""
              )} */}

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

              {paid !== "free" && (
                <TextField
                  type="text"
                  label="Tags"
                  onKeyDown={handleKeyDown}
                  name="stags"
                  id="stags"
                  placeholder="Type tags..."
                  //helperText="Write a tag and press Enter"
                />
              )}
              <div className="tag-container_workshop">
                {tags?.map((tag, index) => {
                  return (
                    <div
                      className={index === 0 ? "tag lightag" : "tag"}
                      key={index}
                    >
                      <span>{tag}</span>
                      <i
                        class="fa-solid fa-circle-xmark"
                        onClick={() => (index === 0 ? "" : removeTag(index))}
                      ></i>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="right_side_form_create">
              <TextField
                className="mui_select"
                select
                label="Service Type"
                defaultValue="free"
                id="stype"
                onChange={(e) => handleOptionChange(e)}
              >
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </TextField>

              {paid !== "free" && (
                <>
                  <TextField
                    label="Set MRP (in INR)"
                    required
                    variant="outlined"
                    name="smrp"
                    id="smrp"
                    placeholder="Eg. 299"
                    onChange={handleChange}
                    value={data.smrp}
                    type="number"
                    error={
                      checkFormData &&
                      (data.smrp === 0 || data.smrp === "0" || !data.smrp)
                    }
                    helperText={
                      checkFormData &&
                      (data.smrp === 0 || data.smrp === "0" || !data.smrp) &&
                      "Paid service need to have some amount"
                    }
                  />
                  <TextField
                    label="Selling Price"
                    required
                    variant="outlined"
                    type="number"
                    name="ssp"
                    id="ssp"
                    placeholder="Eg. 199"
                    onChange={handleChange}
                    value={data.ssp}
                    max={data.smrp}
                    error={checkFormData && (!data.ssp || data.ssp > data.smrp)}
                    helperText={
                      checkFormData &&
                      (!data.ssp || data.ssp > data.smrp) &&
                      "Selling price cannot be empty or greater than MRP (it can be 0)"
                    }
                  />
                </>
              )}
              <TextField
                required
                name="sdoc"
                id="sdoc"
                //label="Document ( supports all formats)"
                placeholder="Upload document"
                onFocus={(e) => {
                  e.target.type = "file";
                }}
                onChange={handleChangeFileTwo}
                error={checkFormData && !previewSourceTwo?.name}
                helperText={
                  checkFormData &&
                  !previewSourceTwo?.name &&
                  "Document is required"
                }
              />

              {paid === "free" && (
                <TextField
                  type="text"
                  label="Tags"
                  onKeyDown={handleKeyDown}
                  name="stags"
                  id="stags"
                  placeholder="Type tags..."
                  //helperText="Write a tag and press Enter"
                />
              )}
            </div>
          </form>
          {/* {openimagePreview && previewSourceOne ? (
            <div className="imagepreviewbox">
              {" "}
              <Cover
                cover={URL.createObjectURL(previewSourceOne)}
                setImage={setPreviewSourceOne}
                close={setImagePreview}
              />
            </div>
          ) : (
            ""
          )} */}

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

          <label
            htmlFor="ldesc"
            className="editor_entry_labels"
            id="resizeimage"
          >
            Detailed Service Description <small>*</small>
          </label>
          <CKEditor
            editor={ClassicEditor}
            data={Content}
            config={{
              placeholder: "Please Describe Your Service Briefly...",
              toolbar: [
                "|",
                "bold",
                "italic",
                "blockQuote",
                "link",
                "numberedList",
                "bulletedList",
                "imageUpload",
                "|",
                "undo",
                "redo",
              ],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
          <div className="create_buttons">
            <button className="submit_button" onClick={onSubmit}>
              Submit and Publish
            </button>
          </div>
          <ToastContainer />
        </div>
      </ThemeProvider>
    </>
  );
}

export default Create;
