import React, { useContext, useEffect, useRef } from "react";
import "./Models.css";
import { AiOutlineArrowRight } from "react-icons/ai";
import tick from "./tick.svg";
import { toast } from "react-toastify";
import { host } from "../../config/config";
import { useCookies } from "react-cookie";
import { EPAcontext } from "../../Context/EPAState";
import mixpanel from "mixpanel-browser";

function RequestModel({ onClose, setOpenOTPModal, formData, setFormData }) {
  const numberRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mixpanel.track("Submit Request call back");
    if (
      formData?.name.length !== 0 &&
      formData?.email?.length !== 0 &&
      formData?.number?.length !== 0 &&
      parseInt(formData?.number) > 0
    ) {
      onClose();
      setOpenOTPModal(true);
    } else {
      toast.info("Fill the fields properly", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  };

  return (
    <>
      <div className="outside_wrapper_earning" onClick={onClose}>
        <div
          className="callback_earning_model"
          onClick={(e) => {
            e?.stopPropagation();
          }}
        >
          <h1>Want to know more how?</h1>

          <div>
            <section className="left_side_model_earning">
              <input
                type="text"
                placeholder="Name"
                onChange={handleChange}
                value={formData?.name}
                name="name"
                onFocus={() => {
                  mixpanel.track("Input Name");
                }}
              />
              <input
                type="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData?.email}
                name="email"
                onFocus={() => {
                  mixpanel.track("Input Mobile");
                }}
              />
              <input
                type="number"
                placeholder="Phone Number"
                onChange={handleChange}
                value={formData?.number}
                ref={numberRef}
                name="number"
                onFocus={() => {
                  mixpanel.track("Input Email ");
                }}
              />

              <div>
                <button type="submit" onClick={handleSubmit}>
                  Request a Call Back
                </button>
              </div>
            </section>

            <section className="right_side_model_earning">
              <p>
              Many people are trying to explore by themselves. Do you want to explore too?
              </p>

              <span
                onClick={() => {
                  mixpanel.track("Explore how on popup");
                  window.open("/login/creators");
                }}
              >
                Want to Know How?
              </span>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

const OTPModel = ({ onClose, setOpenFinalModal, formData, setFormData }) => {
  const { saveLeads } = useContext(EPAcontext);

  const [cookies, setCookie] = useCookies();

  const verfiyOTP = async () => {
    if (formData?.otp?.length !== 6) {
      toast.info("Enter a proper code", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      let code = cookies?.ccoondfe;
      if (!code) {
        toast.error("OTP was valid for 1 minute, Please retry again", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        if (parseInt(formData?.otp) === parseInt(parseInt(code) / 562002)) {
          // Save the form data on success otp
          await saveLeads(
            formData?.name,
            formData?.email,
            formData?.number,
            true,
            "Youtube"
          ).then((e) => {
            if (e) {
              setFormData({ ...formData, verified: true });
              onClose();
              setOpenFinalModal(true);
              setFormData({
                name: "",
                email: "",
                number: "",
                otp: "",
                verified: false,
              });
            } else {
              toast.info("Something wrong happened Please try Again!!", {
                position: "top-center",
                autoClose: 4000,
              });
              onClose();
            }
          });
        } else {
          toast.error("Invalid OTP!!!. Try again!!!", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      }
    }
  };

  const sendOTP = async () => {
    const response = await fetch(
      `${host}/api/email/sendMsg?message=Mobile Number&number=${formData?.number}&subject=Anchors`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      }
    );
    const json = await response.json();
    if (json.MessageID) {
      let otpcode = parseInt(json.code - 145626) * 562002;
      setCookie("ccoondfe", otpcode, { maxAge: 120 }); // valid for one minute
    }
  };

  // Send otp as soon as the model loads
  useEffect(() => {
    sendOTP();
  }, [formData?.number]);

  return (
    <div className="outside_wrapper_earning">
      <div className="otp_main_container_earning">
        <h2>Request a call back </h2>

        <section>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={formData?.number}
            disabled
          />
          <input
            type="number"
            name="otp"
            placeholder="OTP"
            value={formData?.otp}
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
        </section>

        <button onClick={verfiyOTP}>Request a Call Back</button>
      </div>
    </div>
  );
};

const FinalScheduleModel = ({ onClose }) => {
  return (
    <div className="outside_wrapper_earning" onClick={onClose}>
      <div
        className="otp_main_container_earning"
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        <section>
          <img src={tick} alt="" />
          <h2>Request a call back </h2>
        </section>

        <section>
          <span>Our Team will call you shortly in 12-24 hrs</span>
          <span>Can’t you wait for call?</span>
        </section>

        <button
          onClick={() => {
            window.open("/");
            onClose();
            mixpanel.track("Explore anchors on Popup");
          }}
        >
          Explore anchors now <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};

export const RequestModal = RequestModel;
export const OtpModal = OTPModel;
export const FinalScheduleModal = FinalScheduleModel;
