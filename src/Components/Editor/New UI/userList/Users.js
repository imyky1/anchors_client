import React, { useContext, useEffect, useMemo, useState } from "react";
import "./Users.css";
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Table,
  TableRow,
} from "@mui/material";
import ServiceContext from "../../../../Context/services/serviceContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { creatorContext } from "../../../../Context/CreatorState";
import { LoadTwo } from "../../../Modals/Loading";
import { SuperSEO } from "react-super-seo";
import Moment from "moment";

function Users(props) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getUserDetails, allUserDetails } = useContext(creatorContext);
  const {
    serviceInfo,
    getserviceinfo,
    compareJWT,
    geteventinfo,
    eventInfo,
  } = useContext(ServiceContext);
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
      serviceType === "download" ? serviceInfo?.service?._id : eventInfo?.event?._id,
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
  const hiddenEmail = (email) => {
    let email2 =
      email?.split("@")[0].length > 6
        ? email?.split("@")[0].substr(0, 5) + "....@" + email?.split("@")[1]
        : email?.split("@")[0].substr(0, 3) + "....@" + email?.split("@")[1];

    return email2;
  };

  return (
    <>
      {(openLoading || !approvedUser) && <LoadTwo open={openLoading} />}

      {/* it can be seen only if the user is approved ----------------------------- */}
      {approvedUser && (
        <div className="servicelist-wrapper">
          <div className="servicestat_heading">
            <div className="servicestat_leftheading">
              <h1 style={{margin:"5px"}}>List of users</h1>
              <span className="servicelist_wrap_span">
              List of users who have {serviceType === "download" ? "accessed the Service" : "registered for the Event"}
              </span>
              <div className="servicestat_product" style={{marginTop:"40px"}}>
                <div className="servicestat_span1">
                  {serviceType === "event" ? "Event" : "Service"} Name:
                </div>
                <span className="servicestat_span2">
                  {serviceType === "download"
                    ? serviceInfo?.service?.sname
                    : eventInfo?.event?.sname}
                </span>
              </div>
              <div className="servicestat_product">
                <div className="servicestat_span1">
                  {serviceType === "event" ? "Event" : "Service"} Created on:
                </div>
                <span className="servicestat_span2"> {date + " " + time}</span>
              </div>
              <div className="servicestat_product">
                <div className="servicestat_span1">Amount:</div>
                <span className="servicestat_span2">
                  {serviceType === "download"
                    ? serviceInfo?.service?.isPaid
                      ? "Paid" + ` (₹ ${serviceInfo?.service?.ssp})`
                      : "Free"
                    : "₹ " + eventInfo?.event?.ssp}
                </span>
              </div>
            </div>

            <div className="servicestat_rightheading">
              <button
                className="servicestat_button"
                onClick={() => {
                  serviceType === "download"
                    ? navigate(`/dashboard/servicestats/${slug}`)
                    : navigate(`/dashboard/servicestats/${slug}?type=event`);
                }}
              >
                Detailed {serviceType === "download" ? "Service" : "Event"} Analysis
              </button>
            </div>
          </div>

          <div className="userrequest-table">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">S.No</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Email ID</TableCell>
                    <TableCell align="center">Location</TableCell>
                    <TableCell align="center">Amount Paid</TableCell>
                    <TableCell align="center">{serviceType === "download" ? "Ordered" : "Registered"} on</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allUserDetails?.length !== 0
                    ? allUserDetails?.map((elem, i) => {
                        return (
                          <>
                            <TableRow key={i}>
                              <TableCell align="center">{i + 1}</TableCell>
                              <TableCell align="center">
                                {elem?.userID?.name ? elem?.userID?.name : "--"}
                              </TableCell>
                              <TableCell align="center">
                                {hiddenEmail(elem?.userID?.email)}
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
            </TableContainer>
          </div>
        </div>
      )}
      <SuperSEO title="Anchors - User Downloads" />
    </>
  );
}

export default Users;
