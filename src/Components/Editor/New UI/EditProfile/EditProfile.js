import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { creatorContext } from "../../../../Context/CreatorState";
import ServiceContext from "../../../../Context/services/serviceContext";
import { LoadTwo } from "../../../Modals/Loading";
import {
  Editor1,
  SocialFields,
  TextField1,
} from "../Create Services/InputComponents/fields_Labels";
import "./EditProfile.css";

const EditProfile = (props) => {
  const { allCreatorInfo, getAllCreatorInfo, basicNav, setCreatorInfo } =
    useContext(creatorContext);
  const { Uploadfile } = useContext(ServiceContext);

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
    profile: "",
  });
  const [Content, setContent] = useState();
  const [previewSourceOne, setPreviewSourceOne] = useState(""); // saves the data of file selected in the form
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

  const [openLoading, setOpenLoading] = useState(false);
  // Change in values of input tags
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };
  const [showimg, setShowimg] = useState(null);
  function importData() {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (_) => {
      // you can use this method to get file and perform respective operations
      let files = Array.from(input.files);
      setShowimg(URL.createObjectURL(files[0]));

      setPreviewSourceOne(files);
    };
    input.click();
  }

  const onSubmit = async (e) => {
    props.progress(0);
    setOpenLoading(true);
    e?.preventDefault();
    console.log(data?.phone);
    if (data?.name && data?.phone?.length >= 10 && data?.dob) {
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
    } else {
      setOpenLoading(false);
      toast.info("Fill all the details properly", {
        position: "top-center",
        autoClose: 1500,
      });
    }

    props.progress(100);
  };
  console.log(showimg);
  return (
    <>
      <ToastContainer />
      {openLoading && <LoadTwo open={openLoading} />}
      <div className="personalinfo_wrap">
        <div className="personalinfo_top">
          <h1>Personal Information </h1>
          <span>Update your personal informations here</span>
        </div>
        <div className="personalinfo_photosection">
          <span>
            Profile Picture <span style={{ color: "red" }}>*</span>{" "}
          </span>
          <div className="personalinfo_photocontainer">
            <div className="personalinfo_photo">
              <img
                className="profileinfo_imagec"
                src={
                  showimg
                    ? showimg
                    : data?.profile
                    ? data?.profile
                    : basicNav?.photo
                }
                alt="some"
              />
            </div>
            <div className="personalinfo_upload">
              <button
                className="personalinfo_buttonupload"
                onClick={() => importData()}
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
        <div className="personalinfo_formwrap">
          <div className="perosnalinfo_leftform">
            <TextField1
              label="Full Name"
              name="name"
              id="name"
              required={true}
              value={data.name}
              placeholder="Enter Name Here"
              onChange={handleChange}
            />
            <TextField1
              label="Tagline"
              name="tagLine"
              id="tagLine"
              value={data.tagLine}
              placeholder="Ex Product Manager"
              onChange={handleChange}
            />
            {/* <div className="textfiled_container_01">
              <span className="label_type_01"></span>
              <input
                type="text"
                className="input_type_01"
                placeholder="Himanshu Kumar"
                value={data.name}
                onChange={handleChange}
              />
            </div> */}
            {/* <div className="textfiled_container_01">
              <span className="label_type_01">Tagline</span>
              <input
                type="text"
                className="input_type_01"
                placeholder="Ex Product Manager"
                value={data.tagLine}
                name="tagLine"
                id="tagLine"
                onChange={handleChange}
              />
            </div> */}
          </div>
          <div className="perosnalinfo_rightform">
            <TextField1
              label="Contact Number"
              name="phone"
              id="phone"
              required={true}
              value={data.phone}
              type="number"
              onChange={handleChange}
            />
            {/* <div className="textfiled_container_01">
              <span className="label_type_01">Contact Number</span>
              <input
                type="number"
                className="input_type_01"
                placeholder="+91-9988425785"
                value={data.phone}
                name="phone"
                id="phone"
                onChange={handleChange}
              />
            </div> */}

            <TextField1
              label="Date Of Birth"
              name="dob"
              id="dob"
              required={true}
              type="Date"
              value={data?.dob?.slice(0, 10)}
              placeholder="dd/mm/yyyy"
              onChange={handleChange}
            />
            {/* <div className="textfiled_container_01">
              <label className="label_type_01">Date Of Birth</label>
              <input
                type="Date"
                className="input_type_01"
                value={data?.dob?.slice(0, 10)}
                name="dob"
                id="dob"
                onChange={handleChange}
              ></input>
            </div> */}
          </div>
        </div>
        <div className="personalinfo_aboutme">
          <Editor1
            name="about"
            label="About Me"
            placeholder="Please describe yourself"
            Content={Content}
            setContent={(e) => setContent(e)}
          />
          {/* <span className="label_type_01">About Me</span>
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
          /> */}
        </div>
        <div className="personalinfo_linebreak"></div>
        <div className="personalinfo_socialwrap">
          <h2>Update your social media links </h2>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname">Linkedin Link</span>
            <SocialFields
              placeholder="https://www.Linkedin.in/in_himanshu_91"
              value={data.linkedInLink}
              name="linkedInLink"
              id="linkedIn"
              onChange={handleChange}
            />
            {allCreatorInfo.linkedInLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname"> Instagram Link</span>
            <SocialFields
              placeholder="https://www.Linkedin.in/in_himanshu_91"
              value={data.instaLink}
              name="instaLink"
              id="instagram"
              onChange={handleChange}
            />
            {allCreatorInfo.instaLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname"> Telegram Link</span>
            <SocialFields
              placeholder="https://www.Linkedin.in/in_himanshu_91"
              value={data.teleLink}
              name="teleLink"
              id="teleLink"
              onChange={handleChange}
            />
            {allCreatorInfo.teleLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname"> Youtube Link</span>
            <SocialFields
              placeholder="https://www.Linkedin.in/in_himanshu_91"
              value={data.ytLink}
              name="ytLink"
              id="ytLink"
              onChange={handleChange}
            />
            {allCreatorInfo.ytLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname"> TopMate Link</span>
            <SocialFields
              placeholder="https://www.Linkedin.in/in_himanshu_91"
              value={data.topmateLink}
              name="topmateLink"
              id="topmateLink"
              onChange={handleChange}
            />
            {allCreatorInfo.topmateLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
          <div className="personalinfo_sociallinks">
            <span className="personalinfo_linkname"> Twitter Link</span>
            <SocialFields
              placeholder="https://www.Linkedin.in/in_himanshu_91"
              value={data.twitterLink}
              name="twitterLink"
              id="twitterLink"
              onChange={handleChange}
            />
            {allCreatorInfo.twitterLink ? (
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 1.99984L6 13.9998L0.5 8.49984L1.91 7.08984L6 11.1698L16.59 0.589844L18 1.99984Z"
                  fill="black"
                />
              </svg>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="personalinfo_savebutton">
          <button onClick={onSubmit}>Save & Update</button>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
