import React, { useContext, useEffect, useState } from "react";
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

function TellUsMore() {
  const navigate = useNavigate();
  const { verifyInviteCode, fillTellUsMoreForm,getTellUsMoreFormData,updateStatus } = useContext(creatorContext);

   
  useEffect(() => {
    getTellUsMoreFormData().then((e)=>{
        if(e?.success){
            setformData(e?.form)
        }
    })
  }, []);
  

  const [verifiedCode, setVerifiedCode] = useState(false);
  const [formData, setformData] = useState({
    inviteCode: "",
    contactNumber: 0,
    platform: "",
    followers: 0,
    socialLink: "",
    knownFrom: "",
  });

  const VerifyCode = () => {
    if(formData?.inviteCode){
    let process = verifyInviteCode(formData.inviteCode).then((e) => {
      if (e?.success) {
        if (e?.verified) {
          setVerifiedCode(true);
        } else {
          toast.error("Use a correct invite Code", {
            position: "top-center",
            autoClose: 1500,
          });
        }
      } else {
        toast.error(
          "Some error occured while checking, fill the form normally",
          {
            position: "top-center",
            autoClose: 1500,
          }
        );
      }
    });

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
  };

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
    if(e.target.name === "inviteCode"){
        setVerifiedCode(false)
    }
  };

  const handleSubmit = async () => {
    if (
      formData.contactNumber?.toString().length > 1 &&
      formData.platform !== "" &&
      formData.followers?.toString().length > 1 &&
      formData.socialLink !== "" &&
      formData.knownFrom !== ""
    ) {
      if (verifiedCode || formData.inviteCode === "" || !formData.inviteCode) {
        await fillTellUsMoreForm(
          // saving the data in tell us more in database
          formData?.inviteCode?.toUpperCase(),
          formData?.contactNumber,
          formData?.platform,
          formData?.followers,
          formData?.socialLink,
          formData?.knownFrom
        ).then((e) => {
          if (e?.success) {
            toast.success("Form submitted successfully",{
                position:"top-center",
                autoClose:1500
            });

            switch (formData?.platform) {
              case "LinkedIn":
                if (parseInt(formData?.followers) > 10000 && verifiedCode) {
                  updateStatus()
                  toast.success("Hey anchor, Welcome to anchors platform",{
                    position:"top-center",
                    autoClose:1500
                  })
                  setTimeout(() => {
                    navigate("/dashboard")
                  }, 1500);
                }
                else{
                    navigate("/waitlist")
                }
                break;
              case "Youtube":
                if (parseInt(formData?.followers) > 10000 && verifiedCode) {
                   updateStatus()
                  toast.success("Hey anchor, Welcome to anchors platform",{
                    position:"top-center",
                    autoClose:1500
                  })
                  setTimeout(() => {
                    navigate("/dashboard")
                  }, 1500);
                }
                else{
                    navigate("/waitlist")
                }
                break;
              case "Instagram":
                if (parseInt(formData?.followers) > 10000 && verifiedCode) {
                   updateStatus()
                  toast.success("Hey anchor, Welcome to anchors platform",{
                    position:"top-center",
                    autoClose:1500
                  })
                  setTimeout(() => {
                    navigate("/dashboard")
                  }, 1500);
                }
                else{
                    navigate("/waitlist")
                }
                break;
              case "Telegram":
                if (parseInt(formData?.followers) > 5000 && verifiedCode) {
                   updateStatus()
                  toast.success("Hey anchor, Welcome to anchors platform",{
                    position:"top-center",
                    autoClose:1500
                  })
                  setTimeout(() => {
                    navigate("/dashboard")
                  }, 1500);
                }
                else{
                    navigate("/waitlist")
                }
                break;
              case "Facebook":
                if (parseInt(formData?.followers) > 5000 && verifiedCode) {
                   updateStatus()
                  toast.success("Hey anchor, Welcome to anchors platform",{
                    position:"top-center",
                    autoClose:1500
                  })
                  setTimeout(() => {
                    navigate("/dashboard")
                  }, 1500);
                }
                else{
                    navigate("/waitlist")
                }
                break;

              default:
                break;
            }
          }
          else{
            toast.error("Form not saved, Please try again",{
                position:"top-center",
                autoClose:1500
            });
          }
        });
      } else {
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

  

  if(!localStorage.getItem("jwtToken") || !localStorage.getItem("c_id")){
    window.open("/","_self")
    return null
  }

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
          <p className="waitlist_extra_gyan01">
            <br /> Filling this information increase chances to get access of
            anchors platform
          </p>
        </div>

        <div className="right_signup_side">
          <div className="waitlist_form_area">
            <div className="waitlist_inviteCode_section">
              <TextField1
                label="Do you have Invite Code?"
                name="inviteCode"
                id="inviteCode"
                placeholder="Enter Invite Code"
                onChange={handleChange}
                value={formData?.inviteCode}
                verifiedComp={verifiedCode}
              />
              <Button1
                text={!verifiedCode ? "Check Invite Code" : "Verified"}
                height="45px"
                onClick={!verifiedCode ? VerifyCode : undefined}
              />
            </div>

            <TextField1
              label="Your Contact Number"
              placeholder="Enter WhatsApp Number for faster communication"
              name="contactNumber"
              id="contactNumber"
              type="number"
              value={formData?.contactNumber !== 0 && formData?.contactNumber}
              required={true}
              onChange={handleChange}
            />
            <Dropdown1
              label="On which platforms do you have a presence as a creator or influencer?"
              placeholder="Please Select Platform"
              value={[
                "LinkedIn",
                "Youtube",
                "Instagram",
                "Telegram",
              ]}
              required={true}
              defaultValue={formData?.platform}
              selectedValue={(e) => {
                setformData({ ...formData, platform: e });
              }}
            />
            <TextField1
              label="How many audience do you have? "
              placeholder="Number of followers"
              name="followers"
              id="followers"
              type="number"
              value={formData?.followers !== 0 && formData?.followers}
              required={true}
              onChange={handleChange}
            />

            <TextField1
              label="Can you send us your social profile link?"
              name="socialLink"
              id="socialLink"
              value={formData?.socialLink}
              required={true}
              onChange={handleChange}
            />

            <Dropdown1
              label="So, last question, how did you hear about us?"
              required={true}
              defaultValue={formData?.knownFrom}
              value={[
                "Friends", "Creator", "Social Media Platforms", "Google", "Other"
              ]}
              selectedValue={(e) => {
                setformData({ ...formData, knownFrom: e });
              }}
            />
          </div>
          <div className="signup_buttons">
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
      <SuperSEO title="Anchors - Tell us More" />
    </>
  );
}

export default TellUsMore;
