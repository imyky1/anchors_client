import React, { useEffect, useState, useContext } from "react";
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

function Create(props) {
  const navigate = useNavigate();

  // for checking the type of service we need to create --------------------------------------
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const paramsType = query.get("type");
  const [CreateType, setCreateType] = useState(); // decides the type of document choosed in query
  const [showPopup, setshowPopup] = useState(false); // decides the type of document choosed in query


  const [paid, setpaid] = useState(); // decides the form acc to paid or free service type
  const [advanced, setAdvanced] = useState(false); // sets the advanced customize settings
  const [openLoading, setOpenLoading] = useState(false)   // controlls the loader

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
  const [Content, setContent] = useState()
  const [BannerImage, setBannerImage] = useState();
  const [ServiceDoc, setServiceDoc] = useState();
  const data1 = new FormData();
  const data2 = new FormData();
  data1.append("file", BannerImage);
  data2.append("file", ServiceDoc);

  // check for the type of the service that needs to be created
  useEffect(() => {
    setCreateType(paramsType);
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

  // changes handling in input field ---------------------------------
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  // responsible for generating slug and copyURL
  const process = () =>{
    //generateCopyURL();
    let slug = data.sname.split(" ").join("-"); // creates the slug from the name
    //getslugcount(slug.toLowerCase());  // checks if similar slug already exists -----
    return slug
  }

  useEffect(()=>{
    generateCopyURL()
  },[data.sname])


  // form submission ----------------------------------------------------------
  const onSubmit = async () => {
    let slug = process()
    let SlugCount =  await getslugcount(slug.toLowerCase());
    setOpenLoading(true); // true on loader
    props.progress(0);
    if (data.sname.length > 3 && BannerImage && ServiceDoc && paid) {
      if (Content?.length > 10) {
        try {
          var banner = await Uploadfile(data1); /// uplaoding banner and files on s3
          var doc = await UploadDocuments(data2);
          if (banner.success && doc.success) {
            props.progress(75);
            const json = await addservice(
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
              CreateType === "excel" ? 1 : CreateType === "video" ? 2 : 0,     // type for pdf is 0 and excel is 1 and video is 2
              paid === "Free" ? false : true,
              paid === "Free" ? 0 : data.smrp,
              paid === "Free" ? 0 : data.ssp
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
        } catch (error) {
          setOpenLoading(false);
          console.log(error)
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
    return navigate("/newUi/dashboard");
  }

  return (
    <>
    {openLoading && <LoadTwo open={openLoading} />}

    {showPopup && <SuccessService type={CreateType} link={data.CopyURL}/>}
    <div className="main_create_container">
      {/* Heading of the create section ------------------------ */}
      <section className="heading_create_box">
        <h1 className="create_text_01">
          Create{" "}
          {CreateType === "pdf"
            ? "PDF"
            : CreateType === "excel"
            ? "Excel sheet"
            : CreateType === "video"
            ? "Video"
            : ""}
        </h1>
        <p className="create_text_02">
          {CreateType === "pdf"
            ? "You can upload notes, Interview Questions, English Vocabulary etc."
            : CreateType === "excel"
            ? "You can upload notes, Interview Questions, English Vocabulary etc."
            : CreateType === "video"
            ? "You can upload Videos and share with audience to access"
            : ""}
        </p>
      </section>

      {/* form section of create container ---------------------------------------- */}
      <section className="create_form_box">
        {/* left side---------------------------------------------------------------------------- */}
        <div className="left_section_form">
          <TextField1
            label="Service Title"
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
          />
          <RadioField1 label="Use Default Image" id="asdas" />
          <Editor1
            label="Describe about Service"
            placeholder="Please describe about your service briefly"
            info="This will help audience to download"
            Content = {Content}
            required={true}
            setContent = {(e)=>setContent(e)}
          />
        </div>

        {/* right side----------------- ---------------------------------------------------------------------------*/}
        <div className="right_section_form">
          <Dropdown1
            label="Service Type "
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
            label="Upload Document"
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
            label="Enter Tags"
            placeholder="Press enter to add tags"
            info="This will help in recommendation"
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
            Advanced customize &nbsp;<i className="fa-solid fa-plus "></i>
          </span>
        </section>
      )}

      {advanced && (
        <section className="advanced_custom_mode_create">
          <span className="create_text_03">Advanced customize</span>
          <section>
            {/* left section -------------------------- */}
            <div className="left_section_form">
              <Editor1
                name="sdesc"
                label="Describe about Service"
                placeholder="Please describe about your service briefly"
                Content = {data.sdesc}
                setContent = {(e)=>setdata({...data,sdesc:e})}
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
                  CreateType === "video" ? "48 Mins" : CreateType === "excel" ? "21" : ""
                }
              />
              <RadioField1
                label={
                  CreateType === "video" ? "Allow Download" : "Allow Preview"
                }
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
    </>
  );
}

export default Create;
