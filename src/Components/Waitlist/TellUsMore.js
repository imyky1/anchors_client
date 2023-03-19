import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Waitlist.css";
import { SuperSEO } from "react-super-seo";
import {
  Dropdown1,
  TextField1,
} from "../Editor/New UI/Create Services/InputComponents/fields_Labels";
import { Button1 } from "../Editor/New UI/Create Services/InputComponents/buttons";
import { toast, ToastContainer } from "react-toastify";
import { creatorContext } from "../../Context/CreatorState";
import mixpanel from "mixpanel-browser"

function TellUsMore() {
  const navigate = useNavigate();
  const { verifyInviteCode, fillTellUsMoreForm,getTellUsMoreFormData,updateStatus } = useContext(creatorContext);
  const [formAlreadyFilled, setFormAlreadyFilled] = useState(false)


  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Tell us more Page");
  }, []);

   
  useEffect(() => {
    getTellUsMoreFormData().then((e)=>{
        if(e?.success && e?.already){
            setformData(e?.form)
            setFormAlreadyFilled(true)
            toast.info("You have already filled the form",{
              position:"top-center",
              autoClose:2000
            })
            setTimeout(() => {
              navigate("/dashboard")
            }, 2000);
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
                    autoClose:3500
                  })
                  setTimeout(() => {
                    navigate("/dashboard")
                  }, 3500);
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
                    autoClose:3500
                  })
                  setTimeout(() => {
                    navigate("/dashboard")
                  }, 3500);
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
                    autoClose:3500
                  })
                  setTimeout(() => {
                    navigate("/dashboard")
                  }, 3500);
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
                    autoClose:3500
                  })
                  setTimeout(() => {
                    navigate("/dashboard")
                  }, 3500);
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
                    autoClose:3500
                  })
                  setTimeout(() => {
                    navigate("/dashboard")
                  }, 3500);
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
            <br /> This information is necessary to verify your profile and maintain the exclusivity that is promised to you / Help us maintain the exclusivity you're looking for by telling us a little about you
          </p>
        </div>

        <div className="right_signup_side">
          <div className="waitlist_form_area">
            <div className="waitlist_inviteCode_section">
              <TextField1
                label="Have an INVITE CODE?"
                name="inviteCode"
                anchorLink = {{text : "(know more)" , url:"https://bit.ly/anchors-invite-code"}}
                id="inviteCode"
                placeholder="Enter your Invite Code"
                onChange={handleChange}
                value={formData?.inviteCode}
                verifiedComp={verifiedCode}
              />
              <Button1
                text={!verifiedCode ? "Confirm my CODE" : "Verified"}
                height="45px"
                onClick={!verifiedCode ? VerifyCode : undefined}
              />
            </div>

            <TextField1
              label="How do we reach you?"
              placeholder="Enter WhatsApp Number for faster communication"
              name="contactNumber"
              id="contactNumber"
              type="number"
              value={formData?.contactNumber !== 0 && formData?.contactNumber}
              required={true}
              onChange={handleChange}
            />
            <Dropdown1
              label="Which platform marks your strongest presence as a Creator or an Influencer?"
              placeholder="Select one"
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
              label="What's your size of audience? "
              placeholder=" Enter number of followers (nearest integer)"
              name="followers"
              id="followers"
              type="number"
              value={formData?.followers !== 0 && formData?.followers}
              required={true}
              onChange={handleChange}
            />

            <TextField1
              label="Link your profile here "
              name="socialLink"
              id="socialLink"
              value={formData?.socialLink}
              required={true}
              onChange={handleChange}
            />

            <Dropdown1
              label="Where did you hear about us? (Yes, we're narcissistic)"
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
          {!formAlreadyFilled &&  <div className="signup_buttons">
            <button onClick={handleSubmit}>Submit</button>
          </div>}
        </div>
      </div>
      <SuperSEO title="Anchors - Tell us More" />
    </>
  );
}

export default TellUsMore;
