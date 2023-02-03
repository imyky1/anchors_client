import React, { useContext, useEffect, useState } from "react";
import "./ServiceList.css";
import ServiceContext from "../../../../Context/services/serviceContext";
import { Fragment } from "react";
import { SuperSEO } from "react-super-seo";
import {
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import Delete_Modal from "../../../Modals/DeleteModel";
import UserIcon from "./Icons/User.svg";
import CopyIcon from "./Icons/Copy.svg";
import ChartIcon from "./Icons/Chart-pie.svg";
import Option from "./Icons/Option.svg";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Email_Model1, Email_Model2 } from "../../../Modals/Email_Modal";

function ServiceDetailPage(props) {
  const [openLoading, setOpenLoading] = useState(false);
  const context = useContext(ServiceContext);
  const { services, getallservices } = context;
  const [revArray, setrevArray] = useState([]);
  const [selected, setSelected] = useState(0);
  let count = 0;

  useEffect(() => {
    setOpenLoading(true);
    getallservices().then(async () => {
      setOpenLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setrevArray(services?.res?.reverse());
  }, [services]);

  const [OpenOption, setOpenOption] = useState(0);

  const getDatelist = (date) => {
    let ll = date.slice(0, date.toString().length - 5);
    const datenew = ll.split("T");
    return datenew[0];
  };

  const getDatelist2 = (date) => {
    let ll = date.slice(0, date.toString().length - 5);
    const datenew = ll.split("T");
    return datenew[1];
  };
  const openOptionsPopup = (i) => {
    document.getElementById(`servicelist_options${i}`).style.display = "flex";
    setOpenOption(i);
  };
  const removeOptionPopup = () => {
    if (OpenOption !== 0) {
      revArray.map((elem, i) => {
        return (document.getElementById(
          `servicelist_options${i + 1}`
        ).style.display = "none");
      });
      document.getElementById(
        `servicelist_options${OpenOption}`
      ).style.display = "none";
      setOpenOption(0);
    }
  };
  const navigate = useNavigate();
  const [openModel, setOpenModel] = useState(false);
  const [openModel2, setOpenModel2] = useState(false);
  const [changeStatus, setChangeStatus] = useState(1);
  const [NotifyEmailSent, setNotifyEmailSent] = useState(false);
  const [currselected, setCurrSelected] = useState(null);

  const handleCheckClick = (elem) => {
    setCurrSelected(elem);
    if (elem.status) {
      // means now it is checked
      setChangeStatus(0);
      setOpenModel(true);
    } else {
      // means now it is unchecked
      setChangeStatus(1);
      setOpenModel(true);
    }
  };
  console.log(changeStatus);
  return (
    <>
      <div className="servicelist-wrapper" onClick={() => removeOptionPopup()}>
        <h1>My Content</h1>
        <span className="servicelist_wrap_span">
          Manage your all contents and services
        </span>
        <div className="servicelist-categories">
          <div className="servicelist-catItem selectedlist">All</div>
          <div className="servicelist-catItem">PDF</div>
          <div className="servicelist-catItem">Excel Sheets</div>
          <div className="servicelist-catItem">Videos</div>
        </div>
        <div className="servicelist-linebreak"></div>
        <div className="servicelist-table">
          <TableContainer component={Paper}>
            <Table aria-aria-label="Services Table">
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Uploaded On</TableCell>
                  <TableCell>Banner</TableCell>
                  <TableCell>Downloads</TableCell>
                  <TableCell>Analysis</TableCell>
                  <TableCell>Short Link</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {revArray?.map((elem, i) => {
                  return (
                    <>
                      <Delete_Modal
                        id={currselected?._id}
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
                        creatorID={currselected?.c_id}
                        serviceID={currselected?._id}
                        serviceName={currselected?.sname}
                        serviceSlug={currselected?.slug}
                        serviceCopyURL={currselected?.copyURL}
                        serviceBanner={currselected?.simg}
                      />
                      <TableRow>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{elem.sname}</TableCell>
                        <TableCell>{elem.isPaid ? "Paid" : "Free"}</TableCell>
                        <TableCell>₹{elem.ssp}</TableCell>
                        <TableCell>
                          <span className="servicelist_getdate">
                            <div> {getDatelist(elem.date)}</div>
                            <div> {getDatelist2(elem.date)}</div>
                          </span>
                        </TableCell>
                        <TableCell>
                          <img
                            src={elem.simg}
                            className="servicelistbannerimg"
                            alt="service"
                          ></img>
                        </TableCell>
                        <TableCell>
                          <span
                            className="servicelist_icon"
                            onClick={() => {
                              window.open(
                                `/viewusersdetails/${elem.slug}`,
                                "_blank"
                              );
                            }}
                          >
                            <img src={UserIcon}></img>
                            <span className="usericonservicelist">
                              {elem.downloads}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className="servicelist_icon iconalign"
                            onClick={() => {
                              window.open(
                                `/serviceStats/${elem.slug}`,
                                "_blank"
                              );
                            }}
                          >
                            <img src={ChartIcon}></img>
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className="servicelist_icon iconalign"
                            onClick={() => {
                              elem.copyURL
                                ? navigator.clipboard.writeText(
                                    `https://www.anchors.in/r/${elem.copyURL}`
                                  )
                                : navigator.clipboard.writeText(
                                    `https://www.anchors.in/s/${elem.slug}`
                                  );

                              toast.info("Copied link to clipboard", {
                                position: "top-center",
                                autoClose: 2000,
                              });
                            }}
                          >
                            <img src={CopyIcon}></img>
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className="servicelist_icon iconalign"
                            onClick={() => openOptionsPopup(i + 1)}
                          >
                            <img src={Option}></img>
                          </span>
                          <div
                            className="servicelist_optionspopup"
                            id={`servicelist_options${i + 1}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="servicelist_wrap">
                              <div className="servicelist_popuptop">
                                <div
                                  className="modaloptions_servicelist"
                                  onClick={() => {
                                    navigate(`/editservice/${elem.slug}`);
                                  }}
                                >
                                  Edit Service
                                </div>
                                <div
                                  className="modaloptions_servicelist"
                                  onClick={() => {
                                    setCurrSelected(elem);
                                    setOpenModel2(true);
                                  }}
                                >
                                  Notify Users
                                </div>
                                <div className="modaloptions_servicelist">
                                  User Reviews
                                </div>
                              </div>
                              <div className="servicelist_popupbottom">
                                <div className="servicelist_popupactive">
                                  Active Status
                                  <span onClick={() => handleCheckClick(elem)}>
                                    <label className="switch2">
                                      <input
                                        type="checkbox"
                                        id={`checkbox_${i + 1}`}
                                        checked={elem.status}
                                      />
                                      <span className="slider2 round2"></span>
                                    </label>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <ToastContainer />

      <SuperSEO title="Anchors - Services" />
    </>
  );
}

export default ServiceDetailPage;
