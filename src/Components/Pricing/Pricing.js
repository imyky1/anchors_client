import React,{useState,useEffect} from "react";
import "./Pricing.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer.js";
import mixpanel from "mixpanel-browser";
import { toast, ToastContainer } from "react-toastify";

function Pricing() {
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(false);
  const [platform, setPlatform] = useState("Choose Platform");
  const [followers, setFollowers] = useState();


  const handleChange = (e) => {
    setPlatform(e.target.value);
  };


  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Pricing Page")

  }, [])
  

  const handleCheckEligibility = () => {
    mixpanel.track("Clicked Check Eligibility on Anchors Main Page");
    if (platform !== "Choose Platform" && parseInt(followers) > 0) {
      mixpanel.track("Eligibility on Anchors Pricing Page",{
        platform:platform,
        followers:followers
      });
      if (platform === "youtube") {
        if (parseInt(followers) >= 5000) {
          setResult(true);
        } else {
          setResult(false);
        }
      } else if (platform === "insta") {
        if (parseInt(followers) >= 10000) {
          setResult(true);
        } else {
          setResult(false);
        }
      } else if (platform === "telegram") {
        if (parseInt(followers) >= 2000) {
          setResult(true);
        } else {
          setResult(false);
        }
      } else if (platform === "linkedin") {
        if (parseInt(followers) >= 10000) {
          setResult(true);
        } else {
          setResult(false);
        }
      }
      setShowResult(true);
    } else {
      toast.info("Fill all the mandatory fields", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <div className="main_pricing_container">
        <div className="mainpage_header creator_login_header ">
          <Link to="/" style={{textDecoration:"none",color:"unset"}}>
          <div className="logo" >
            <img src={require("../logo.png")} alt="Logo" />
            <span>anchors</span>
          </div></Link>
          <Link
            to={
              localStorage.getItem("jwtToken")
                ? "/dashboard"
                : "/login/creators"
            }
          >
            <button
              className="waitlist"
              style={{
                backgroundColor: "black",
                color: "white",
                border: "2px solid black",
              }}
            >
              {localStorage.getItem("jwtToken") &&
              localStorage.getItem("isUser") === ""
                ? "My Account"
                : "Login as Creator"}
            </button>
          </Link>
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

          <section className="checkeligibility eligibility_pricing"  id="eligibility">
            <h1>Stand out and get a chance to be an anchor</h1>
            <span>I am influencer/creator at</span>
            <div className="input_eligibility">
              <select value={platform} onChange={handleChange}>
                <option default disabled>
                  Choose Platform
                </option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">Youtube</option>
                <option value="telegram">Telegram</option>
                <option value="insta">Instagram</option>
              </select>
              <input
                type="number"
                placeholder="Number of Followers"
                value={followers}
                onChange={(e) => {
                  setFollowers(e.target.value);
                }}
              />
              <button onClick={handleCheckEligibility}>
                Check Eligibility
              </button>
            </div>
            {showResult ? (
              <div className="eligibilityresult">
                {result ? (
                  <>
                    <span style={{ color: "#0DD70D" }}>
                      Congratulation you are eligible to be an anchor
                    </span>
                    <button
                      onClick={() => {
                        navigate("/login/creators");
                      }}
                    >
                      Apply to be anchor
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ color: "#6A6161" }}>
                      oops, seems like you are not matched criteria to be anchor
                    </span>
                    <button
                      onClick={() => {
                        window.location =
                          "https://izsxcwa0cfw.typeform.com/to/R9poKEJD";
                      }}
                    >
                      Join wishlist
                    </button>
                  </>
                )}
              </div>
            ) : (
              ""
            )}
          </section>
        </div>
      </div>
      <Footer />
      <ToastContainer/>
    </>
  );
}

export default Pricing;
