import { LazyLoadImage } from "react-lazy-load-image-component";
import "../EditProfile/Preview.css";
import { useEffect } from "react";
import { BsWhatsapp } from "react-icons/bs";

import ExcelIcon from "../../../../Utils/Icons/excel-service.svg";
import VideoIcon from "../../../../Utils/Icons/video-service.svg";
import DocIcon from "../../../../Utils/Icons/doc-service.svg";
import TrendIcon from "../../../../Utils/Icons/trend-service.svg";
import { AiOutlineArrowRight } from "react-icons/ai";

const CreateServiceDemo = ({
  sname,
  sdesc,
  ldesc,
  smrp,
  ssp,
  paid,
  simg,
  stype,
  noOfPage
}) => {

  useEffect(() => {
    let doc = document.querySelector("#large_desc_service_page");
    if (ldesc) {
      if (doc) {
        doc.innerHTML = "";
        doc.innerHTML = ldesc;
      }
    } else {
      doc.innerHTML =
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic, facilis!";
    }
  }, [ldesc]);

  useEffect(() => {
    let doc = document.querySelector("#short_desc_service_page");
    if (sdesc) {
      if (doc) {
        doc.innerHTML = "";
        doc.innerHTML = sdesc;
      }
    } else {
      doc.innerHTML =
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic, facilis!";
    }
  }, [sdesc]);

  return (
    <div className="perview_demo_mobile_view_edit_profile">
      <div>
        {/* Navbar */}
        <section className="live_demo_navbar_section">
          <img
            src={require("../../../../Utils/Images/logo-invite-only.png")}
            alt=""
          />

          <button>Sign Up</button>
        </section>

        <section className="new_service_service_desc_container">
          {/* Service Banner in aspect ratio -------- */}
          <div style={{ paddingBottom: "50%" }}>
            <LazyLoadImage
              src={
                simg ?? (stype === "pdf"
                ? "https://anchors-assets.s3.amazonaws.com/1691823422033-Banner_PDF.png"
                : stype === "excel"
                ? "https://anchors-assets.s3.amazonaws.com/1691823734015-Banner_Excel.png"
                : "https://anchors-assets.s3.amazonaws.com/1691823741733-Banner_Video.png")
              }
              alt="servicebanner"
              style={{ borderRadius: "8px" }}
            />
          </div>

          <section>
            <div
              className="left_side_data_new_service_page"
              style={{
                maxWidth: "none",
                minWidth: "auto",
                width: "100%",
              }}
            >
              <h1
                className="text_type_01_new_service_page"
                style={{ fontSize: "20px" }}
              >
                {sname}
              </h1>

              <section className="action_points_new_service_page">
                <section style={{ fontSize: "10px", gap: "8px" }}>
                  {noOfPage !== "0" && <section>
                    <span style={{ gap: "4px" }}>
                      <img
                        src={DocIcon}
                        alt=""
                        style={{ height: "16px", width: "16px" }}
                      />{" "}
                      {noOfPage} Pages
                    </span>
                  </section>}
                </section>

                <div>
                  {/* <img src={FlagIcon} alt="" /> */}
                  <button
                    style={{
                      fontSize: "12px",
                      gap: "5px",
                      padding: "8px 10px",
                    }}
                  >
                    <BsWhatsapp /> Share
                  </button>
                </div>
              </section>

              <section
                className="description_section_new_service_page"
                style={{ gap: "20px", minHeight: "auto", padding: "16px 8px" }}
              >
                <div>
                  <h2
                    className="text_type_02_new_service_page"
                    style={{ fontSize: "16px" }}
                  >
                    Resource Description
                  </h2>
                  <p
                    className="text_type_03_new_service_page"
                    id="large_desc_service_page"
                    style={{ fontSize: "12px" }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptates iure aperiam repellat magni in obcaecati nemo
                    libero quos, eum, tempora provident, veritatis reiciendis
                    rerum inventore nihil laborum at eveniet nobis nesciunt. In
                    velit corporis, molestias, nisi exercitationem molestiae
                    atque odit dolorem eveniet sint maxime praesentium, sed
                    voluptates vero laborum commodi!
                  </p>
                </div>

                <div>
                  <h2
                    className="text_type_02_new_service_page"
                    style={{ fontSize: "16px" }}
                  >
                    Additional Information
                  </h2>
                  <p
                    className="text_type_03_new_service_page"
                    id="short_desc_service_page"
                    style={{ fontSize: "12px" }}
                  >
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Obcaecati illo culpa nobis vero fugit eius magnam eaque
                    architecto atque quaerat?
                  </p>
                </div>
              </section>
            </div>
          </section>
        </section>

        <section
          className="mobile_cta_section_new_service_page"
          style={{
            alignItems: "center",
            background: "#212121",
            bottom: "0",
            boxShadow: "0 -4px 8px 0 hsla(0,0%,100%,.1)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "16px",
            position: "absolute",
            width: "100%",
            zIndex: "999",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {paid === "Paid" && (
              <h3
                className="text_type_04_new_service_page"
                style={{ fontSize: "16px" }}
              >
                ₹ {ssp}
                <span style={{ marginLeft: "8px", fontSize: "16px" }}>
                  ₹
                </span>{" "}
                <span
                  style={{
                    textDecorationLine: "line-through",
                    fontSize: "16px",
                  }}
                >
                  {smrp}
                </span>
              </h3>
            )}
          </div>

          <button
            className="new_service_page_button_one"
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: "16px",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            {paid === "Paid" ? "Get Access" : "Free Access"}
            <AiOutlineArrowRight />
          </button>
        </section>
      </div>
    </div>
  );
};

export default CreateServiceDemo;
