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

function Users(props) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getUserDetails, allUserDetails } = useContext(creatorContext);
  const {
    serviceInfo,
    getserviceinfo,
    compareJWT,
    getworkshopinfo,
    workshopInfo,
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
    if (query.get("service") === "workshop") {
      setServiceType("workshop");
      getworkshopinfo(slug).then((e) => {
        compareJWT(e[0]).then((e) => {
          if (e) {
            setapprovedUser(true);
            props.progress(100);
          } else {
            navigate("/newUi/mycontents");
          }
        });
      });
    } else {
      setServiceType("download");
      getserviceinfo(slug).then((e) => {
        compareJWT(e[0]).then((e) => {
          if (e) {
            setapprovedUser(true);
            props.progress(100);
          } else {
            navigate("/newUi/mycontents");
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    setopenLoading(true);
    getUserDetails(
      serviceType === "download" ? serviceInfo?._id : workshopInfo?._id,
      serviceType
    ).then((e) => {
      setopenLoading(false);
    });
  }, [serviceType === "download" ? serviceInfo : workshopInfo]);

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
              <h1 style={{margin:"5px"}}>List of Users Registered </h1>
              <span className="servicelist_wrap_span">
                Get your detailed Registered Users here.
              </span>
            </div>

            <div className="servicestat_rightheading">
              <button
                className="servicestat_button"
                onClick={() => {
                  serviceType === "download"
                    ? navigate(`/newUi/servicestats/${slug}`)
                    : navigate(`/newUi/servicestats/${slug}?service=workshop`);
                }}
              >
                Event Detailed Analysis
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
                    <TableCell align="center">Ordered on</TableCell>
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
    </>
  );
}

export default Users;
