import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";

import InstagramIcon from "../../../../Utils/Icons/instagram.svg";
import fbIcon from "../../../../Utils/Icons/fb.svg";
import TelgramIcon from "../../../../Utils/Icons/telegram.svg";
import YoutubeIcon from "../../../../Utils/Icons/youtube.svg";
import topmateIcon from "../../../../Utils/Icons/topmate.svg";
import linkedinIcon from "../../../../Utils/Icons/linkedin.svg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PNGIMG from "../../../../Utils/Images/default_user.png";
import { RiStarSFill } from "react-icons/ri";

const PreviewDemo = (props) => {
    return (
      <div className="perview_demo_mobile_view_edit_profile">
        {/* <Navbar2 /> */}
  
        <div className="outerframe_new_creator_page">
          {/* main details sections ---------------- */}
          <section className="main_creator_details_creator_page">
            <LazyLoadImage
              src={props?.profile}
              alt={props?.name}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = PNGIMG;
              }}
            />
  
            <div>
              <h1 className="text_creator_profile_page-01">{props?.name}</h1>
              {props?.rating && (
                <span>
                  {" "}
                  <RiStarSFill
                    rSFill
                    size={18}
                    color="rgba(255, 214, 0, 1)"
                  />{" "}
                  {props?.rating}/5
                  <span>
                    {props?.fbs &&
                      props?.fbs.length !== 0 &&
                      `(${props?.fbs.length})`}
                  </span>
                </span>
              )}
              {window.screen.width > 600 && (
                <>
                  <p className="text_creator_profile_page-02">{props?.tagLine}</p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      width: "max-content",
                      gap: "20px",
                    }}
                  >
                    <div className="social-icons-new-creator-page">
                      {props?.linkedInLink?.length !== 0 && (
                        <div>
                          <img src={linkedinIcon} alt="" />
                        </div>
                      )}
  
                      {props?.fbLink?.length !== 0 && (
                        <div>
                          <img src={fbIcon} alt="" />
                        </div>
                      )}
  
                      {props?.instaLink?.length !== 0 && (
                        <div>
                          <img src={InstagramIcon} alt="" />
                        </div>
                      )}
  
                      {props?.teleLink?.length !== 0 && (
                        <div>
                          <img src={TelgramIcon} alt="" />
                        </div>
                      )}
  
                      {props?.ytLink?.length !== 0 && (
                        <div>
                          <img src={YoutubeIcon} alt="" />
                        </div>
                      )}
  
                      {props?.topmateLink?.length !== 0 && (
                        <div>
                          <img src={topmateIcon} alt="" />
                        </div>
                      )}
                    </div>
                    <button className="button01_new_crator_profile">
                      Request Resource
                    </button>{" "}
                  </div>
                </>
              )}
            </div>
          </section>
  
          {/* Deatils section for mobile --------- */}
          <section>
            <p className="text_creator_profile_page-02">{props?.tagLine}</p>
  
            <div className="social-icons-new-creator-page">
              {props?.linkedInLink?.length !== 0 && (
                <div
                  onClick={() => {
                    mixpanel.track("Linkedin redirect");
                    window.open(props?.linkedInLink);
                  }}
                >
                  <img src={linkedinIcon} alt="" />
                </div>
              )}
  
              {props?.fbLink?.length !== 0 && (
                <div
                  onClick={() => {
                    mixpanel.track("Fb redirect");
                    window.open(props?.fbLink);
                  }}
                >
                  <img src={fbIcon} alt="" />
                </div>
              )}
  
              {props?.instaLink?.length !== 0 && (
                <div
                  onClick={() => {
                    mixpanel.track("Instagram redirect");
                    window.open(props?.instaLink);
                  }}
                >
                  <img src={InstagramIcon} alt="" />
                </div>
              )}
  
              {props?.teleLink?.length !== 0 && (
                <div
                  onClick={() => {
                    mixpanel.track("Telegram redirect");
                    window.open(props?.teleLink);
                  }}
                >
                  <img src={TelgramIcon} alt="" />
                </div>
              )}
  
              {props?.ytLink?.length !== 0 && (
                <div
                  onClick={() => {
                    mixpanel.track("Youtube redirect");
                    window.open(props?.ytLink);
                  }}
                >
                  <img src={YoutubeIcon} alt="" />
                </div>
              )}
  
              {props?.topmateLink?.length !== 0 && (
                <div
                  onClick={() => {
                    mixpanel.track("Topmate redirect");
                    window.open(props?.topmateLink);
                  }}
                >
                  <img src={topmateIcon} alt="" />
                </div>
              )}
            </div>
  
            <button className="button01_new_crator_profile">
              Request Resource
            </button>
          </section>
  
          {/* About Section ------------- */}
          <section className="about_section_new_creator_profile">
            <h2 className="text_creator_profile_page-03">About</h2>
  
            <p
              className="text_creator_profile_page-04"
              id="about_creator_profile"
            ></p>
          </section>
        </div>
      </div>
    );
  };


export default PreviewDemo;