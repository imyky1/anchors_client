import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.css";
import { host } from "../../../config/config";
import mixpanel from "mixpanel-browser";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaLinkedinIn, FaRegEdit } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEmail } from "react-icons/md";
import { TextField1 } from "../../Editor/New UI/Create Services/InputComponents/fields_Labels";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { linkedinContext } from "../../../Context/LinkedinState";
import { userContext } from "../../../Context/UserState";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

function User_login({ open, onClose }) {
  const location = useLocation();

  if (!open) {
    return null;
  }

  const handleGoogle = async () => {
    mixpanel.track("User login through Google", {
      user: "",
    });
    localStorage.setItem("isUser", true);
    localStorage.setItem("from", "google");
    localStorage.setItem("url", location.pathname);
    window.open(`${host}/google/auth`, "_self");
  };

  const _handlelinkedin = async () => {
    mixpanel.track("User login through Linkedin", {
      user: "",
    });
    localStorage.setItem("isUser", true);
    localStorage.setItem("from", "linkedin");
    localStorage.setItem("url", location.pathname);
    window.open(`${host}/login/auth/linkedin`, "_self");
  };

  return (
    <div className="userModalWrapper" onClick={onClose}>
      <div className="userModalBox" onClick={(e) => e.stopPropagation()}>
        <RxCross2 className="userModalCross" onClick={onClose} />
        {/* logo ------------- */}
        <section className="logo_user_modal">
          <img src={require("../../../Utils/Images/logo.png")} alt="" />
          <span>anchors</span>
        </section>

        <section className="userModal_text_02">
          Welcome you <span>🥳</span>
        </section>

        <section className="userModal_text_03">
          Get Access to your services & exclusive good stuffs on your Dashboard.
        </section>

        <section className="userModal_text_04">Login or Signup</section>

        <section className="userModalbuttons">
          <button style={{ backgroundColor: "#ff4050" }} onClick={handleGoogle}>
            <FcGoogle />
            Continue with Google
          </button>
          <button onClick={_handlelinkedin}>
            <FaLinkedinIn style={{ color: "#0A66C2" }} />
            Continue with Linkedin
          </button>
          {/* <button>Continue with Truecaller</button> */}
        </section>

        <section className="userModal_text_05">
          By continuing, you acknowledge that you have read and understood, and
          agree to anchors{" "}
          <span
            onClick={() => {
              window.open("/privacy-policy");
            }}
          >
            {" "}
            Terms of Service{" "}
          </span>{" "}
          and{" "}
          <span
            onClick={() => {
              window.open("/privacy-policy");
            }}
          >
            {" "}
            Privacy Policy{" "}
          </span>
          .
        </section>
      </div>
    </div>
  );
}

export default function UserLogin2({ open, onClose, setOpenDataForm }) {
  const [agreeTerms, setAgreeTerms] = useState(false);

  const location = useLocation();

  if (!open) {
    return null;
  }

  const handleGoogle = async () => {
    mixpanel.track("User login through Google", {
      user: "",
    });
    localStorage.setItem("isUser", true);
    localStorage.setItem("from", "google");
    localStorage.setItem("url", location.pathname);
    window.open(`${host}/google/auth`, "_self");
  };

  const handlelinkedin = async () => {
    mixpanel.track("User login through Linkedin", {
      user: "",
    });
    localStorage.setItem("isUser", true);
    localStorage.setItem("from", "linkedin");
    localStorage.setItem("url", location.pathname);
    window.open(`${host}/login/auth/linkedin`, "_self");
  };

  return (
    <div className="userModalWrapper" onClick={onClose}>
      <div className="userModalBox" onClick={(e) => e.stopPropagation()}>
        <section className="user_modal_header">
          <div>
            <h1>Login to Continue</h1>
            <span>Please fill the form to Continue.</span>
          </div>

          <RxCross2 className="userModalCross" onClick={onClose} />
        </section>

        <section className="user_modal_buttons">
          <button
            className="button_type_01_user_modal"
            style={{ background: "#0076B2" }}
            onClick={handlelinkedin}
          >
            <FaLinkedin />
            Continue with LinkedIn
          </button>
          <button
            className="button_type_01_user_modal"
            style={{ background: "#FF5C5C" }}
            onClick={handleGoogle}
          >
            <FcGoogle />
            Continue with Google
          </button>
        </section>

        <span className="userModal_or">Or</span>

        <section className="user_modal_buttons">
          <button
            className="button_type_01_user_modal"
            style={{ border: "1px solid #BDBDBD" }}
            onClick={() => {
              setOpenDataForm(true);
              onClose();
            }}
          >
            <MdOutlineEmail /> Continue with Email
          </button>
        </section>

        <section className="userModal_termsCheck">
          <label htmlFor="t&c">
            By continuing you acknowledge that you have read and understood, and
            agree to anchors{" "}
            <span
              onClick={() => {
                window.open("/termsConditions");
              }}
            >
              Terms of Service
            </span>{" "}
            and{" "}
            <span
              onClick={() => {
                window.open("/privacy-policy");
              }}
            >
              Privacy Policy
            </span>
          </label>
        </section>

        {/* logo ------------- */}
        {/* <img
          src={require("../../../Utils/Images/logo-invite-only.png")}
          className="logo_user_modal"
          alt=""
        />` */}
      </div>
    </div>
  );
}

