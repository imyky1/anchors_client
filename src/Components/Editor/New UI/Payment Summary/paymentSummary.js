import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  Icon,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ICON from "./startIcon.svg";
import React, { useContext, useEffect, useState } from "react";
import { creatorContext } from "../../../../Context/CreatorState";
import { LoadTwo } from "../../../Modals/Loading";
import ShowReviewModel from "../../../Modals/ShowReviewModel";
import "./paymentSummary.css";
import { host } from "../../../../config/config";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import { Button1 } from "../Create Services/InputComponents/buttons";
import mixpanel from "mixpanel-browser";

const PaymentSummary = () => {
  const navigate = useNavigate();
  const [openLoading, setopenLoading] = useState(false);
  const [uorders, setUorders] = useState([]);
  const [totalearning, setTotalEarning] = useState(0);
  const [tablevalues, setTableValues] = useState({});
  const [withdrawal, setWithdrawal] = useState(0);
  const [sort, setSort] = useState(0);
  const [service_data, set_service_data] = useState([]);
  const [dummyData, setDummyData] = useState(false);
  const [eventslist, setEventsList] = useState([]);
  const [event_data, set_event_data] = useState([]);
  const [filterType, setFilterType] = useState("service");
  const [eventearning, setEventEarning] = useState(0);
  const [eventTable, setEventTable] = useState({});

  const gettotalearning = async () => {
    const response = await fetch(`${host}/payments/totalearning`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });

    const responseEvent = await fetch(`${host}/payments/totalearningevent`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });

    const json = await response.json();
    const jsonEvent = await responseEvent.json();
    setEventsList(jsonEvent.eorders);
    set_event_data(jsonEvent.sorders);

    setUorders(json.uorders);
    set_service_data(json.sorders);
    setDummyData(json.dummy);
    if (json.success) {
      return json;
    } else {
      //console.log(json.error)
    }
  };

  const calculateTotalearning = () => {
    uorders.map((el) => {
      return setTotalEarning((prev) => prev + el.amount);
    });
  };

  const calculateEventearning = () => {
    eventslist.map((ev) => {
      return setEventEarning((prev) => prev + ev.amount);
    });
  };

  const createtablerecords = () => {
    const counts = {};
    uorders.map(function (x) {
      return (counts[x.orderDate.slice(0, 10)] =
        (counts[x.orderDate.slice(0, 10)] || 0) + x.amount);
    });

    // let sorted = counts.sort(function (a, b) {
    //   // Turn your strings into dates, and then subtract them
    //   // to get a value that is either negative, positive, or zero.
    //   return new Date(b.) - new Date(a[0]);
    // });
    // console.log(sorted);
    // const keysSorted = Object.keys(counts).sort(function (a, b) {
    //   return new Date(b) - new Date(a);
    // });
    // console.log(keysSorted);

    setTableValues(counts);
  };

  const createeventrecords = () => {
    const counts = {};
    eventslist.map(function (x) {
      return (counts[x.orderDate.slice(0, 10)] =
        (counts[x.orderDate.slice(0, 10)] || 0) + x.amount);
    });
    setEventTable(counts);
  };

  useEffect(() => {
    setopenLoading(true);
    gettotalearning().then(() => {
      setopenLoading(false);
    });
  }, []);

  useEffect(() => {
    calculateTotalearning();
    createtablerecords()?.then(() => {});
  }, [uorders]);

  useEffect(() => {
    calculateEventearning();
    createeventrecords()?.then(() => {});
  }, [eventslist]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const style = { fontSize: "1.2em", paddingTop: "4.5px", paddingLeft: "10px" };

  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}
      <div className="servicelist-wrapper">
        <section className="headers_section_paymentInfo">
          <h1 className="text_type01_payment_info">Earnings Summary</h1>
          <button
            onClick={() => {
              navigate("/dashboard/paymentInfo");
              mixpanel.track("Account Details");
            }}
          >
            Account Details
          </button>
        </section>
        <div className="usereview_details">
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <img src={ICON} />
            </div>
            <div className="userreview_detailedno">
              {filterType === "service" ? (
                <>
                  <h3>₹ {totalearning - (totalearning * 1) / 100}</h3>
                </>
              ) : (
                <>
                  <h3>₹ {eventearning - (eventearning * 1) / 100}</h3>
                </>
              )}
              <span>Total Earning</span>
            </div>
          </div>
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <img src={ICON} />
            </div>
            <div className="userreview_detailedno">
              <h3>₹ {withdrawal}</h3>
              <span>Amount Withdrawn</span>
            </div>
          </div>
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <img src={ICON} />
            </div>
            <div className="userreview_detailedno">
              {filterType === "service" ? (
                <>
                  <h3>
                    ₹ {totalearning - (totalearning * 1) / 100 - withdrawal}
                  </h3>
                </>
              ) : (
                <>
                  <h3>
                    ₹ {eventearning - (eventearning * 1) / 100 - withdrawal}
                  </h3>
                </>
              )}

              <span>Balance Amount</span>
            </div>
          </div>
        </div>
        {openLoading && <LoadTwo open={openLoading} />}
        <div className="servicelist-categories2 margin-bottom">
          <div className="service_event_date_wise_arrange">
            <div
              className={`servicelist-catItem ${
                sort === 0 ? "selectedlist" : ""
              }`}
              onClick={function () {
                mixpanel.track("Summary | Service Wise");
                setSort(0);
              }}
            >
              {filterType === "service" ? "Service Wise" : "Event Wise"}
            </div>
            <div
              className={`servicelist-catItem ${
                sort === 1 ? "selectedlist" : ""
              }`}
              onClick={function () {
                mixpanel.track("Summary | Date Wise");
                setSort(1);
              }}
            >
              Date Wise
            </div>
          </div>

          <div className="filter_service_event_payment">
            <label htmlFor="filter">Filter by:</label>
            <select
              id="filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="event">Events</option>
              <option value="service">Services</option>
            </select>
          </div>
        </div>
        <div className="userrequest-table">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Sr.No</TableCell>
                  {sort === 0 ? (
                    <TableCell align="center">
                      {" "}
                      {filterType === "service" ? "Service Name" : "Event Name"}
                    </TableCell>
                  ) : (
                    ""
                  )}
                  <TableCell align="center">Created on</TableCell>
                  <TableCell align="center">Earning (INR)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterType === "service" ? (
                  <>
                    {sort === 1
                      ? Object.keys(tablevalues).map((elem, i) => {
                          var value = tablevalues[elem];
                          return (
                            <StyledTableRow
                              key={i}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <StyledTableCell
                                align="center"
                                component="th"
                                scope="row"
                              >
                                {i + 1}{" "}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {elem}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {value}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })
                      : service_data.map((elem, i) => (
                          <StyledTableRow
                            key={i}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <StyledTableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {i + 1}{" "}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {elem.service_name}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {moment(elem.date).fromNow()}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {elem.earning}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                  </>
                ) : (
                  <>
                    {sort === 1
                      ? Object.keys(eventTable).map((elem, i) => {
                          var value = eventTable[elem];
                          return (
                            <StyledTableRow
                              key={i}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <StyledTableCell
                                align="center"
                                component="th"
                                scope="row"
                              >
                                {i + 1}{" "}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {elem}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {value}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })
                      : event_data.map((elem, i) => (
                          <StyledTableRow
                            key={i}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <StyledTableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {i + 1}{" "}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {elem.event_name}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {moment(elem.date).fromNow()}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {elem.earning}
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {dummyData && (
          <div className="cta_dummy_data">
            <span>
              this is dummy data , start creating your first service for your
              data
            </span>
            <Button1
              text="Create your First Service"
              width="268px"
              onClick={() => {
                navigate("/dashboard");
              }}
            />
          </div>
        )}
      </div>
      <SuperSEO title="Anchors - Payment Summary" />
    </>
  );
};

export default PaymentSummary;