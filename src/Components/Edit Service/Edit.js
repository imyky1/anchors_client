import React, { useState, useEffect, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import ServiceContext from "../../Context/services/serviceContext";
import ReactEditor from "../Editor/Editor";
import { LoadOne, LoadTwo } from "../Modals/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { createTheme, MenuItem, TextField, ThemeProvider } from "@mui/material";

// editor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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

function Edit(props) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getserviceinfo, serviceInfo, UploadDocuments,UploadBanners,Uploadfile, updateService, compareJWT } =
    useContext(ServiceContext);
  const [openLoading, setOpenLoading] = useState(false);
  const [openLoadingOne, setOpenLoadingOne] = useState(false);
  const [check, setcheck] = useState(true);
  const [checkFormData, setCheckFormData] = useState(false); // checking if all the data is present or not in the form
  const [paid, setPaid] = useState(""); // tracks if the service is free or paid so that allow participants has limited options

  const [data, setdata] = useState({
    sname: "",
    sdesc: "",
    smrp: 0,
    ssp: 0,
  });
  const [tags, setTags] = useState([]);
  const [previewSourceOne, setPreviewSourceOne] = useState(""); // saves the data of file selected in the form
  const [previewSourceTwo, setPreviewSourceTwo] = useState(""); // saves the data of file selected in the form
  const [Content, setContent] = useState(
    "Please describe your service briefly.."
  );

  // useffect get details of the service from slug -------------------------------------------

  useEffect(() => {
    setOpenLoadingOne(true);
    getserviceinfo(slug).then((e) => {
      compareJWT(e[0]).then((e2) => {
        setcheck(e2);
        setOpenLoadingOne(false);
      });
    });
  }, []);

  useEffect(() => {
    setdata({
      sname: serviceInfo?.sname,
      sdesc: serviceInfo?.sdesc,
      smrp: serviceInfo?.smrp,
      ssp: serviceInfo?.ssp,
      isPaid: serviceInfo?.isPaid,
    });
    setTags(serviceInfo?.tags);
    setContent(serviceInfo?.ldesc);
    if (serviceInfo?.isPaid) {
      setPaid("paid");
    } else {
      setPaid("free");
    }
  }, [getserviceinfo]);

  // Managing Tags -----------------------------------------------------------------------------------

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
  };

  const removeTag = (index) => {
    setTags(tags.filter((e, i) => i !== index));
  };

  // Changing free and paid section layout ---------------------------------------------

  const handleOptionChange = (e) => {
    //  balancing the changing effect of free and paid option

    setPaid(e.target.value);
  };

  // Auto resize of textarea    ------------------------------------------------------------

  //const textarea2 = document.querySelector("#sdesc");
  //textarea2?.addEventListener("mouseover", autoResize, false);
  //
  //function autoResize() {
  //  this.style.height = "auto";
  //  this.style.height = this.scrollHeight + "px";
  //}

  // uploading file using file input -------------------------------------------

  const handleChangeFileOne = (e) => {
    const file = e.target.files[0];
    setPreviewSourceOne(file);
  };
  const handleChangeFileTwo = (e) => {
    const file = e.target.files[0];
    setPreviewSourceTwo(file);
  };

  const data1 = new FormData();
  const data2 = new FormData();
  data1.append("file", previewSourceOne);
  data2.append("file", previewSourceTwo);

  // Submitting the updated changes ------------------------------------------

  const handleSubmit = async (e) => {
    props.progress(0);
    setOpenLoading(true);
    setCheckFormData(true); /// checking error in mui
    e?.preventDefault();
    if (data.sname.length > 3 && data.sdesc.length > 5 && Content.length > 10) {
      setCheckFormData(false);
      try {
        if (previewSourceOne) {    // to check if the craero has uploaded banner image o upload 
          var banner = await Uploadfile(data1);
        }else {
          banner = { url: serviceInfo?.simg };
        }
        if(previewSourceTwo){  /// to check if the creator want soto to change the document or not
          var docs = await UploadDocuments(data2);
        }else{
          docs = {result:{Location : serviceInfo?.surl}}
        }
        const newData = {
          ...data,
          ldesc: Content,
          tags,
          simg: banner?.url,
          surl:docs?.result?.Location,
          isPaid: paid === "free" ? false : true,
          smrp: paid === "free" ? 0 : data.smrp,
          ssp: paid === "free" ? 0 : data.ssp,
        };
        updateService(serviceInfo?._id, newData).then((e) => {
          if (e) {
            toast.success("Service Edited Succesfully", {
              position: "top-center",
              autoClose: 1500,
            });
            setTimeout(() => {
              navigate("/servicelist");
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
    props.progress(100);
  };

 
  // Change in values of input tags ---------------------------------------------------------------------
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  if (!check) {
    navigate("/");
  }


  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}
      {openLoadingOne && <LoadOne open={openLoadingOne} />}

      <ThemeProvider theme={theme}>
        <div className="create_box">
          <h1>Edit Service - {serviceInfo?.sname}</h1>
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
                required
                label="Brief Service Description"
                variant="outlined"
                name="sdesc"
                onChange={handleChange}
                value={data.sdesc}
                id="sdesc"
                placeholder="Very brief description of the service..."
                error={checkFormData && data?.sdesc?.length <= 5}
                helperText={
                  checkFormData &&
                  data?.sdesc?.length <= 5 &&
                  "Description must contain atleast 6 characters"
                }
              />
              <TextField
                name="sbanner"
                id="sbanner"
                required
                //label={!previewSourceOne?.name && "Banner Image"}
                placeholder="Upload Image"
                onFocus={(e) => {
                  e.target.type = "file";
                }}
                onChange={handleChangeFileOne}
                //error={checkFormData && !previewSourceOne?.name }
                helperText={<a href={serviceInfo?.simg} target="_blank" rel="noreferrer">Click here to view previous banner</a>}
              />

              {paid !== "free" && (
                <TextField
                  type="text"
                  label="Tags (Write a tag and press Enter)"
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
                    <div className="tag" key={index}>
                      <span>{tag}</span>
                      <i
                        className="fa-solid fa-circle-xmark"
                        onClick={() => removeTag(index)}
                      ></i>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="right_side_form_create">
              {paid === "free" && 
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
                </TextField>} 

                {paid === "paid" && 
                <TextField
                  className="mui_select"
                  select
                  label="Service Type"
                  defaultValue="paid"
                  id="stype"
                  onChange={(e) => handleOptionChange(e)}
                >
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </TextField>}

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
                    value={parseInt(data.smrp)}
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
                    value={parseInt(data.ssp)}
                    max={parseInt(data.smrp)}
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
                //error={checkFormData && !previewSourceTwo?.name}
                helperText={<a href={serviceInfo?.surl} target="_blank" rel="noreferrer">Click here to view previous document</a>}
              />

              {paid === "free" && (
                <TextField
                  type="text"
                  label="Tags (Write a tag and press Enter)"
                  onKeyDown={handleKeyDown}
                  name="stags"
                  id="stags"
                  placeholder="Type tags..."
                  //helperText="Write a tag and press Enter"
                />
              )}
            </div>
          </form>

          <label htmlFor="ldesc" className="editor_entry_labels">
            Detailed Service Description <small>*</small>
          </label>
          <CKEditor
            editor={ClassicEditor}
            data={Content ? Content : ""}
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
            <button className="submit_button" onClick={handleSubmit}>
              Update the Changes
            </button>
          </div>
          <ToastContainer />
        </div>
      </ThemeProvider>
    </>
  );
}

export default Edit;
