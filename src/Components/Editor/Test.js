import React, { useContext, useEffect, useState } from "react";
import { linkedinContext } from "../../Context/LinkedinState";
import { atcb_action, atcb_init } from "add-to-calendar-button";
import { InlineShareButtons } from "sharethis-reactjs";
import { host } from "../../config/config";

import { useLinkedIn } from "react-linkedin-login-oauth2";
// You can use provided image shipped by this package or using your own
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import "./teststyle.css";

import "add-to-calendar-button/assets/css/atcb.css";
import { FormHelperText, Modal } from "@mui/material";
import PreviewDocument from "../Modals/PreviewDoc";
import Canvas from "./New UI/Create Services/Canvas";

function Test() {
  const { truecallerlogin, truecallervalue } = useContext(linkedinContext);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [imageLoading, setImageLoading] = useState(0);
  const handleClick = async () => {
    await truecallerlogin();
  };

  const handlewhatsappshare = async () => {
    window.open(
      `https://api.whatsapp.com/send?text=Checkout this Important resource -- ** at https://www.anchors.in/w/workshopname`,
      "MsgWindow",
      "width=100",
      "height=50"
    );
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Extract the authorization code from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    // Fetch access token from LinkedIn using the authorization code
    const fetchAccessToken = async () => {
      try {
        const response = await fetch(
          `${host}/login/api/linkedin/access-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: authorizationCode }),
          }
        );
        const data = await response.json();
        console.log(data);
        const accessToken = data.access_token;

        // Fetch user data from LinkedIn using the access token
        const response2 = await fetch("https://api.linkedin.com/v2/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userData = await response2.json();
        console.log(userData);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching LinkedIn data:", error);
      }
    };

    // Call the fetchAccessToken function if authorization code is available
    if (authorizationCode) {
      fetchAccessToken();
    }
  }, []);
  const generateImage = async () => {
    if (title.length < 5) {
      alert("title small than 5 bruh");
    } else {
      setImageLoading(1);
      const response = await fetch(`${host}/ai/generateImage`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          title: title,
        },
      });
      const json = await response.json();
      console.log(json);
      setUrl(json.img);
      setImageLoading(0);
    }
  };
  const [signedurl, setSignedUrl] = useState(null);
  const handlelinkedInshare = async () => {
    window.open(
      `http://www.linkedin.com/shareArticle?mini=true&url=https://anchors.in/w/how-to-make-custom-linkedin-share-button&title=How%20to%20make%20custom%20linkedin%20share%20button&summary=some%20summary%20if%20you%20want&source=stackoverflow.com`
    );
  };

  // popup preview
  const previewopen = (e) => {
    setShopPopup(true);
  };

  const { linkedInLogin } = useLinkedIn({
    clientId: "77dzwxk6dvh9ts",
    redirectUri: `http://localhost:3000/developer/test`,
    onSuccess: (code) => {
      console.log(code);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [showpopup, setShopPopup] = useState(false);
  console.log(signedurl);
  return (
    <>
      <div className="test">
        <div>
          <img
            onClick={linkedInLogin}
            src={linkedin}
            alt="Sign in with Linked In"
            style={{ maxWidth: "180px", cursor: "pointer" }}
          />
        </div>
        <div>
          {userData ? (
            <div>
              <h1>LinkedIn Data</h1>
              <p>
                Name: {userData.firstName} {userData.lastName}
              </p>
              <p>Email: {userData.emailAddress}</p>
              {/* Render other retrieved data from LinkedIn */}
            </div>
          ) : (
            <p>Loading LinkedIn data...</p>
          )}
        </div>
        {/* <PreviewDocument
          open={showpopup}
          onClose={() => {
            setShopPopup(false);
          }}
        />
        <button onClick={handleClick}>Login through Truecaller</button>
        <div className="response">
          <h1>{truecallervalue ? "something" : "nothing yet..."}</h1>
          <div>{truecallervalue?.success}</div>
          <h2>PHONE NO .. - {truecallervalue.userdata?.phoneNumbers}</h2>
          <p>
            NAME -{" "}
            {truecallervalue.userdata?.name?.first +
              " " +
              truecallervalue.userdata?.name?.last}
          </p>
          <p>EMAIL - {truecallervalue.userdata?.onlineIdentities?.email}</p>
        </div>
        <div></div>
        <div class="btn_wrap_share">
          <span>Share</span>
          <div class="container_buttons_share">
            <i onClick={handlelinkedInshare} class="fab fa-linkedin"></i>
            <i onClick={handlewhatsappshare} class="fab fa-whatsapp"></i>
          </div>
        </div>
        <div class="TN bzz aHS-YH">
          <div class="qj qr"></div>
          <div class="aio UKr6le">
            <span class="nU false">
              <a
                href="https://meet.google.com/new?hs=180&amp;authuser=0"
                target="_top"
                class="J-Ke n0"
                title="Start a meeting"
                aria-label="Start a meeting"
                draggable="false"
              >
                Start a meeting
              </a>
            </span>
          </div>
          <div className="nL aif"></div>
        </div>

        <div>
          <button onClick={() => previewopen()}>Preview Document</button>
        </div> */}

        {/* <div className="aiImage">
        <div>
          <input type="text" onChange={(e) => setTitle(e.target.value)}></input>
        </div>
        <button onClick={() => generateImage()}>Generate Image</button>
        <h1>{imageLoading === 1 ? "LOADING ......" : ""}</h1>
        {/** {imageLoading === 1
          ? ""
          : url.map((e, i) => {
              return <img src={e.url} alt="will come !!!" id={i} />;
            })}} 
        <img src={url} alt="will come !!!" />;
      </div> */}
        {/* <Canvas
          textToShow="List of Top 10 YouTube Channel for Coding"
          width="1200"
          height="450"
          imgBackground="https://www.anchors.in:5000/api/file/1670005634078--himanshu.bf15583cd698b88970c3.jpg"
          imgBack="../backgroundimg.png"
          creator_name="HIMANSHU SHEKHAR"
        />

        <a
          href="https://anchors-files.s3.ap-south-1.amazonaws.com/docs/1673505520670-Result_41621037.pdf"
          download="GFG"
        >
          Click Me
        </a> */}
      </div>
    </>
  );
}

export default Test;
