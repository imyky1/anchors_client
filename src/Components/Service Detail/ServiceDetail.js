import React, { useState, useEffect } from "react";
import "./ServiceDetail.css";
import Moment from "moment";
import { host } from "../../config/config";
import Delete_Model from "../Modals/DeleteModel";
import { Link, useNavigate } from "react-router-dom";
import { Email_Model2 } from "../Modals/Email_Modal";
import { toast } from "react-toastify";
import { useContext } from "react";
import { emailcontext } from "../../Context/EmailState";
import { LazyLoadImage } from 'react-lazy-load-image-component';

function ServiceDetail(props) {
  const { checkEmailSent } = useContext(emailcontext); // to check for notify emails
  const navigate = useNavigate();
  const [openModel, setOpenModel] = useState(false);
  const [openModel2, setOpenModel2] = useState(false);
  const [changeStatus, setChangeStatus] = useState(1);
  const [NotifyEmailSent, setNotifyEmailSent] = useState(false); // false means --- Notify email not sent
  const date = Moment(props.service.date).format().split("T")[0];
  const time = Moment(props.service.date).format().split("T")[1].split("+")[0];

  const getDownload = async () => {
    await fetch(`${host}/api/services/getDownloads/${props.service._id}`);
  };

  useEffect(() => {
    const doc = document.getElementById(`checkbox_${props.sno}`);
    if (doc && props.service.status === 1) {
      doc.checked = true;
    } else {
      doc.checked = false;
    }
    // eslint-disable-next-line
  }, [openModel]);
  
  useEffect(() => {
    getDownload();
    checkEmailSent(props.service._id, "Notify").then((e) => {
      setNotifyEmailSent(e);
    });
  }, []);

  const handleCheckClick = () => {
    const doc = document.getElementById(`checkbox_${props.sno}`);
    if (doc.checked) {
      // means now it is checked
      setChangeStatus(1);
      setOpenModel(true);
    } else {
      // means now it is unchecked
      setChangeStatus(0);
      setOpenModel(true);
    }
  };

  return (
    <>
      <div className="serv_details">
        <span>{props.sno}</span>
        <span>{props.service.sname}</span>
        <span>{props.service.isPaid === true ? "Paid" : "Free"}</span>
        <span>{props.service.ssp}</span>
        <span>
          {date}
          <br />
          {time}
        </span>
        <span>
          <LazyLoadImage className="serv_banner" effect="blur" src={props.service.simg} alt="..." />
        </span>
        <span className="text-center">{props.service.downloads}</span>
        {NotifyEmailSent ? (
          <span>Email<br/> Sent</span>
        ) : (
          <span
            className="serv_email"
            onClick={() => {
              setOpenModel2(true);
            }}
          >
            <a>Notify<br/> Users</a>
          </span>
        )}
        <Link to={`/s/${props.service.slug}`}>Visit here</Link>
        <span className="display_action_icons">
          {/* <div
            className="delete_serv"
            onClick={() => {
              setOpenModel(true);
            }}
          >
            <i className="fa-solid fa-trash-can fa-lg"></i>
            <span>Delete</span>
          </div> */}
          <div
            className="delete_serv"
            onClick={() => {
              {
                props.service.copyURL
                  ? navigator.clipboard.writeText(
                      `https://www.anchors.in/r/${props.service.copyURL}`
                    )
                  : navigator.clipboard.writeText(
                      `https://www.anchors.in/s/${props.service.slug}`
                    );
              }
              toast.info("Copied link to clipboard", {
                position: "top-center",
                autoClose: 2000,
              });
            }}
          >
            <i className="fa-solid fa-copy fa-lg delete_serv"></i>
            <span>
              Copy
              <br /> Link
            </span>
          </div>
          <div
            className="delete_serv"
            onClick={() => {
              navigate(`/editservice/${props.service.slug}`);
            }}
          >
            <i className="fa-solid fa-pen-to-square fa-lg delete_serv"></i>
            <span>Edit</span>
          </div>
          <div
            className="delete_serv"
            onClick={() => {
              window.open(`/serviceStats/${props.service.slug}`,'_blank');
            }}
          >
            <i class="fa-solid fa-chart-simple fa-lg delete_serv"></i>
            <span>Stats</span>
          </div>
          {/* <i class="fa-solid fa-envelope fa-lg delete_serv" onClick={() => {
              setOpenModel2(true);
            }}></i> */}
        </span>
        <span onClick={handleCheckClick}>
          <label className="switch">
            <input type="checkbox" id={`checkbox_${props.sno}`} />
            <span className="slider round"></span>
          </label>
        </span>
      </div>
      <Delete_Model
        id={props.service._id}
        status={changeStatus}
        open={openModel}
        progress={props.progress}
        onClose={() => {
          setOpenModel(false);
        }}
      />
      <Email_Model2
        open={openModel2}
        progress={props.progress}
        onClose={() => {
          setOpenModel2(false);
        }}
        creatorID={props.service.c_id}
        serviceID={props.service._id}
        serviceName={props.service.sname}
        serviceSlug={props.service.slug}
        serviceCopyURL={props.service.copyURL}
        serviceBanner={props.service.simg}
      />
    </>
  );
}

export default ServiceDetail;
