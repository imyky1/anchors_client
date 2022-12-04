import React,{useContext, useState, useEffect} from "react";
import { creatorContext } from "../../Context/CreatorState";
import "./Info_creator.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactEditor from "../Editor/Editor";
import ServiceContext from "../../Context/services/serviceContext";
import { LoadTwo } from "../Modals/Loading";


function Info_creator(props) {
  const { allCreatorInfo, getAllCreatorInfo, setCreatorInfo } = useContext(creatorContext)
  const {Uploadfile} = useContext(ServiceContext)
  const [Content, setContent] = useState()
  const [openLoading, setOpenLoading] = useState(false)
  const [previewSourceOne, setPreviewSourceOne] = useState(""); // saves the data of file selected in the form
  const [data, setdata] = useState({
    name: "",
    phone: 0,
    tagLine: "",
    linkedInLink: "",
    ytLink: "", 
    instaLink: "",
    fbLink:"",
    teleLink: "",
    twitterLink: "",
  });


  const data1 = new FormData();
  data1.append("file", previewSourceOne);

  useEffect(() => {
    getAllCreatorInfo()
    // eslint-disable-next-line
  }, [])
  
useEffect(() => {
    setdata({
      ...data,
      ...allCreatorInfo
    })
    // eslint-disable-next-line
  }, [getAllCreatorInfo])
  

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
    props.progress(0)
    setOpenLoading(true)
    e?.preventDefault()
    var profile = await Uploadfile(data1);
    const newData = {...data,aboutMe:Content,profile:profile?.url}
    const success = setCreatorInfo(newData)
    if(success){
      setOpenLoading(false)
      toast.success("Changes Saved Successfully ",{
        position:"top-center",
        autoClose:2000
      })}else{
        setOpenLoading(false)
        toast.error("Changes Not Saved ",{
          position:"top-center",
          autoClose:2000
    })}
  
    props.progress(100)
  
  }

  return (
    <>
    <ToastContainer/>
    {openLoading && <LoadTwo open={openLoading} />}
    <div className="create_box creator_info">
      <form  onSubmit={e => onSubmit(e)} className="entries">
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
            
          </div>
        </div>
      </form>
      <label className="editor_entry_labels">
              About Me <small>*</small>
            </label>
      <ReactEditor readOnly = {false} content={allCreatorInfo?.aboutMe} setContent={setContent} />
      <div className="create_buttons">
        <button className="submit_button" onClick={onSubmit}>
          Save Details
        </button>
      </div>
    </div>
    </>
  );
}

export default Info_creator;
