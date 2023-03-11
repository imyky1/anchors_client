import React,{useState,useEffect} from "react";
import "./Pricing.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer.js";
import mixpanel from "mixpanel-browser";
import { toast, ToastContainer } from "react-toastify";
import { SuperSEO } from "react-super-seo";
import Modal2 from "../Modals/ModalType01/Modal2";
import Modal1 from "../Modals/ModalType01/Modal1";

function Pricing() {
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(false);
  const [platform, setPlatform] = useState("Choose Platform");
  const [followers, setFollowers] = useState();
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalFail, setOpenModalFail] = useState(false);



  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Pricing Page")

  }, [])
  

  const handleCheckEligibility = () => {
    if (platform !== 0 && followers !== "") {
      mixpanel.track("Clicked Check Eligibility on Pricing Page",{
        platform : platform === 1 ? "Linkedin" : platform === 2 ? "Youtube" : platform === 3 ? "Telegram" : platform === 4 ? "Instagram" : "None",
        followers 
      });
      switch (platform) {
        case 1:
          if (parseInt(followers) >= 10000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        case 2:
          if (parseInt(followers) >= 5000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        case 3:
          if (parseInt(followers) >= 2000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        case 4:
          if (parseInt(followers) >= 10000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
    <Modal1
        open={openModalSuccess}
        toClose={() => {
          setOpenModalSuccess(false);
          setPlatform(0);
          setFollowers("");
        }}
      />
      <Modal2
        open={openModalFail}
        toClose={() => {
          setOpenModalFail(false);
          setPlatform(0);
          setFollowers("");
        }}
      />
      <div className="main_pricing_container">
        <div className="pricing_header_section ">
          <Link to="/" style={{textDecoration:"none",color:"unset"}}>
          <div className="logo" >
            <img src={require("../logo.png")} alt="Logo" />
            <span>anchors</span>
            <p className="beta_tagname">Beta</p>
          </div></Link>

          <button
            className="login_creator_mainpage"
            style={{backgroundColor:"#3c3a3a"}}
            onClick={() => {
              mixpanel.track("Clicked Creator's Login on Main Page");
              localStorage.getItem("jwtToken") ? navigate("/dashboard") : navigate("/login/creators");
            }}
          >
            {localStorage.getItem("jwtToken") ? "My Account" : "Creator's Login"}
          </button>
        </div>

      
        <div className="pricing_section">
          <div className="pricing_container_one">
            <span>Our pricing is</span>
            <h1>As simple as pie.</h1>
            <section>
              <button>
                <i class="fa-solid fa-circle-xmark fa-lg"></i> No monthly Cost
              </button>
              <button>
                <i class="fa-solid fa-circle-xmark fa-lg"></i> No Setup Cost
              </button>
            </section>
            <h2>We only charge when you make money</h2>
          </div>
          <div className="pricing_container_two">
            <div>
              <li>
                <i class="fa-solid fa-circle-check"></i> Unlimited Free/Paid
                services
              </li>
              <li>
                <i class="fa-solid fa-circle-check"></i> Collect Payment
              </li>
              <li>
                <i class="fa-solid fa-circle-check"></i> Premium Template
              </li>
              <li>
                <i class="fa-solid fa-circle-check"></i> Performance Detailed
                Analysis
              </li>
              <li>
                <i class="fa-solid fa-circle-check"></i> Communicate with your
                audience
              </li>
            </div>
            <div>
              <h1 className="pricing_header1">10%</h1>
              <span className="pricing_header2">of revenue*</span>
            </div>
          </div>
          <div className="pricing_container_three">
            <div>
              <div>
                <h1 className="pricing_header1">1%</h1>
                <span className="pricing_header2">of revenue*</span>
              </div>
              <h3>Only for first 10 Anchor</h3>
            </div>
            <div>
              <a href="#eligibility">
                <button>
                  Check Eligibility{" "}
                  <i class="fa-solid fa-arrow-right-long fa-l"></i>
                </button>
              </a>
            </div>
          </div>

         {/* join and eligibility section */}
        <section className="eligibility_mainpage" id="eligibility" style={{color:"black"}}>
          <h1 className="headers1_mainpage">Join our team as an anchor</h1>
          <p style={{color:"black"}}>
            Unlocking the full potential of the creator economy through
            boundless innovation and sustainable growth
          </p>
          <span style={{color:"black"}}>Choose a platform </span>
          <div className="eligibility_check_section">
            <section>
              <span
                className={platform === 1 && "active_platform"}
                onClick={() => {
                  setPlatform(1);
                }}
              >
                <i class="fa-brands fa-linkedin-in fa-2x"></i>
              </span>
              <span
                className={platform === 2 && "active_platform"}
                onClick={() => {
                  setPlatform(2);
                }}
              >
                <i class="fa-brands fa-youtube fa-2x"></i>
              </span>
              <span
                className={platform === 3 && "active_platform"}
                onClick={() => {
                  setPlatform(3);
                }}
              >
                <i class="fa-brands fa-telegram fa-2x"></i>
              </span>
              <span
                className={platform === 4 && "active_platform"}
                onClick={() => {
                  setPlatform(4);
                }}
              >
                <i class="fa-brands fa-instagram fa-2x"></i>
              </span>
            </section>
            <input
              type="text"
              placeholder="Number of followers"
              value={followers}
              onChange={(e) => {
                setFollowers(e.target.value);
              }}
              style={{color:"black"}}
            />
          </div>
          <button onClick={handleCheckEligibility} style={{backgroundColor:"transparent"}}>
            {window.screen.width < 600
              ? "Let’s Get Started"
              : "Check Eligibility"}
          </button>
        </section>
        </div>
      </div>
      <Footer />
      <ToastContainer/>
      <SuperSEO
        title="Anchors - Pricing"
      />
    </>
  );
}

export default Pricing;
