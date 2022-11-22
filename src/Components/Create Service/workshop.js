import React, { useState, useContext, useEffect } from "react";
import "./Create.css";
import ServiceContext from "../../Context/services/serviceContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Editor from "../Editor/Editor";
import { LoadTwo } from "../Modals/Loading";

function Workshop(props) {
  const context = useContext(ServiceContext);
  const navigate = useNavigate();
  const { slugCount, getslugcount, addworkshop, Uploadfile, checkCpyUrl } =
    context;
  const [openLoading, setOpenLoading] = useState(false);
  const [previewSourceOne, setPreviewSourceOne] = useState(""); // saves the data of file selected in the form
  const [previewSourceTwo, setPreviewSourceTwo] = useState(""); // saves the data of file selected in the form
  const [copyURL, setCopyURL] = useState(""); // saves the data of file selected in the form

  const [paid, setPaid] = useState("free"); // tracks if the service is free or paid so that allow participants has limited options
  const [time, setTime] = useState({
    startTime: "",
    endTime: "",
  }); // tracks time object
  const [Content, setContent] = useState(
    "Please describe your service briefly.."
  );
  const [data, setdata] = useState({
    sname: "",
    sdesc: "",
    slug: "",
    smrp: 0,
    ssp: 0,
    startDate: "",
    maxCapacity: -1,
  });
  // usestate for afterstartentry
  const [afterstartentry, setAfterStartEntry] = useState({
    allowed: false,
    discount: "",
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

  const [tags, setTags] = useState(["JavaScript"]);

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

  data1.append("file", previewSourceOne);

  // Changing free and paid section layout ---------------------------------------------

  const handleOptionChange = () => {
    //  balancing the changing effect of free and paid option
    const select = document.getElementById("stype");
    var value = select?.options[select.selectedIndex].value;
    setPaid(value);
    if (value === "free") {
      document.querySelector("#smrp").style.display = "none";
      document.querySelector("#ssp").style.display = "none";
      document.querySelectorAll(".price_label")[0].style.display = "none";
      document.querySelectorAll(".price_label")[1].style.display = "none";
    }
    if (value === "paid") {
      document.querySelector("#smrp").style.display = "block";
      document.querySelector("#ssp").style.display = "block";
      document.querySelectorAll(".price_label")[0].style.display = "block";
      document.querySelectorAll(".price_label")[1].style.display = "block";
    }
  };

  // Auto resize of textarea    -------------------------------------------

  const textarea2 = document.querySelector("#sdesc");
  textarea2?.addEventListener("input", autoResize, false);

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  // Handling workshop input fields
  const handlecapacityChange = (e) => {
    let value = e.target.value;
    setdata({ ...data, maxCapacity: value });
  };
  const handleentrychange = (e) => {
    let value = e.target.value;
    if (value === "allowed") {
      setAfterStartEntry({ ...afterstartentry, allowed: true });
    } else if (value === "notallowed") {
      setAfterStartEntry({ allowed: false, discount: "" });
    } else {
      setAfterStartEntry({
        allowed: true,
        discount: value,
      });
    }
  };
  const handleChangetime = (e) => {
    setTime({ ...time, [e.target.name]: e.target.value });
  };

  // validators for date and time
  const datevalidator = () => {
    if (!data.startDate) {
      return false;
    }
    let today_date = new Date();
    let diff = new Date(data.startDate) - today_date;
    if (diff >= 0) {
      return true;
    }
    return false;
  };

  const timevalidator = () => {
    if (!time.startTime) {
      return false;
    }
    if (!time.endTime) {
      return false;
    }
    let start_hour = time.startTime[0] + time.startTime[1];
    let end_hour = time.endTime[0] + time.endTime[1];

    if (end_hour - start_hour > 0) {
      return true;
    } else if (end_hour - start_hour === 0) {
      let start_min = time.startTime[3] + time.startTime[4];
      let end_min = time.endTime[3] + time.endTime[4];
      if (end_min - start_min > 5) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  if (datevalidator() && timevalidator()) {
    console.log("wow");
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
      datevalidator() &&
      timevalidator()
    ) {
      try {
        const select = document.getElementById("stype");
        var value = select.options[select.selectedIndex].value;
        var banner = await Uploadfile(data1);

        if (banner.success) {
          props.progress(75);
          const json = await addworkshop(
            data.sname,
            data.sdesc,
            Content,
            slugCount === 0
              ? data.slug.toLowerCase()
              : data.slug.toLowerCase().concat("--", `${slugCount + 1}`),
            copyURL,
            banner.url,
            tags,
            1,
            value === "free" ? false : true,
            value === "free" ? 0 : data.smrp,
            value === "free" ? 0 : data.ssp,
            data.startDate,
            time,
            afterstartentry,
            data.maxCapacity
          );
          if (json.success) {
            setdata({
              sname: "",
              sdesc: "",
              smrp: 0,
              slug: "",
              ssp: 0,
              sbanner: "",
              startDate: "",
              maxCapacity: 50,
            });
            setTime({ startTime: "", endTime: "" });
            setOpenLoading(false);
            navigate(`/c/${localStorage.getItem("c_id")}`);
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
      toast.info(
        "Mandatory fields cannot be empty or short in size, Also check that your data and time are valid",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    }

    props.progress(100);
  };

  // Change in values of input tags ---------------------------------------------------------------------
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}
      <div className="create_box">
        <form className="entries" onSubmit={handleSubmit}>
          <div>
            <div className="left_entry_box">
              <label htmlFor="sname" className="entry_labels">
                Title <small>*</small>
              </label>
              <input
                type="text"
                name="sname"
                id="sname"
                onChange={handleChange}
                value={data.sname}
                placeholder="25JS Interview Important Question..."
              />
              <label htmlFor="sdesc" className="entry_labels">
                Short Description <small>*</small>
              </label>
              <textarea
                name="sdesc"
                onChange={handleChange}
                value={data.sdesc}
                id="sdesc"
                placeholder="Please catchy line to download..."
              />
              <label htmlFor="sbanner" className="entry_labels">
                Banner Image/Intro Video <small>*</small>
              </label>
              <input
                type="text"
                name="sbanner"
                id="sbanner"
                placeholder="Upload file..."
                onFocus={(e) => {
                  e.target.type = "file";
                }}
                onChange={handleChangeFileOne}
              />
              <label htmlFor="startDate" className="entry_labels">
                Date <small>*</small>
              </label>
              <input
                type="text"
                name="startDate"
                id="startDate"
                placeholder="Choose Date"
                onFocus={(e) => {
                  e.target.type = "date";
                }}
                value={data.startDate}
                onChange={handleChange}
              />
              <label htmlFor="startTime" className="time_entry entry_labels">
                Time <small>*</small>
                <h6>
                  Start Date &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;
                  &emsp;End Date
                </h6>
              </label>
              <section className="input_split">
                <input
                  type="text"
                  name="startTime"
                  id="startTime"
                  placeholder="Choose Start Time"
                  onFocus={(e) => {
                    e.target.type = "time";
                  }}
                  value={time.startTime}
                  onChange={handleChangetime}
                />
                <input
                  type="text"
                  name="endTime"
                  id="endTime"
                  placeholder="Choose End Time"
                  onFocus={(e) => {
                    e.target.type = "time";
                  }}
                  value={time.endTime}
                  onChange={handleChangetime}
                />
              </section>

              <label htmlFor="stags" className="entry_labels">
                Tags(Write a tag and press Enter)
              </label>
              <div className="tag-container">
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
                <input
                  type="text"
                  onKeyDown={handleKeyDown}
                  name="stags"
                  id="stags"
                  placeholder="Type tags..."
                />
              </div>
            </div>

            <div className="right_entry_box">
              <label htmlFor="stype" className="entry_labels">
                Service Type <small>*</small>
              </label>
              <select id="stype" onChange={handleOptionChange}>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>

              <label htmlFor="smrp" className="entry_labels price_label">
                Set MRP <small>*</small>
              </label>
              <input
                type="number"
                name="smrp"
                id="smrp"
                placeholder="Eg. 299"
                onChange={handleChange}
                value={data.smrp}
              />
              <label htmlFor="ssp" className="entry_labels price_label">
                Selling Price <small>*</small>
              </label>
              <input
                type="number"
                name="ssp"
                id="ssp"
                placeholder="Eg. 199"
                onChange={handleChange}
                value={data.ssp}
                max={data.smrp}
              />
              <label htmlFor="afterstartentry" className="entry_labels">
                Open after events started <small>*</small>
                <h6>You can allow participants even after event has started</h6>
              </label>
              <select id="afterstartentry" onChange={handleentrychange}>
                <option value="notallowed">Not allowed</option>
                <option value={`${paid === "free" ? "allowed" : "10mins"}`}>
                  {paid === "free"
                    ? "allowed"
                    : "after 10 minutes 10% discount"}
                </option>
                {paid === "free" ? (
                  ""
                ) : (
                  <>
                    <option value="20mins">
                      after 20 minutes 20% discount
                    </option>
                    <option value="30mins">
                      after 30 minutes 30% discount
                    </option>
                  </>
                )}
              </select>
              <label htmlFor="maxCapacity" className="entry_labels">
                Max Capacity allowed <small>*</small>
                <h6>You can set the number of seat limit</h6>
              </label>
              <select
                id="maxCapacity"
                value={data.maxCapacity}
                onChange={handlecapacityChange}
              >
                <option value="-1">No Limit</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
              </select>
            </div>
          </div>
        </form>
        <label htmlFor="ldesc" className="editor_entry_labels">
          Long Description <small>*</small>
        </label>
        <Editor
          readOnly={false}
          content={Content}
          setContent={setContent}
          className="text_editor"
        />
        <button className="submit_button" onClick={handleSubmit}>
          Submit and Publish
        </button>
        <ToastContainer />
      </div>
    </>
  );
}

export default Workshop;
