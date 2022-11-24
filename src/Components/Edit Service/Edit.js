import React, { useState, useEffect, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import ServiceContext from "../../Context/services/serviceContext";
import ReactEditor from "../Editor/Editor";
import { LoadOne, LoadTwo } from "../Modals/Loading";
import { useNavigate, useParams } from "react-router-dom";

function Edit(props) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getserviceinfo, serviceInfo, Uploadfile, updateService, compareJWT } =
    useContext(ServiceContext);
  const [openLoading, setOpenLoading] = useState(false);
  const [openLoadingOne, setOpenLoadingOne] = useState(false);
  const [check, setcheck] = useState(true);

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
    const select = document.getElementById("stype");
    setdata({
      sname: serviceInfo?.sname,
      sdesc: serviceInfo?.sdesc,
      smrp: serviceInfo?.smrp,
      ssp: serviceInfo?.ssp,
    });
    setTags(serviceInfo?.tags);
    setContent(serviceInfo?.ldesc);
    if (serviceInfo?.isPaid) {
      select.value = "paid";
      document.querySelector("#smrp").style.display = "block";
      document.querySelector("#ssp").style.display = "block";
      document.querySelectorAll(".price_label")[0].style.display = "block";
      document.querySelectorAll(".price_label")[1].style.display = "block";
    } else {
      select.value = "free";
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

  const handleOptionChange = () => {
    //  balancing the changing effect of free and paid option
    const select = document.getElementById("stype");
    var value = select?.options[select.selectedIndex].value;
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

  // Auto resize of textarea    ------------------------------------------------------------

  const textarea2 = document.querySelector("#sdesc");
  textarea2?.addEventListener("mouseover", autoResize, false);

  function autoResize() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

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

  // Submitting the updated changes ------------------------------------------

  const handleSubmit = async (e) => {
    props.progress(0);
    setOpenLoading(true);
    e?.preventDefault();
    if (data.sname.length > 3 && data.sdesc.length > 5 && Content.length > 10) {
      try {
        const select = document.getElementById("stype");
        var value = select.options[select.selectedIndex].value;
        if (previewSourceOne) {
          var banner = await Uploadfile(data1);
        } else {
          banner = { url: serviceInfo?.simg };
        }
        const newData = {
          ...data,
          ldesc: Content,
          tags,
          simg: banner?.url,
          isPaid: value === "free" ? false : true,
          smrp: value === "free" ? 0 : data.smrp,
          ssp: value === "free" ? 0 : data.ssp,
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
            toast.error("Some error occured from server side", {
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
      toast.info("Mandatory fields cannot be empty or short in size", {
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

      <div className="create_box">
        <h1>Edit Service - {serviceInfo?.sname}</h1>
        <form className="entries" onSubmit={handleSubmit}>
          <div>
            <div className="left_entry_box">
              <label htmlFor="sname" className="entry_labels">
                Service Name <small>*</small>
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
                Service Description <small>*</small>
              </label>
              <textarea
                name="sdesc"
                onChange={handleChange}
                value={data.sdesc}
                id="sdesc"
                placeholder="Please catchy line to download..."
              />
              <label htmlFor="sbanner" className="entry_labels">
                Banner Image <small>*</small>
                <br />(
                <a href={serviceInfo?.simg} target="_blank">
                  Click to view current banner
                </a>
                )
              </label>
              <input
                type="text"
                name="sbanner"
                id="sbanner"
                placeholder="Upload New file..."
                onFocus={(e) => {
                  e.target.type = "file";
                }}
                onChange={handleChangeFileOne}
              />
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

              <label htmlFor="sdoc" className="entry_labels">
                Document ( supported .pdf only) <small>*</small>
                <br />(
                <a href={serviceInfo?.surl} target="_blank">
                  Click to view current document
                </a>
                )
              </label>
              <input
                type="text"
                name="sdoc"
                id="sdoc"
                accept="application/pdf"
                placeholder="Upload New file..."
                onFocus={(e) => {
                  e.target.type = "file";
                }}
                onChange={handleChangeFileTwo}
              />

              <label htmlFor="stags" className="entry_labels">
                Tags(Write a tag and press Enter)
              </label>
              <div className="tag-container">
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
                <input
                  type="text"
                  onKeyDown={handleKeyDown}
                  name="stags"
                  id="stags"
                  placeholder="Type tags..."
                />
              </div>
            </div>
          </div>
        </form>
        <label htmlFor="ldesc" className="editor_entry_labels">
          Long Description <small>*</small>
        </label>
        <ReactEditor
          readOnly={false}
          content={Content}
          setContent={setContent}
          className="text_editor"
        />
        <div className="create_buttons">
          <button className="submit_button" onClick={handleSubmit}>
          Update the Changes
          </button>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Edit;
