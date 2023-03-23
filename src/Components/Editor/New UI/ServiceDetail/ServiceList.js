import React, { useContext, useEffect, useState } from "react";
import "./ServiceList.css";
import ServiceContext from "../../../../Context/services/serviceContext";
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
import UserIcon from "./Icons/User.svg";
import CopyIcon from "./Icons/Copy.svg";
import ChartIcon from "./Icons/Chart-pie.svg";
import Option from "./Icons/Option.svg";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadTwo } from "../../../Modals/Loading";
import { Email_Model2 } from "../../../Modals/Email_Modal";
import ChangeStatusModal from "../../../Modals/ServiceSuccess/Modal2";
import { Button1 } from "../Create Services/InputComponents/buttons";

function ServiceDetailPage(props) {
  const [openLoading, setOpenLoading] = useState(false);
  const { services, getallservices, deleteService } =
    useContext(ServiceContext);
  const [revArray, setrevArray] = useState([]);
  const [selected, setSelected] = useState(0);
  const [dummyData, setdummyData] = useState(false);

  useEffect(() => {
    setOpenLoading(true);
    getallservices().then(() => {
      setSelected("all");
      setdummyData(services?.dummy);
      setOpenLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  // notification of the dummy data--------------------------------
  useEffect(() => {
    if (dummyData) {
      toast.info(
        "The data shown is Dummy Data, which will give you a brief hint of how your data will be represented",
        {
          autoClose: 5000,
        }
      );
    }
  }, [dummyData]);

  // no need of reversing the array of serices it is inverted from backend
  useEffect(() => {
    let list = services?.res;
    if (selected === "pdf") {
      setrevArray(
        list?.filter((e) => {
          return e?.stype === 0;
        })
      );
    } else if (selected === "excel") {
      setrevArray(
        list?.filter((e) => {
          return e?.stype === 1;
        })
      );
    } else if (selected === "video") {
      setrevArray(
        list?.filter((e) => {
          return e?.stype === 2;
        })
      );
    } else {
      setrevArray(list);
    }
  }, [services, selected]);

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
  const [openModel, setOpenModel] = useState(false); // change status modal -----------
  const [openModel2, setOpenModel2] = useState(false); // email modal -----------------------
  const [changeStatus, setChangeStatus] = useState(1); // current status of changed element --------------
  const [NotifyEmailSent, setNotifyEmailSent] = useState(false);
  const [currselected, setCurrSelected] = useState(null); // selected options of a service --------------

  const handleCheckClick = async (elem) => {
    setCurrSelected(elem);
    removeOptionPopup(); // removes popup ------------------------------
    props.progress(0);
    if (elem.status) {
      // means now it is checked ------------
      setChangeStatus(0);
      const success = await deleteService(elem._id, 0); // changing status of the service
      if (success) {
        setOpenModel(true);
        props.progress(100);
        elem.status = false; // manually changing its value--------------
      } else {
        toast.error("Some error occured", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      // means now it is unchecked-----------------
      setChangeStatus(1);
      const success = await deleteService(elem._id, 1);
      if (success) {
        setOpenModel(true);
        props.progress(100);
        elem.status = true; // manually changing its value--------------
      } else {
        toast.error("Some error occured", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}

      {/* Change Status Modal ----------------------------------------- */}

      {openModel && (
        <ChangeStatusModal
          toClose={() => {
            setOpenModel(false);
          }}
          url={currselected?.copyURL}
          ChangeStatusTo={changeStatus}
        />
      )}

      {/* Send Email Modal ----------------------------------------------- */}
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

      <div className="servicelist-wrapper" onClick={() => removeOptionPopup()}>
        <h1 className="headers_section_paymentInfo">My Content</h1>
        <span className="servicelist_wrap_span">
        Access and Manage your Content & Services
        </span>
        <div className="servicelist-categories">
          <div
            className={`servicelist-catItem ${
              selected === "all" && "selectedlist"
            }`}
            onClick={() => setSelected("all")}
          >
            All (
            {services?.typeDetails?.Document +
              services?.typeDetails?.Excel +
              services?.typeDetails?.Video}
            )
          </div>
          <div
            className={`servicelist-catItem ${
              selected === "pdf" && "selectedlist"
            }`}
            onClick={() => setSelected("pdf")}
          >
            PDF ({services?.typeDetails?.Document})
          </div>
          <div
            className={`servicelist-catItem ${
              selected === "excel" && "selectedlist"
            }`}
            onClick={() => setSelected("excel")}
          >
            Excel Sheets ({services?.typeDetails?.Excel})
          </div>
          <div
            className={`servicelist-catItem ${
              selected === "video" && "selectedlist"
            }`}
            onClick={() => setSelected("video")}
          >
            Videos ({services?.typeDetails?.Video})
          </div>
        </div>
        <div className="servicelist-linebreak"></div>
        <div className="servicelist-table">
          <TableContainer component={Paper}>
            <Table aria-aria-label="Services Table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">S.No</TableCell>
                  <TableCell align="center">Service Name</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Uploaded On</TableCell>
                  <TableCell align="center">Banner</TableCell>
                  <TableCell align="center">Downloads</TableCell>
                  <TableCell align="center">Analysis</TableCell>
                  <TableCell align="center">Short Link</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {revArray?.map((elem, i) => {
                  return (
                    <>
                      <TableRow>
                        <TableCell align="center">{i + 1}</TableCell>
                        <TableCell align="center">{elem.sname}</TableCell>
                        <TableCell align="center">
                          {elem.isPaid ? "Paid" : "Free"}
                        </TableCell>
                        <TableCell align="center">₹{elem.ssp}</TableCell>
                        <TableCell align="center">
                          <span className="servicelist_getdate">
                            <div> {getDatelist(elem.date)}</div>
                            <div> {getDatelist2(elem.date)}</div>
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <img
                            src={elem.simg}
                            className="servicelistbannerimg"
                            alt="service"
                          ></img>
                        </TableCell>
                        <TableCell align="center">
                          <span
                            className="servicelist_icon"
                            onClick={() => {
                              !dummyData &&
                                window.open(
                                  `/viewUserDetails/${elem.slug}`,
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
                        <TableCell align="center">
                          <span
                            className="servicelist_icon iconalign"
                            onClick={() => {
                              !dummyData &&
                                window.open(
                                  `/serviceStats/${elem.slug}`,
                                  "_blank"
                                );
                            }}
                          >
                            <img src={ChartIcon}></img>
                          </span>
                        </TableCell>
                        <TableCell align="center">
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
                        <TableCell align="center">
                          <span
                            className="servicelist_icon iconalign"
                            onClick={() =>
                              !dummyData && openOptionsPopup(i + 1)
                            }
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
                                    navigate(`/editservice/${elem.slug}/${elem?.stype === 2 ? "video" : elem?.stype === 1 ? "excel" : "pdf"}`);
                                  }}
                                >
                                  Edit Service
                                </div>
                                {/* <div
                                  className="modaloptions_servicelist"
                                  onClick={() => {
                                    setCurrSelected(elem);
                                    setOpenModel2(true);
                                  }}
                                >
                                  Notify Users
                                </div> */}
                                <div
                                  className="modaloptions_servicelist"
                                  onClick={() => {
                                    navigate(`/servicereviews/${elem?.slug}`);
                                  }}
                                >
                                  User Reviews
                                </div>
                                <div className="modaloptions_servicelist_status">
                                  Active Status
                                  <span onClick={() => handleCheckClick(elem)}>
                                    <label className="switch_type_01">
                                      <input
                                        id={`checkbox_${i + 1}`}
                                        type="checkbox"
                                        checked={elem.status}
                                      />
                                      <span className="slider_type_01 round_type_01"></span>
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

        {dummyData && <div className="cta_dummy_data">
        <span>this is dummy data , start creating your first service for your data</span>
        <Button1 text="Create your First Service" width="268px" onClick={()=>{navigate("/dashboard")}}/>
      </div>}

      </div>
      <ToastContainer />

      <SuperSEO title="Anchors - Services" />
    </>
  );
}

export default ServiceDetailPage;
