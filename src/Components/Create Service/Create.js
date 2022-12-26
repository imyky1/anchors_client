import React, { useState, useContext, useEffect } from "react";
import "./Create.css";
import ServiceContext from "../../Context/services/serviceContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Editor from "../Editor/Editor";
import { LoadTwo } from "../Modals/Loading";
import PreviewService from "../Modals/PreviewService";
import { TextField, MenuItem, ThemeProvider, createTheme } from "@mui/material";

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
  const { slugCount, getslugcount, addservice, Uploadfile, checkCpyUrl } =
    context;
  const [openLoading, setOpenLoading] = useState(false);
  const [previewSourceOne, setPreviewSourceOne] = useState(""); // saves the data of file selected in the form
  const [previewSourceTwo, setPreviewSourceTwo] = useState(""); // saves the data of file selected in the form
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
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
  };

  const removeTag = (index) => {
    setTags(tags.filter((e, i) => i !== index));
  };

  // use effect to genrate slug and copy url-----------------------------------------------

  useEffect(() => {
    generateCopyURL();
    let slug = data.sname.split(" ").join("-");
    setdata({ ...data, slug: slug });
    getslugcount(slug.toLowerCase());

    // eslint-disable-next-line
  }, [data.sname]);

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

  // Changing free and paid section layout ---------------------------------------------

  const handleOptionChange = (e) => {
    //  balancing the changing effect of free and paid option

    setPaid(e.target.value);
  };

  // Auto resize of textarea    -------------------------------------------

  const textarea2 = document.querySelector("#sdesc");
  textarea2?.addEventListener("input", autoResize, false);

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  // Submit of form create the service ------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenLoading(true);
    props.progress(0);
    if (
      data.sname.length > 3 &&
      data.sdesc.length > 5 &&
      Content.length > 10 &&
      previewSourceOne &&
      previewSourceTwo
    ) {
      try {
        var banner = await Uploadfile(data1);
        var doc = await Uploadfile(data2);
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
            banner.url,
            doc.url,
            tags,
            0,
            paid === "free" ? false : true,
            paid === "free" ? 0 : data.smrp,
            paid === "free" ? 0 : data.ssp
          );
          if (json.success) {
            setdata({
              sname: "",
              sdesc: "",
              smrp: 0,
              slug: "",
              ssp: 0,
              sbanner: "",
              sdoc: "",
            });
            setOpenLoading(false);
            navigate(`/servicelist`);
          } else {
            setOpenLoading(false);
            toast.error(`Service Not Added Please Try Again`, {
              position: "top-center",
              autoClose: 2000,
            });
          }
        } else {
          setOpenLoading(false);
          toast.error(`Service Not Added please Try Again`, {
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
      toast.info("Mandatory fields cannot be empty or short in size", {
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

  return (
    <>
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
                        class="fa-solid fa-circle-xmark"
                        onClick={() => removeTag(index)}
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
                  />
                </>
              )}
              <TextField
                required
                name="sdoc"
                id="sdoc"
                //label="Document ( supports all formats)"
                placeholder="Upload file"
                onFocus={(e) => {
                  e.target.type = "file";
                }}
                onChange={handleChangeFileTwo}
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
          <Editor
            readOnly={false}
            content={Content}
            setContent={setContent}
            className="text_editor"
            placeholder="Please Describe your Service briefly..."
          />
          <div className="create_buttons">
            <button className="submit_button" onClick={handleSubmit}>
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
