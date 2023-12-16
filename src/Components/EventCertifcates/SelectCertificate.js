import React, { useContext, useEffect, useState } from "react";
import "./SelectCertificates.css";
import Star from "../../Utils/Icons/starsGroup.svg";
import { Button1 } from "../Editor/New UI/Create Services/InputComponents/buttons";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import {
  Editor1,
  TextArea1,
  TextField1,
  UploadField3,
} from "../Editor/New UI/Create Services/InputComponents/fields_Labels";
import ServiceContext from "../../Context/services/serviceContext";
import mixpanel from "mixpanel-browser";
import { toast } from "react-toastify";

let certData = {
  1: "#FEF2F2",
  2: "linear-gradient(217deg, #DC2626 12.1%, #1000C3 88.03%)",
};

export const Certificate = ({
  scale,
  origin,
  data,
  certificate,
  sign,
  signStyle,
  eventData,
  background,
  signURL
}) => {
  const [showSign, setShowSign] = useState(signURL);

  useEffect(() => {
    if (sign) {
      setShowSign(URL.createObjectURL(sign));
    }
  }, [sign]);

  useEffect(() => {
    let doc = document.querySelector("#certificate_signature01");
    if (doc) {
      doc.style.bottom = signStyle?.bottom + "px";
      doc.style.width = signStyle?.width + "px";
    }
  }, [signStyle]);

  useEffect(() => {
    let doc = document.querySelector("#certificateLabel01");

    let a = data?.para?.replace("(organisers Name)", data?.name);

    if (doc) {
      doc.innerHTML = "";
      doc.innerHTML = a;
    }
  }, [data]);

  return (
    <div
      className="event_certificate_outside_container"
      style={{
        transform: `scale(${scale ?? 1})`,
        transformOrigin: origin ?? "0 0",
      }}
    >
      <div
        className="elipse01_color_layer_certificate"
        style={{ background: background ?? certData[certificate] }}
      ></div>
      <div
        className="elipse02_color_layer_certificate"
        style={{ background: background ?? certData[certificate] }}
      ></div>

      <section>
        <div className="heading_certificate_01">
          <img
            src={Star}
            style={{ position: "absolute", left: "-25px", top: "-14px" }}
            alt=""
          />
          <h1 className="text_01_certificate_01">CERTIFICATE</h1>

          <span className="text_02_certificate_01">of Completion</span>
          <img
            src={Star}
            style={{ position: "absolute", right: "-19px", bottom: "-10px" }}
            alt=""
          />
        </div>

        <span className="text_03_certificate_01">This is to certify that</span>

        <div className="naming_certificate_01">
          <span className="text_04_certificate_01">Ravi Ahirwar</span>

          <div className="horizonal_underline_certificate01"></div>

          <img
            src={Star}
            style={{ position: "absolute", right: "-24px", top: "-8px" }}
            alt=""
          />
        </div>

        <div className="certificate_label_01" id="certificateLabel01"></div>

        <div className="designation_certificate_01">
          <span>
            <span className="text_07_certificate_01">
              Date : {new Date(eventData?.date)?.toLocaleDateString()}
            </span>
            <div className="horizonal_underline_certificate01"></div>
          </span>

          <span className="text_07_certificate_01">
            <img src={showSign} alt="signature" id="certificate_signature01" />
            <div className="horizonal_underline_certificate01"></div>
          </span>
        </div>

        <div className="branding_certificate_01">
          Powered By :{" "}
          <img src={require("../../Utils/Images/logo-invite-only.png")} />
        </div>
      </section>
    </div>
  );
};


