import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Waitlist.css";
import { SuperSEO } from "react-super-seo";
import { createPopup } from "@typeform/embed";
import "@typeform/embed/build/css/popup.css";
import {
  Dropdown1,
  TextField1,
} from "../Editor/New UI/Create Services/InputComponents/fields_Labels";
import { Button1 } from "../Editor/New UI/Create Services/InputComponents/buttons";
import { toast, ToastContainer } from "react-toastify";
import { creatorContext } from "../../Context/CreatorState";

function Waitlist() {
  const navigate = useNavigate();
  const {verifyInviteCode} = useContext(creatorContext)
  //const { toggle } = createPopup("qTCuPV1C");

  // custom hook to get querries
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery();

  // directly get from query-----------------------------
  useEffect(()=>{
    if(query.get("anchorsWaitlistForm") === "true"){
      setopenForm(true)
    }
  },[])

  const [openForm, setopenForm] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState(false)
  const [formData, setformData] = useState({
    name: "",
    inviteCode: "",
    email: "",
    contactNo: 0,
    platform: "",
    audience: 0,
    socialLink: "",
    knowledgeFrom: "",
  });

  const VerifyCode = () =>{
    let process = verifyInviteCode(formData.inviteCode).then(e=>{
      if(e?.success){
        if(e?.verified){
          setVerifiedCode(true)
        }
        else{
          toast.error("Use a correct invite Code",{
            position:"top-center",
            autoClose:1500 
         })
        }
      }
      else{
        toast.error("Some error occured while checking, fill the form normally",{
           position:"top-center",
           autoClose:1500 
        })
      }
    })

    toast.promise(
      process,
      {
        pending: "Please Wait..",
        error: "Try Again by reloading the page!",
      },
      {
        position: "top-center",
        autoClose: 2000,
      }
    );
  }

  const handleClick = () => {
    setopenForm(!openForm);
  };

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      formData.name !== "" &&
      formData.email !== "" &&
      formData.contactNo.length > 1 &&
      formData.platform !== "" &&
      formData.audience.length > 1 &&
      formData.socialLink !== "" &&
      formData.knowledgeFrom !== ""
    ) {
      if(verifiedCode || formData.inviteCode === ""){
        console.log(formData);
      }
      else{
        toast.info("Verify the invite code first", {
          position: "top-center",
          autoClose: 2500,
        });
      }
    } else {
      toast.info("Please fill all the mandatory fields", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="signup_page">
        <div className="left_signup_side wailist_left_side">
          <Link to="/" style={{ textDecoration: "none", color: "unset" }}>
            <img
              className="logo_signup_page"
              src={require("../Main Page/Images/logo-beta.png")}
              alt=""
            />
          </Link>
          <img
            className="waitlist_img1"
            src={require("../Signup/images/signup1.png")}
            alt=""
          />
          {openForm && (
            <p className="waitlist_extra_gyan01">
              Filling this information increase chances to get access of anchors
              platform
            </p>
          )}
        </div>

        {!openForm && (
          <div className="right_signup_side">
            <h1 className="wailist_header_01">
              Hey, Anchor
              <br />
              Thanks for showing interest to become{" "}
              <span style={{ color: "red" }}>Anchor</span>
            </h1>
            <div>
              <div className="wailist_para">
                <p>
                  {" "}
                  Please fill this form to get review of your profile and our
                  team will get back to you if your profile get shortlisted to
                  become anchor.
                </p>
                <span>
                  *By filling this form increases the chance to become anchor
                </span>
              </div>
              <div className="signup_buttons">
                <button onClick={handleClick}>Tell us about yourself</button>
              </div>
            </div>
          </div>
        )}

        {openForm && (
          <div className="right_signup_side">
            <div className="waitlist_form_area">
              <TextField1
                label="Hey, what would you like us to call you?"
                name="name"
                id="name"
                placeholder="Enter name here"
                required={true}
                onChange={handleChange}
              />

              <div className="waitlist_inviteCode_section">
                <TextField1
                  label="Do you have Invite Code?"
                  name="inviteCode"
                  id="inviteCode"
                  placeholder="Enter Invite Code"
                  onChange={handleChange}
                  verifiedComp={verifiedCode}
                />  
                <Button1 text={!verifiedCode ? "Check Invite Code" : "Verified"}  height="45px" onClick={!verifiedCode ? VerifyCode : undefined}/>
              </div>

              <TextField1
                label="Your Email Id"
                name="email"
                id="email"
                type="email"
                required={true}
                placeholder="xyz@email.com"
                onChange={handleChange}
              />
              <TextField1
                label="Your Contact Number"
                placeholder="9999999999"
                name="contactNo"
                id="contactNo"
                type="number"
                required={true}
                onChange={handleChange}
              />
              <Dropdown1
                label="On which platforms do you have a presence as a creator or influencer?"
                placeholder="Please Select Platform"
                value={["LinkedIn", "Youtube", "Instagram", "Telegram"]}
                required={true}
                selectedValue={(e) => {
                  setformData({ ...formData, platform: e });
                }}
              />
              <TextField1
                label="How many audience do you have? "
                placeholder="50000"
                name="audience"
                id="audience"
                type="number"
                required={true}
                onChange={handleChange}
              />

              <TextField1
                label="Can you send us your social profile link?"
                name="socialLink"
                id="socialLink"
                required={true}
                onChange={handleChange}
              />

              <Dropdown1
                label="So, last question, how did you hear about us?"
                required={true}
                value={[
                  "from friends or Relatives",
                  "from our social platforms",
                  "from other anchor's social platform",
                ]}
                selectedValue={(e) => {
                  setformData({ ...formData, knowledgeFrom: e });
                }}
              />
            </div>
            <div className="signup_buttons">
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}
      </div>
      <SuperSEO title="Anchors - Waitlist" />
    </>
  );
}

export default Waitlist;
