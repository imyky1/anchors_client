import React, { useEffect, useState } from "react";
import "./Model.css";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import ServiceContext from "../../Context/services/serviceContext";
import { feedbackcontext } from "../../Context/FeedbackState";
import { userContext } from "../../Context/UserState";
import mixpanel from "mixpanel-browser";

function SocialProof({ open, onClose, sid, cid, type, slug }) {
  const [downloads, setDownloads] = useState();
  const [User, setUser] = useState();
  const [rating, setrating] = useState();
  const { getOneHourDownloads } = useContext(ServiceContext);
  const { getRatingCreator } = useContext(feedbackcontext);
  const { lastUser } = useContext(userContext);

  useEffect(() => {
    if (sid) {
      getOneHourDownloads(sid).then((e) => {
        setDownloads(e);
      });
      lastUser(sid).then((e) => {
        if (e.success) {
          setUser(e.user);
        }
      });
    }
  }, [sid]);

  useEffect(() => {
    if (cid) {
      getRatingCreator(cid).then((e) => {
        setrating(e);
      });
    }
  }, [cid]);

  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 3200);
  }, [open]);

  useEffect(() => {
    if (downloads < 40) {
      setDownloads(parseInt(downloads) + 55);
    }
  }, [downloads]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="proof_box">
        <span>
          <img className="proof_img" src={require("../logo.png")} alt="" />
        </span>
        <div className="proof_box_content">
          <p>
            <span>
              {type === "1" ||
              User?.name?.length === 0 ||
              rating?.length === 0 ? (
                downloads
              ) : type === "2" ? (
                rating
              ) : (
                <img className="proof_user_name" src={User?.photo} />
              )}{" "}
            </span>
            &nbsp;
            {type === "1" ? (
              "+ downloads in the last hour"
            ) : type === "2" ? (
              "/ 5 is creator's average rating"
            ) : (
              <>
                <span>
                  {User?.name.length > 15
                    ? User?.name.slice(0, 10) + ".."
                    : User?.name}
                </span>
                &nbsp; downloaded service recently
              </>
            )}
          </p>
          <i
            class="fa-solid fa-circle-xmark"
            onClick={() => {
              mixpanel.track("Closed the social proof by cross button", {
                service: slug,
              });
              onClose();
            }}
          ></i>
        </div>
      </div>
    </>
  );
}

export default SocialProof;
