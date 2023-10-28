import React, { useContext, useEffect, useMemo, useState } from "react";
import "./Users.css";
import ServiceContext from "../../../../Context/services/serviceContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { creatorContext } from "../../../../Context/CreatorState";
import { LoadTwo } from "../../../Modals/Loading";
import { SuperSEO } from "react-super-seo";
import Moment from "moment";
import { BsArrowLeftShort, BsArrowRight } from "react-icons/bs";
import { SlGraph } from "react-icons/sl";
import { Table1 } from "../Create Services/InputComponents/fields_Labels";
import { IoCopyOutline } from "react-icons/io5";
import { toast } from "react-toastify";

function Users(props) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getUserDetails, allUserDetails } = useContext(creatorContext);
  const { serviceInfo, getserviceinfo, compareJWT, geteventinfo, eventInfo } =
    useContext(ServiceContext);
  const [openLoading, setopenLoading] = useState(false);
  const [serviceType, setServiceType] = useState();
  const [approvedUser, setapprovedUser] = useState(false); // check if user searching is appropriate

  // custom hook to get querries
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();

  // Checking if the user is only able to check its data not others-------------------
  useEffect(() => {
    props.progress(0);
    if (query.get("type") === "event") {
      setServiceType("event");
      geteventinfo(slug).then((e) => {
        compareJWT(e[0]?._id).then((e) => {
          if (e) {
            setapprovedUser(true);
            props.progress(100);
          } else {
            navigate("/dashboard/mycontents");
          }
        });
      });
    } else {
      setServiceType("download");
      getserviceinfo(slug).then((e) => {
        compareJWT(e[0]?._id).then((e) => {
          if (e) {
            setapprovedUser(true);
            props.progress(100);
          } else {
            navigate("/dashboard/mycontents");
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    setopenLoading(true);
    getUserDetails(
      serviceType === "download"
        ? serviceInfo?.service?._id
        : eventInfo?.event?._id,
      serviceType
    ).then((e) => {
      setopenLoading(false);
    });
  }, [serviceType === "download" ? serviceInfo : eventInfo]);

  const renderdate1 = (date) => {
    let a = new Date(date);
    let b = a.toISOString();
    const splity = b.split("T");
    return splity[0];
  };

  const renderdate2 = (date) => {
    let a = new Date(date);
    let b = a.toISOString();
    const splity = b.split("T");
    return splity[1].slice(0, 8);
  };

  const date = Moment(
    serviceType === "download"
      ? serviceInfo?.service?.date
      : eventInfo?.event?.createdOn
  )
    .format()
    .split("T")[0];

  const time =
    serviceType === "download"
      ? Moment(serviceInfo?.service?.date).format().split("T")[1].split("+")[0]
      : Moment(eventInfo?.event?.createdOn)
          .format()
          .split("T")[1]
          .split("+")[0];

  // hides the email -----------------------
  // const hiddenEmail = (email) => {
  //   let email2 =
  //     email?.split("@")[0].length > 6
  //       ? email?.split("@")[0].substr(0, 5) + "....@" + email?.split("@")[1]
  //       : email?.split("@")[0].substr(0, 3) + "....@" + email?.split("@")[1];

  //   return email2;
  // };
  const totalAmount = allUserDetails.reduce(
    (acc, ele) => acc + (ele?.amount || 0),
    0
  );

  return (
    <>
      {(openLoading || !approvedUser) && <LoadTwo open={openLoading} />}

      {/* it can be seen only if the user is approved ----------------------------- */}
      {approvedUser && (
        <div className="servicelist-wrapper">
          {/* MObile ui navbar ---------------- */}
          {window.screen.width < 600 && (
            <section className="navbar_ui_covering_section_mobile_active">
              <BsArrowLeftShort
                size={22}
                onClick={() => {
                    navigate(-1)
                }}
              />
              User List for {serviceType === "event" ? "Event" : "Service"}
            </section>
          )}

          {window.screen.width > 600 && (
            <section
              className="service_stats_page_title_section"
              style={{ marginBottom: "20px" }}
            >
              <h1>
                User List for {serviceType === "event" ? "Event" : "Service"}
              </h1>

              <button
                onClick={() => {
                  toast.info("Copied link successfully", {
                    position: "top-center",
                    autoClose: 1000,
                  });
                  navigator.clipboard.writeText(
                    serviceType === "download"
                      ? serviceInfo?.service?.copyURL
                      : eventInfo?.event?.copyURL
                  );
                }}
              >
                <IoCopyOutline size={20} /> Tracking link
              </button>
            </section>
          )}
          <div className="serivce_heading_00">
            <div className="serivce_heading_01">
              <img
                src={
                  serviceType === "download"
                    ? serviceInfo?.service?.simg
                    : eventInfo?.event?.simg
                }
              />
              <div className="serivce_heading_02">
                <section>
                  <span>
                    {" "}
                    {serviceType === "download"
                      ? serviceInfo?.service?.sname
                      : eventInfo?.event?.sname}
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "400" }}>
                    {date + " " + time}
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "400" }}>
                    {serviceType === "download"
                      ? serviceInfo?.service?.isPaid
                        ? "Paid" + ` (₹ ${serviceInfo?.service?.ssp})`
                        : "Free"
                      : "₹ " + eventInfo?.event?.ssp}
                  </span>
                </section>
                <div className="serivce_heading_03">
                  <button
                    onClick={() => {
                      serviceType === "download"
                        ? navigate(
                            `/dashboard/serviceStats/${slug}?type=download`
                          )
                        : navigate(
                            `/dashboard/serviceStats/${slug}?type=event`
                          );
                    }}
                  >
                    <SlGraph />
                    Detailed {serviceType === "event"
                      ? "Event"
                      : "Service"}{" "}
                    Analysis
                  </button>
                  <span
                    onClick={() => {
                      serviceType === "download"
                        ? window.open(`/s/${slug}`)
                        : window.open(`/e/${slug}`);
                    }}
                  >
                    {serviceType === "download"
                      ? "Service Details"
                      : "Event Details"}
                    <BsArrowRight style={{ paddingLeft: "8px" }} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="userrequest-table">
            <Table1
              headArray={
                (
                  serviceType === "download"
                    ? serviceInfo?.service?.isPaid
                    : eventInfo?.event?.isPaid
                )
                  ? [
                      "Sr.No",
                      "Name",
                      "Email ID",
                      "Location",
                      "Amount Paid",
                      serviceType === "download"
                        ? "Accessed on"
                        : "Registered on",
                    ]
                  : [
                      "Sr.No",
                      "Name",
                      "Location",
                      "Amount Paid",
                      serviceType === "download"
                        ? "Accessed on"
                        : "Registered on",
                    ]
              }
              bodyArray={allUserDetails?.map((elem, i) => {
                return (
                  serviceType === "download"
                    ? serviceInfo?.service?.isPaid
                    : eventInfo?.event?.isPaid
                )
                  ? [
                      i + 1,
                      elem?.userID?.name ? elem?.userID?.name : "--",
                      elem?.userID?.email
                        ? elem?.userID?.email?.slice(0, 4) +
                          ".....@" +
                          elem?.userID?.email?.split("@")[1]
                        : "---",
                      elem?.userID?.location?.city
                        ? elem?.userID?.location?.city
                        : "---",
                      elem?.amount,
                      <span>
                        {renderdate1(elem?.orderDate)}
                        <br></br>
                        {renderdate2(elem?.orderDate)}
                      </span>,
                    ]
                  : [
                      i + 1,
                      elem?.userID?.name ? elem?.userID?.name : "--",
                      elem?.userID?.location?.city
                        ? elem?.userID?.location?.city
                        : "---",
                      elem?.amount,
                      <span>
                        {renderdate1(elem?.orderDate)}
                        <br></br>
                        {renderdate2(elem?.orderDate)}
                      </span>,
                    ];
              })}
              gridConfig={
                (
                  serviceType === "download"
                    ? serviceInfo?.service?.isPaid
                    : eventInfo?.event?.isPaid
                )
                  ? "6% 21% 25% 19% 15% 12%"
                  : "12% 25% 25% 23% 15%"
              }
            />

            {/* <TableContainer component={Paper}>
              <Table>
                <TableHead style={{ background: "#282828" }}>
                  <TableRow>
                    <TableCell align="center">S.No</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Email ID</TableCell>
                    <TableCell align="center">Location</TableCell>
                    <TableCell align="center">Amount Paid</TableCell>
                    <TableCell align="center">
                      {serviceType === "download" ? "Ordered" : "Registered"} on
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ background: "#212121", color: "#D0D0D0" }}>
                  {allUserDetails?.length !== 0
                    ? allUserDetails?.map((elem, i) => {
                        return (
                          <>
                            <TableRow key={i}>
                              <TableCell align="center" color="#D0D0D0">
                                {i + 1}
                              </TableCell>
                              <TableCell align="center" color="#D0D0D0">
                                {elem?.userID?.name ? elem?.userID?.name : "--"}
                              </TableCell>
                              <TableCell align="center" color="#D0D0D0">
                                {elem?.userID?.email >= 1
                                  ? elem?.userID?.email
                                  : "---"}
                              </TableCell>
                              <TableCell align="center">
                                {elem?.userID?.location?.city
                                  ? elem?.userID?.location?.city
                                  : "---"}
                              </TableCell>
                              <TableCell align="center">
                                {elem?.amount}
                              </TableCell>
                              <TableCell align="center">
                                {renderdate1(elem?.orderDate)}
                                <br></br>
                                {renderdate2(elem?.orderDate)}
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })
                    : ""}
                </TableBody>
              </Table>
            </TableContainer> */}
          </div>
        </div>
      )}
      <SuperSEO title="Anchors - User Downloads" />
    </>
  );
}

export default Users;
