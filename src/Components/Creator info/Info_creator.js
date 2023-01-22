import React, { useContext, useState, useEffect } from "react";
import { creatorContext } from "../../Context/CreatorState";
import "./Info_creator.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactEditor from "../Editor/Editor";
import ServiceContext from "../../Context/services/serviceContext";
import { LoadTwo } from "../Modals/Loading";
import { SuperSEO } from "react-super-seo";

// editor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MenuItem, TextField } from "@mui/material";

function Info_creator(props) {
  const { allCreatorInfo, getAllCreatorInfo, setCreatorInfo } =
    useContext(creatorContext);
  const { Uploadfile } = useContext(ServiceContext);
  const [Content, setContent] = useState();
  const [openLoading, setOpenLoading] = useState(false);
  const [checkFormData, setCheckFormData] = useState(false); // checking if all the data is present or not in the form
  const [previewSourceOne, setPreviewSourceOne] = useState(""); // saves the data of file selected in the form
  const [data, setdata] = useState({
    name: "",
    phone: 0,
    tagLine: "",
    linkedInLink: "",
    ytLink: "",
    instaLink: "",
    fbLink: "",
    teleLink: "",
    twitterLink: "",
    dob: "",
    topmateLink: "",
  });

  const data1 = new FormData();
  data1.append("file", previewSourceOne);

  useEffect(() => {
    getAllCreatorInfo();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setdata({
      ...data,
      ...allCreatorInfo,
    });
    setContent(allCreatorInfo?.aboutMe);
    // eslint-disable-next-line
  }, [getAllCreatorInfo]);
  // Auto resize of textare
  const textarea = document.querySelector("#about");
  textarea?.addEventListener("input", autoResize, false);

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  const handleChangeFileOne = (e) => {
    const file = e.target.files[0];
    setPreviewSourceOne(file);
  };

  // Change in values of input tags
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    props.progress(0);
    setOpenLoading(true);
    e?.preventDefault();
    var profile = await Uploadfile(data1);
    const newData = { ...data, aboutMe: Content, profile: profile?.url };
    const success = setCreatorInfo(newData);
    if (success) {
      setOpenLoading(false);
      toast.success("Changes Saved Successfully ", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      setOpenLoading(false);
      toast.error("Changes Not Saved ", {
        position: "top-center",
        autoClose: 2000,
      });
    }

    props.progress(100);
  };

  return (
    <>
      <ToastContainer />
      {openLoading && <LoadTwo open={openLoading} />}
      <div className="create_box creator_info">
        {/* <form className="workshop_form_create">
          <div className="left_side_form_create">
            <TextField
              label="Full Name"
              required
              variant="outlined"
              name="name"
              id="name"
              onChange={handleChange}
              value={data.name}
              placeholder="25JS Interview Important Question..."
              error={checkFormData && data?.name?.length <= 3}
              helperText={
                checkFormData &&
                data?.name?.length <= 3 &&
                "Service name must contain atleast 4 characters"
              }
            />
            <TextField
              label="Contact Number"
              required
              variant="outlined"
              name="phone"
              id="phone"
              onChange={handleChange}
              value={data.phone}
              placeholder="25JS Interview Important Question..."
              error={checkFormData && data?.phone?.length <= 3}
              helperText={
                checkFormData &&
                data?.phone?.length <= 3 &&
                "Service name must contain atleast 4 characters"
              }
            />

            <TextField
              label="Tagline"
              required
              variant="outlined"
              name="tagLine"
              id="tagLine"
              onChange={handleChange}
              value={data.tagLine}
              placeholder="25JS Interview Important Question..."
              error={checkFormData && data?.tagLine?.length <= 3}
              helperText={
                checkFormData &&
                data?.tagLine?.length <= 3 &&
                "Service name must contain atleast 4 characters"
              }
            />

            <TextField
              name="cpic"
              id="cpic"
              required
              //label={!previewSourceOne?.name && "Banner Image"}
              placeholder="Upload Profile Image"
              onFocus={(e) => {
                e.target.type = "file";
              }}
              onChange={handleChangeFileOne}
              error={checkFormData && !previewSourceOne?.name}
              helperText={
                checkFormData &&
                !previewSourceOne?.name &&
                "Profile Image is required"
              }
            />

            <TextField
              label="LinkedIn Link"
              required
              variant="outlined"
              name="linkedInLink"
              id="linkedIn"
              onChange={handleChange}
              value={data.linkedInLink}
              placeholder="25JS Interview Important Question..."
              error={checkFormData && data?.linkedInLink?.length <= 3}
              helperText={
                checkFormData &&
                data?.linkedInLink?.length <= 3 &&
                "Service name must contain atleast 4 characters"
              }
            />
          </div>

          <div className="right_side_form_create">
          <TextField
              label="Youtube Link"
              required
              variant="outlined"
              name="ytLink"
              id="ytLink"
              onChange={handleChange}
              value={data.ytLink}
              placeholder="25JS Interview Important Question..."
              error={checkFormData && data?.ytLink?.length <= 3}
              helperText={
                checkFormData &&
                data?.ytLink?.length <= 3 &&
                "Service name must contain atleast 4 characters"
              }
            />
            <TextField
              label="Instagram Link"
              required
              variant="outlined"
              name="linkedInLink"
              id="linkedIn"
              onChange={handleChange}
              value={data.linkedInLink}
              placeholder="25JS Interview Important Question..."
              error={checkFormData && data?.linkedInLink?.length <= 3}
              helperText={
                checkFormData &&
                data?.linkedInLink?.length <= 3 &&
                "Service name must contain atleast 4 characters"
              }
            /><TextField
            label="LinkedIn Link"
            required
            variant="outlined"
            name="linkedInLink"
            id="linkedIn"
            onChange={handleChange}
            value={data.linkedInLink}
            placeholder="25JS Interview Important Question..."
            error={checkFormData && data?.linkedInLink?.length <= 3}
            helperText={
              checkFormData &&
              data?.linkedInLink?.length <= 3 &&
              "Service name must contain atleast 4 characters"
            }
          />
          <TextField
              label="LinkedIn Link"
              required
              variant="outlined"
              name="linkedInLink"
              id="linkedIn"
              onChange={handleChange}
              value={data.linkedInLink}
              placeholder="25JS Interview Important Question..."
              error={checkFormData && data?.linkedInLink?.length <= 3}
              helperText={
                checkFormData &&
                data?.linkedInLink?.length <= 3 &&
                "Service name must contain atleast 4 characters"
              }
            />
          </div>
        </form> */}

        <form onSubmit={(e) => onSubmit(e)} className="entries">
          <div>
            <div className="left_entry_box">
              <label htmlFor="name" className="entry_labels">
                Full Name <small>*</small>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                value={data.name}
              />
              <label htmlFor="contact" className="entry_labels">
                Contact Number <small>*</small>
              </label>
              <input
                type="number"
                name="phone"
                id="phone"
                onChange={handleChange}
                value={data.phone}
              />
              <label htmlFor="tagLine" className="entry_labels">
                Tagline <small>*</small>
              </label>
              <input
                type="text"
                name="tagLine"
                id="tagLine"
                onChange={handleChange}
                value={data.tagLine}
                placeholder="Ex. Product Manager at Google"
              />

              <label htmlFor="cpic" className="entry_labels">
                Profile Image
              </label>
              <input
                type="text"
                name="cpic"
                id="cpic"
                placeholder="Upload Image..."
                onFocus={(e) => {
                  e.target.type = "file";
                }}
                onChange={handleChangeFileOne}
              />
              <label htmlFor="dob" className="entry_labels">
                Date of Birth <small>*</small>
              </label>
              <input
                type="date"
                name="dob"
                id="dob"
                onChange={handleChange}
                value={data.dob.slice(0, 10)}
              />
              <label htmlFor="linkedInLink" className="entry_labels">
                LinkedIn Link <small>*</small>
              </label>
              <input
                type="url"
                name="linkedInLink"
                id="linkedIn"
                onChange={handleChange}
                value={data.linkedInLink}
              />
            </div>
            <div className="right_entry_box">
              <label htmlFor="ytLink" className="entry_labels">
                Youtube Link
              </label>
              <input
                type="url"
                name="ytLink"
                id="ytLink"
                onChange={handleChange}
                value={data.ytLink}
              />
              <label htmlFor="instaLink" className="entry_labels">
                Instagram Link
              </label>
              <input
                type="text"
                name="instaLink"
                id="instagram"
                onChange={handleChange}
                value={data.instaLink}
              />
              <label htmlFor="teleLink" className="entry_labels">
                Telegram Link
              </label>
              <input
                type="url"
                name="teleLink"
                id="teleLink"
                onChange={handleChange}
                value={data.teleLink}
              />
              <label htmlFor="twitterLink" className="entry_labels">
                Twitter Link
              </label>
              <input
                type="url"
                name="twitterLink"
                id="twitterLink"
                onChange={handleChange}
                value={data.twitterLink}
              />
              <label htmlFor="topmateLink" className="entry_labels">
                TopMate Link
              </label>
              <input
                type="url"
                name="topmateLink"
                id="topmateLink"
                onChange={handleChange}
                value={data.topmateLink}
              />
            </div>
          </div>
        </form>
        <label htmlFor="ldesc" className="editor_entry_labels">
          About Me <small>*</small>
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={Content}
          config={{
            placeholder: "",
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
            Save Details
          </button>
        </div>
      </div>
      <SuperSEO title="Anchors - Personal Information" />
    </>
  );
}

export default Info_creator;