export function Dataform({ open, onClose, setOpenOTP }) {
  const [cookies, setCookie] = useCookies();
  const { verifiedData } = useContext(linkedinContext);
  const { updateUserInfo, checkUserIsLogined } = useContext(userContext);

  const [data, setdata] = useState({ name: null, email: null, number: null });

  const [openLogin, setOpenLogin] = useState(false);

  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    // means google or linkedin login

    if (openLogin ? data?.email : (data?.name && data?.email && data?.number)) {
      if (verifiedData) {
        // update the data in db -----------------------
        let result = updateUserInfo({
          name: data?.name,
          phoneNumber: data?.number,
        });

        if (result) {
          toast.success("Profile Updated Successfully", {
            position: "top-center",
            autoClose: 1500,
          });
          onClose();
        } else {
          toast.error("Something wrong happened, Try Again !!!", {
            position: "top-center",
            autoClose: 1500,
          });
        }
      }

      // means email login--------------
      else {
        handleEmailLogin();
      }
    } else {
      toast.info("Fill all the fields properly", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const handleEmailLogin = async () => {
    let res = await checkUserIsLogined(data?.email);

    if (openLogin) {
      //in login
      if (res) {
        // means user exists --------
        // send otp and continue with login
        sendingOTPFeature();
      } else {
        toast.error("No such account exisits, first creaete one", {
          position: "top-center",
          autoClose: 1500,
        });
        setOpenLogin(false);
      }
    } else {
      if (res) {
        toast.error("Account already exists. Please Login!!!", {
          position: "top-center",
          autoClose: 1500,
        });
        setOpenLogin(true);
      } else {
        sendingOTPFeature();
      }
    }
  };

  const sendingOTPFeature = async () => {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailPattern.test(data?.email)) {
      const response = await fetch(`${host}/api/email/sendOTPViaEmail`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          email: data?.email,
          name: data?.name ?? "User",
        }),
      });
      const json = await response.json();
      if (json?.success) {
        toast.success("OTP sent successfully", {
          position: "top-center",
          autoClose: 2000,
        });

        let otpcode = parseInt(json.code - 5626) * 562002;
        setCookie("ccoondfe", otpcode, { maxAge: 120 }); // valid for two minute
        onClose();
        setOpenOTP({ open: true, data: data });
      }
    } else {
      toast.error("Enter a proper email address", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    if (verifiedData?.data) {
      setdata({
        name: verifiedData?.data?.name,
        email: verifiedData?.data?.email,
        number: "",
      });
    }
  }, [verifiedData]);

  if (!open) {
    return null;
  }

  return (
    <div className="userModalWrapper" onClick={!verifiedData && onClose}>
      <div className="userModalBox" onClick={(e) => e.stopPropagation()}>
        <section className="user_modal_header">
          <div>
            <h1>One step away</h1>
            {!verifiedData && (
              <span>
                Please fill the form to {openLogin ? `Login` : `Register`}.
              </span>
            )}
          </div>

          {!verifiedData && (
            <RxCross2 className="userModalCross" onClick={onClose} />
          )}
        </section>

        <section className="mobile_number_input_user_modal">
          {!openLogin && (
            <TextField1
              placeholder="Name"
              name="name"
              id="name"
              onChange={handleChange}
              value={data?.name}
            />
          )}
          <TextField1
            placeholder="Email"
            type="email"
            name="email"
            id="email"
            onChange={!verifiedData && handleChange}
            value={data?.email}
          />
          {!openLogin && (
            <section>
              <PhoneInput
                defaultCountry="IN"
                value={data?.number}
                countryCallingCodeEditable={false}
                placeholder="Mobile Number"
                onChange={(e) => {
                  setdata({ ...data, number: e });
                }}
              />
            </section>
          )}
        </section>

        <button
          className="button_type_01_user_modal"
          style={{ background: "#FF5C5C" }}
          onClick={handleContinue}
        >
          Continue
        </button>

        {!verifiedData && (
          <p>
            {openLogin ? "Create new account?" : "already have account?"}{" "}
            <span
              onClick={() => {
                setOpenLogin(!openLogin);
              }}
            >
              {openLogin ? "Signup" : "Login"}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export function OtpForm({ open, onClose, data }) {
  const [cookies, removeCookie] = useCookies();
  const [otp, setOtp] = useState(null);

  const { registerUserLogin } = useContext(linkedinContext);

  const verfiyOTP = async () => {
    if (otp?.length !== 4) {
      toast.info("Enter a proper code", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      let code = cookies?.ccoondfe;
      if (!code) {
        toast.error("OTP was valid for 2 minute, Please retry again", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        if (parseInt(otp) === parseInt(parseInt(code) / 562002)) {
          toast.success("Verification was successfull", {
            position: "top-center",
            autoClose: 2000,
          });
          removeCookie("ccoondfe");

          //  same logic for login as well as signup
          localStorage.setItem("from", "email");
          await registerUserLogin(
            null,
            data?.name,
            data?.email,
            "",
            data?.number
          );
        } else {
          toast.error("Invalid OTP, try again", {
            position: "top-center",
            autoClose: 1500,
          });
        }
      }
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="userModalWrapper" onClick={onClose}>
      <div className="userModalBox" onClick={(e) => e.stopPropagation()}>
        <section className="user_modal_header">
          <div>
            <h1>OTP Verification</h1>
            <span>
              Enter the OTP sent to your Email <br />
              <span>
                <b>{data?.email}</b>
                {/* <FaRegEdit size={16} /> */}
              </span>
            </span>
          </div>

          {/* <RxCross2 className="userModalCross" onClick={onClose} /> */}
        </section>

        <section className="mobile_number_input_user_modal">
          <TextField1
            placeholder="OTP"
            onChange={(e) => {
              setOtp(e.target.value);
            }}
            value={otp}
          />
        </section>

        <button
          className="button_type_01_user_modal"
          style={{ background: "#FF5C5C" }}
          onClick={verfiyOTP}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
