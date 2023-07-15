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
import { AiOutlinePlus } from "react-icons/ai";
import mixpanel from "mixpanel-browser";

function ServiceDetailPage(props) {
  const [openLoading, setOpenLoading] = useState(false);
  const { services, getallservices, deleteService } =
    useContext(ServiceContext);
  const [revArray, setrevArray] = useState([]);
  const [selected, setSelected] = useState(0);
  const [dummyData, setdummyData] = useState({ServiceDummy:false,EventDummy:false});

  useEffect(() => {
    setOpenLoading(true);
    getallservices().then(() => {
      setSelected("all");
      setOpenLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  // no need of reversing the array of serices it is inverted from backend
  useEffect(() => {
    setdummyData({ServiceDummy:services?.Servicedummy,EventDummy:services?.Eventdummy});
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
    } else if (selected === "events") {
      setrevArray(services?.events);
    } else {
      setrevArray(list);
    }
  }, [services, selected]);

  const [OpenOption, setOpenOption] = useState(0);

  const getDatelist = (date) => {
    let ll = date?.slice(0, date.toString().length - 5);
    const datenew = ll?.split("T");
    if(datenew){
      return datenew[0];
    }
  };

  const getDatelist2 = (date) => {
    let ll = date?.slice(0, date.toString().length - 5);
    const datenew = ll?.split("T");
    if(datenew){
      return datenew[1];
    }
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
  const [currselected, setCurrSelected] = useState(null); // selected options of a which service / event --------------

  const handleCheckClick = async (elem) => {
    setCurrSelected(elem);
    removeOptionPopup(); // removes popup ------------------------------
    props.progress(0);
    if (elem.status) {
      // means now it is checked ------------
      setChangeStatus(0);
      const success = await deleteService(elem._id, 0 , selected === "events" ? "event" : "document"); // changing status of the service / eevent
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
      const success = await deleteService(elem._id, 1 , selected === "events" ? "event" : "document");
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
          <div
            className={`servicelist-catItem ${
              selected === "events" && "selectedlist"
            }`}
            onClick={() => setSelected("events")}
          >
            Events ({services?.typeDetails?.Events})
          </div>
        </div>
        <div className="servicelist-linebreak"></div>
        <div className="servicelist-table">
          <TableContainer component={Paper}>
            <Table aria-aria-label="Services Table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">S.No</TableCell>
                  <TableCell align="center">{selected === "events" ? "Event Name" : "Service Name"}</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Uploaded On</TableCell>
                  <TableCell align="center">Banner</TableCell>
                  <TableCell align="center">{selected === "events" ? "Registrations" : "Downloads"}</TableCell>
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
                        <TableCell
                          align="center"
                          onClick={() => {
                            selected === "events" ?
                            window.open(`/e/${elem?.slug}`) :
                            window.open(`/s/${elem?.slug}`);
                          }}
                          style={{ cursor: "pointer" }}
                          onMouseOver={(e) => {
                            e.target.style.color = "blue";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.color = "black";
                          }}
                        >
                          {elem.sname}
                        </TableCell>
                        <TableCell align="center">
                          {elem.isPaid ? "Paid" : "Free"}
                        </TableCell>
                        <TableCell align="center">₹{elem.ssp}</TableCell>
                        <TableCell align="center">
                          <span className="servicelist_getdate">
                            <div> {getDatelist(selected === "events" ? elem.createdOn : elem.date)}</div>
                            <div> {getDatelist2(selected === "events" ? elem.createdOn : elem.date)}</div>
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {selected === "events" && elem.simg === "" ?
                          "--" :
                          <img
                          src={elem?.simg && elem?.simg}
                          className="servicelistbannerimg"
                          alt="service"
                          ></img>
                        }
                        </TableCell>
                        <TableCell align="center">
                          <span
                            className="servicelist_icon"
                            onClick={() => {
                              mixpanel.track("Downloads");
                              selected === "events" ? 
                              (!dummyData.EventDummy && elem.registrations !== 0 && 
                              window.open(
                                `/dashboard/viewUserDetails/${elem?.slug}?type=event`,
                                "_blank"
                              ) )
                              :
                              (!dummyData.ServiceDummy &&
                                elem.downloads !== 0 &&
                                window.open(
                                  `/dashboard/viewUserDetails/${elem?.slug}`,
                                  "_blank"
                                ))
                            }}
                          >
                            <img src={UserIcon}></img>
                            <span className="usericonservicelist">
                              {selected === "events" ? elem?.registrations : elem?.downloads}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <span
                            className="servicelist_icon iconalign"
                            onClick={() => {
                              mixpanel.track("Analysis");
                              console.log(`/serviceStats/${elem?.slug}?type=event`)
                              selected === "events" ? 
                              (!dummyData.EventDummy && 
                                window.open(
                                  `/dashboard/serviceStats/${elem?.slug}?type=event`,
                                  "_blank"
                                ))
                              :
                              (!dummyData.ServiceDummy &&
                                window.open(
                                  `/dashboard/serviceStats/${elem?.slug}`,
                                  "_blank"
                                ))
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
                                ? elem.copyURL.length > 7
                                  ? navigator.clipboard.writeText(elem.copyURL)
                                  : navigator.clipboard.writeText(
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
                              selected === "events" ?  !dummyData.EventDummy && openOptionsPopup(i + 1) : !dummyData.ServiceDummy && openOptionsPopup(i + 1)
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
                                    selected === "events" ?
                                    navigate(`/dashboard/editevent/${elem.slug}`) :
                                    navigate(
                                      `/dashboard/editservice/${elem.slug}/${
                                        elem?.stype === 2
                                          ? "video"
                                          : elem?.stype === 1
                                          ? "excel"
                                          : "pdf"
                                      }`
                                    );
                                  }}
                                >
                                  Edit {selected === "events" ? "Event" : "Service"}
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
                                {selected !== "events" && <div
                                  className="modaloptions_servicelist"
                                  onClick={() => {
                                    selected === "events" ? navigate(`/dashboard/servicereviews/${elem?.slug}?type=event`) : navigate(`/dashboard/servicereviews/${elem?.slug}`);
                                  }}
                                >
                                  User Reviews
                                </div>}
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

        {(selected === "events" ? dummyData?.EventDummy : dummyData?.ServiceDummy) && (
          <div className="cta_dummy_data">
            <span>
              This is sample data , start creating your first {selected === "events" ? "event" : "service"} for your
              data
            </span>
            <Button1
              text={selected === "events" ? "Create your First Event" : "Create your First Service"}
              icon={<AiOutlinePlus size={18} width={30} />}
              width="268px"
              onClick={() => {
                navigate("/dashboard");
              }}
            />
          </div>
        )}
      </div>
      <ToastContainer />

      <SuperSEO title="Anchors - Services" />
    </>
  );
}

export default ServiceDetailPage;