const FillCertificateDetails = ({ certificate, setStep, eventData ,progress }) => {
  const { updateEvent, UploadEventSpeakersProfile } =
    useContext(ServiceContext);

    const navigate = useNavigate()

  const [data, setdata] = useState({
    name: eventData?.cname,
    para: `<p> has successfully completed a professional webinar on <br /><b>${eventData?.sname}</b><br />conducted by <b>(organisers Name)</b> </p>`,
  });

  const [sign, setSign] = useState();
  const [signStyle, setSignStyle] = useState({ bottom: 0, width: 40 });

  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  const handleStyleChange = (e) => {
    setSignStyle({ ...signStyle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    progress(0)
    if (!sign) {
      toast.error("Upload your signature", {
        position: "top-center",
        autoClose: 1500,
      });
    } else if (!data?.name || data?.name?.length === 0) {
      toast.error("Enter Organiser's Name", {
        position: "top-center",
        autoClose: 1500,
      });
    } else if (data?.para?.length < 20) {
      toast.error("Enter Certificate's Label Properly", {
        position: "top-center",
        autoClose: 1500,
      });
    } else {
      let data1 = new FormData();
      data1.append("file", sign);
      let signData = await UploadEventSpeakersProfile(data1);
      progress(75)

      if (signData?.success) {
        let finalData = {
          ...data,
          sign: signData?.result?.Location,
          signStyle,
          certificate: certData[certificate],
        };

        let result = await updateEvent(eventData?.id, { certificateData: finalData });

        if(result){
          progress(100)
          toast.success("Successfully saved the details",{
            position:"top-center",
            autoClose:2000
          })

          setTimeout(() => {
            navigate("/dashboard/mycontents")
          }, 2000);
        }

      } else {
        progress(100)
        toast.error("Error in uploading signature",{
          position:"top-center",
          autoClose:1500
        });
      }
    }
  };

  return (
    <div className="fill_certificate_details_conatiner">
      <section>
        <TextField1
          placeholder="Oraganisor's Name"
          onChange={handleChange}
          name="name"
          id="name"
          value={data?.name}
        />

        <Editor1
          placeholder="Certificate label"
          name="para"
          id="para"
          setContent={(e) => {
            setdata({ ...data, para: e });
          }}
          Content={data?.para}
        />

        <UploadField3
          info={
            <>
              Please use signature without background (use{" "}
              <a href="https://www.remove.bg/" target="_blank" rel="noreferrer">
                remove.bg
              </a>{" "}
              to remove background)
            </>
          }
          onChange={setSign}
          id="sign"
          name="sign"
          FileType=".jpg,.png,.jpeg"
        />

        {sign && (
          <div
            className="signature_controlls"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >
            <input
              type="range"
              id="bottom"
              name="bottom"
              min="-100"
              max="100"
              onChange={handleStyleChange}
              value={signStyle?.bottom}
            />
            <input
              type="range"
              id="width"
              name="width"
              min="0"
              max="150"
              onChange={handleStyleChange}
              value={signStyle?.width}
            />
          </div>
        )}

        <div style={{ marginTop: "40px" }}>
          <Button1
            text="Back"
            rightIcon={<AiOutlineArrowLeft />}
            onClick={() => {
              setStep(0);
            }}
          />

          <Button1
            text="Save & Continue"
            icon={<AiOutlineArrowRight />}
            onClick={handleSubmit}
          />
        </div>
      </section>

      <div>
        <Certificate
          scale={0.8}
          origin="top right"
          data={data}
          certificate={certificate}
          sign={sign}
          signStyle={signStyle}
          eventData={eventData}
        />
      </div>
    </div>
  );
};

const SelectCertificate = (props) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState(0);

  const [step, setStep] = useState(0); // 0 for selting certificate and 1 for entering the details ---------------

  const { geteventinfo, compareJWT, eventInfo } = useContext(ServiceContext);

  useEffect(() => {
    mixpanel.track("Page Visit");

    props.progress(0);
    geteventinfo(slug).then((e) => {
      compareJWT(e[0]?._id).then((result) => {
        if (result) {
          props.progress(100);
        } else {
          navigate("/dashboard/mycontents");
        }
      });
    });
  }, []);

  return (
    <div className="withoutSidebarOutsideConatiner">
      {/* header container ---------- */}
      <section className="withoutSidebarOutsideConatiner_header_container">
        <h1 className="text_type01_payment_info">
          {step !== 1
            ? "Certificate design for you"
            : "Customize your certificate"}
        </h1>
        {step === 0 && (
          <span className="servicelist_wrap_span">
            At the end of events, your audience will receive a certificate of
            completion, choose which design you would like to share
          </span>
        )}
      </section>

      {step !== 1 ? (
        <>
          {/* certificates section --------------- */}
          <section className="certificates_section_display">
            <span
              className={`${
                selectedCert === 1 && "selected_certificate_section"
              } not_selected_certificate_section`}
              onClick={() => {
                setSelectedCert(1);
              }}
            >
              <img src={require("../../Utils/Images/cert1.png")} alt="" />
            </span>

            <span
              className={`${
                selectedCert === 2 && "selected_certificate_section"
              } not_selected_certificate_section`}
              onClick={() => {
                setSelectedCert(2);
              }}
            >
              <img src={require("../../Utils/Images/cert2.png")} alt="" />
            </span>
          </section>

          <section className="certificates_button_controlles">
            <Button1
              text="Back"
              rightIcon={<AiOutlineArrowLeft />}
              onClick={() => {
                navigate(-1);
              }}
            />

            <Button1
              text="Customise this design"
              icon={<AiOutlineArrowRight />}
              onClick={() => {
                if (selectedCert !== 0) {
                  setStep(1);
                } else {
                  toast.error("Select a certificate type", {
                    position: "top-center",
                    autoClose: 1000,
                  });
                }
              }}
            />
          </section>
        </>
      ) : (
        <FillCertificateDetails
          certificate={selectedCert}
          setStep={setStep}
          progress={props?.progress}
          eventData={{
            cname: eventInfo?.creator?.name,
            sname: eventInfo?.event?.sname,
            id: eventInfo?.event?._id,
            date: eventInfo?.event?.startDate,
          }}
        />
      )}
    </div>
  );
};

export default SelectCertificate;
