import React from "react";
import "./ServiceStats2.css";
import { useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Moment from "moment";
import { SuperSEO } from "react-super-seo";

import ServiceContext from "../../../../Context/services/serviceContext";
import { host } from "../../../../config/config";
import { LoadTwo } from "../../../Modals/Loading";
import { toast, ToastContainer } from "react-toastify";
import {
  AiOutlineUser,
  AiOutlineInfoCircle,
  AiOutlineCalendar,
} from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import { GiPlainCircle } from "react-icons/gi";
import { BiRupee } from "react-icons/bi";

const TooltipBox = ({ text }) => {
  return (
    <div className="tooltip-box" style={{ top: "30px" }}>
      {text}
    </div>
  );
};

const TableRef = ({ totalrefer, referdata }) => {
  return (
    <>
      {totalrefer?.combinedOrders[0]?.totalrefer +
        totalrefer?.combinedOrders[1]?.totalrefer +
        totalrefer?.combinedOrders[2]?.totalrefer >
        0 && (
        <div className="referal_top_list_00">
          <h1>Top 3 Referral</h1>
          <div className="referal_top_list_000">
            {totalrefer?.combinedOrders[0]?.totalrefer > 0 && (
              <div className="referal_top_list_01">
                <div className="referal_top_list_02">
                  <div
                    className="referal_top_list_profile"
                    style={{ border: "6px solid #D8B500" }}
                  >
                    <img
                      src={totalrefer?.combinedOrders[0]?.user?.userID?.photo}
                      alt="Profile"
                      style={{
                        display: "block",
                        zIndex: "1",
                        // position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: "100%",
                      }}
                    />
                  </div>
                  <div className="referal_top_list_profile_circle_00">
                    <GiPlainCircle
                      className="referal_top_list_profile_circle"
                      style={{ color: "#D8B500" }}
                    />
                    <span style={{ position: "absolute" }}>1</span>
                  </div>
                  <section>
                    <div className="referal_top_list_02_referal_details">
                      <span> {totalrefer?.combinedOrders[0]?.totalrefer}</span>
                      <span style={{ fontSize: "12px" }}>Total Referrals</span>
                      <span
                        style={{
                          fontSize: "16px",
                          color: "#fff",
                          marginTop: "32px",
                        }}
                      >
                        {totalrefer?.combinedOrders[0]?.user?.userID?.name}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#fff",
                          marginTop: "12px",
                        }}
                      >
                        {totalrefer?.combinedOrders[0]?.user?.userID?.email}
                      </span>
                    </div>
                  </section>
                </div>
              </div>
            )}
            {totalrefer?.combinedOrders[1]?.totalrefer > 0 && (
              <div className="referal_top_list_01">
                <div className="referal_top_list_02">
                  <div
                    className="referal_top_list_profile"
                    style={{ border: "6px solid #C0C0C0" }}
                  >
                    <img
                      src={totalrefer?.combinedOrders[1]?.user?.userID?.photo}
                      alt="Profile"
                      style={{
                        display: "block",
                        zIndex: "1",
                        // position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: "100%",
                      }}
                    />
                  </div>

                  <div
                    className="referal_top_list_profile_circle_00"
                    style={{ right: "44%" }}
                  >
                    <GiPlainCircle
                      className="referal_top_list_profile_circle"
                      style={{ color: "#C0C0C0" }}
                    />
                    <span style={{ position: "absolute" }}>2</span>
                  </div>
                  <section style={{ left: "1%" }}>
                    <div className="referal_top_list_02_referal_details">
                      <span style={{ color: "#C0C0C0" }}>
                        {" "}
                        {totalrefer?.combinedOrders[1]?.totalrefer}
                      </span>
                      <span style={{ fontSize: "12px", color: "#C0C0C0" }}>
                        Total Referrals
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          color: "#fff",
                          marginTop: "32px",
                        }}
                      >
                        {totalrefer?.combinedOrders[1]?.user?.userID?.name}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#fff",
                          marginTop: "12px",
                        }}
                      >
                        {totalrefer?.combinedOrders[1]?.user?.userID?.email}
                      </span>
                    </div>
                  </section>
                </div>
              </div>
            )}
            {totalrefer?.combinedOrders[2]?.totalrefer > 0 && (
              <div className="referal_top_list_01">
                <div className="referal_top_list_02">
                  <div
                    className="referal_top_list_profile"
                    style={{ border: "6px solid #A97142" }}
                  >
                    <img
                      src={totalrefer?.combinedOrders[2]?.user?.userID?.photo}
                      alt="Profile"
                      style={{
                        display: "block",
                        zIndex: "1",
                        // position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: "100%",
                      }}
                    />
                  </div>

                  <div
                    className="referal_top_list_profile_circle_00"
                    style={{ right: "43%" }}
                  >
                    <GiPlainCircle
                      className="referal_top_list_profile_circle"
                      style={{ color: "#A97142" }}
                    />
                    <span style={{ position: "absolute" }}>3</span>
                  </div>
                  <section style={{ left: "2%" }}>
                    <div className="referal_top_list_02_referal_details">
                      <span style={{ color: "#A97142" }}>
                        {" "}
                        {totalrefer?.combinedOrders[2]?.totalrefer}
                      </span>
                      <span style={{ fontSize: "12px", color: "#A97142" }}>
                        Total Referrals
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          color: "#fff",
                          marginTop: "32px",
                        }}
                      >
                        {totalrefer?.combinedOrders[2]?.user?.userID?.name}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#fff",
                          marginTop: "12px",
                        }}
                      >
                        {totalrefer?.combinedOrders[2]?.user?.userID?.email}
                      </span>
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {
        <div className="service_table_00">
          <table>
            <tr style={{ background: "#282828" }}>
              <th
                style={{
                  display: "flex",
                  width: "11.5%",
                  alignItems: "flex-start",
                }}
              >
                Referral
                <br />
                Rank
              </th>
              <th
                style={{
                  display: "flex",
                  width: "15.7%",
                  alignItems: "flex-start",
                }}
              >
                Name
              </th>
              <th
                style={{
                  display: "flex",
                  width: "20.8%",
                  alignItems: "flex-start",
                }}
              >
                Email
              </th>
              <th
                style={{
                  display: "flex",
                  width: "17.6%",
                  alignItems: "flex-start",
                }}
              >
                Registered
                <br /> date
              </th>
              {/* <th
                style={{
                  display: "flex",
                  width: "12.5%",
                  alignItems: "flex-start",
                }}
              >
                Total
                <br />
                Referral
              </th> */}
              <th
                style={{
                  display: "flex",
                  width: "17.7%",
                  alignItems: "flex-start",
                }}
              >
                Joined from
                <br /> Referral
              </th>
              {/* <th
                  style={{
                    display: "flex",
                    width: "10.6%",
                    alignItems: "flex-start",
                  }}
                >
                  Email Sent
                  <br />
                  on
                </th> */}
              {/* <th
                  style={{
                    display: "flex",
                    width: "11.7%",
                    alignItems: "flex-start",
                  }}
                >
                  WhatsApp
                  <br /> Sent on
                </th> */}
              <th
                style={{
                  display: "flex",
                  width: "15.7%",
                  alignItems: "flex-start",
                }}
              >
                Amount
              </th>
            </tr>

            {referdata?.map((val, key) => {
              return (
                <tr
                  style={{
                    borderRadius: "0px",
                    borderBottom: "0.5px solid #DADADA",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                  key={key}
                >
                  <td
                    style={{
                      display: "flex",
                      width: "11.5%",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    {val.rank}{" "}
                  </td>

                  <td
                    style={{
                      display: "flex",
                      width: "15.7%",
                      alignItems: "flex-start",
                    }}
                  >
                    {val.name}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      width: "20.8%",
                      alignItems: "center",
                      flexDirection: "column",
                      textAlign: "center",
                    }}
                  >
                    <span>{val.email}</span>
                    {/* <span>{val.email.split("@")[0]}</span>
                      <span>@{val.email.split("@")[1]}</span> */}
                  </td>

                  <td
                    style={{
                      display: "flex",
                      width: "17.6%",
                      alignItems: "flex-start",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ width: "67%" }}>{val.registerdate}</span>
                  </td>
                  {/* <td
                    style={{
                      display: "flex",
                      width: "12.5%",
                      alignItems: "flex-start",
                    }}
                  >
                    {val.totalrefer}
                  </td> */}
                  <td
                    style={{
                      display: "flex",
                      width: "17.7%",
                      alignItems: "flex-start",
                    }}
                  >
                    {val.joinedfromrefer}
                  </td>
                  {/* <td
                      style={{
                        display: "flex",
                        width: "10.6%",
                        alignItems: "flex-start",
                        textAlign: "center",
                      }}
                    >
                      <span style={{ width: "68%" }}>{val.emailsent}</span>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        width: "11.7%",
                        alignItems: "flex-start",
                        textAlign: "center",
                      }}
                    >
                      <span style={{ width: "68%" }}>{val.whatsappsent}</span>
                    </td> */}
                  <td
                    style={{
                      display: "flex",
                      width: "15.7%",
                      alignItems: "flex-start",
                    }}
                  >
                    {val.amount}
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      }
    </>
  );
};

const TableinfoTrans = ({ totalTransactionDetails }) => {
  const getDatelist = (date) => {
    let ll = date?.slice(0, date.toString().length - 5);
    const datenew = ll?.split("T");
    if (datenew) {
      return datenew[0];
    }
  };

  const getDatelist2 = (date) => {
    let ll = date?.slice(0, date.toString().length - 5);
    const datenew = ll?.split("T");
    if (datenew) {
      return datenew[1];
    }
  };

  return (
    <>
      <div className="service_table_00">
        <table>
          <tr style={{ background: "#282828" }}>
            <th
              style={{
                display: "flex",
                width: "10%",
                alignItems: "flex-start",
              }}
            >
              S. No.
            </th>
            <th
              style={{
                display: "flex",
                width: "17%",
                alignItems: "flex-start",
              }}
            >
              Name
            </th>
            <th
              style={{
                display: "flex",
                width: "23%",
                alignItems: "flex-start",
              }}
            >
              Email
            </th>
            <th
              style={{
                display: "flex",
                width: "23%",
                alignItems: "flex-start",
              }}
            >
              Status
            </th>
            <th
              style={{
                display: "flex",
                width: "12%",
                alignItems: "flex-start",
              }}
            >
              Date & Time
            </th>
            <th
              style={{
                display: "flex",
                width: "11%",
                alignItems: "flex-start",
              }}
            >
              Mobile
            </th>
          </tr>
          {totalTransactionDetails?.map((val, key) => {
            return (
              <tr
                style={{
                  borderRadius: "0px",
                  borderBottom: "0.5px solid #DADADA",
                  //   justifyContent: "center",
                }}
                key={key}
              >
                <td
                  style={{
                    display: "flex",
                    width: "10%",
                    alignItems: "center",
                    // justifyContent: "center",
                  }}
                >
                  {key + 1}{" "}
                </td>

                <td
                  style={{
                    display: "flex",
                    width: "17%",
                    alignItems: "flex-start",
                  }}
                >
                  {val?.userID?.name}
                </td>
                <td
                  style={{
                    display: "flex",
                    width: "23%",
                    alignItems: "flex-start",
                  }}
                >
                  {val?.userID?.email}
                </td>

                <td
                  style={{
                    display: "flex",
                    width: "23%",
                    alignItems: "flex-start",
                    color: "#F00",
                  }}
                >
                  <span
                    style={{
                      borderRadius: "50px",
                      background: val?.status === 1 ? "#DCFFDF" : "#FFDADA",
                      color: val?.status === 1 ? "#3F8706" : "#F00",
                      padding: "4px 20px",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    {val?.status === 1
                      ? "Successfully Paid"
                      : "Unsuccessfully Payment"}
                  </span>
                </td>
                <td
                  style={{
                    display: "flex",
                    width: "12%",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ width: "77%", textAlign: "center" }}>
                    {getDatelist(val?.orderDate)} <br />{" "}
                    {getDatelist2(val?.orderDate)}
                  </span>
                </td>
                <td
                  style={{
                    display: "flex",
                    width: "11%",
                    alignItems: "flex-start",
                  }}
                >
                  {val?.userID?.phoneNumber ?? "--"}
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};

const Tableinfo = ({ data, dataType, slug ,removeTotalTransColumn }) => {
  const [isHovered, setIsHovered] = useState({
    tip1: false,
    tip2: false,
    tip0: false,
  });

  const viewMore = (todo) => {
    return (
      <>
        <h2
          style={{
            position: "relative",
            right: "4%",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => {
            if (todo === "totalSuccessfullRegister") {
              window.open(
                `/dashboard/viewUserDetails/${slug}?type=${dataType}`
              );
            } else {
              window.open(
                `${window.location.pathname}?type=${dataType}&get=${todo}`
              );
            }
          }}
        >
          View More <BsArrowRight style={{ paddingLeft: "4px" }} />{" "}
        </h2>
      </>
    );
  };

  return (
    <>
      <div className="service_table_00">
        <table>
          <tr style={{ background: "#282828" }}>
            <th
              style={{
                display: "flex",
                width: "50%",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              Metrics Name
            </th>
            <th
              style={{
                display: "flex",
                width: "9%",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              Users
            </th>
            <th
              style={{
                display: "flex",
                width: "41%",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              Comment
            </th>
          </tr>
          {data &&
            data?.filter((e)=>{return !e?.removeObj})?.map((val, key) => {
              return (
                <tr
                  style={{
                    borderRadius: "0px",
                    borderBottom: "0.5px solid #A0A0A0",
                  }}
                  className={val?.ViewMore ? "hoverable-row" : ""}
                  key={key}
                >
                  <td
                    style={{
                      display: "flex",
                      width: "50%",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {val.MetricsName}{" "}
                      {val?.infoIcon && (
                        <AiOutlineInfoCircle
                          style={{
                            paddingLeft: "8px",
                            fontSize: "15px",
                            alignItems: "center",
                          }}
                          onMouseEnter={() => {
                            setIsHovered({ ...isHovered, [`tip${key}`]: true });
                          }}
                          onMouseLeave={() => {
                            setIsHovered({
                              ...isHovered,
                              [`tip${key}`]: false,
                            });
                          }}
                        />
                      )}
                      {isHovered?.[`tip${key}`] && (
                        <TooltipBox text={val?.infotext} />
                      )}
                    </span>
                    {val?.ViewMore && viewMore(val?.urlquery)}
                  </td>

                  <td
                    style={{
                      display: "flex",
                      width: "9%",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      // paddingLeft: key > 2 && key < 6 ? '7px' : 'none',
                    }}
                  >
                    {val.Users}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      width: "41%",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                    }}
                  >
                    {val.Comment}
                  </td>
                </tr>
              );
            })}
        </table>
      </div>
    </>
  );
};

const ReturnTable = ({
  type,
  data,
  totalTransactionDetails,
  totalrefer,
  referdata,
  dataType,
  slug,
}) => {
  if (type === "totalTransaction") {
    return (
      <TableinfoTrans
        totalTransactionDetails={totalTransactionDetails}
        dataType={dataType}
      />
    );
  } else if (type === "totalReferral") {
    return (
      <TableRef
        totalrefer={totalrefer}
        referdata={referdata}
        dataType={dataType}
      />
    );
    // } else if (type === "totalSuccessfullRegister") {
    //   return (
    //     <TableinfoTrans
    //       totalTransactionDetails={totalTransactionDetails?.filter((e) => {
    //         return e?.status === 1;
    //       })}
    //       dataType={dataType}
    //     />
    //   );
  } else {
    return <Tableinfo data={data} dataType={dataType} slug={slug}/>;
  }
};

const ServiceStats2 = (props) => {
  const { slug } = useParams();

  const navigate = useNavigate();
  const {
    serviceInfo,
    getserviceinfo,
    compareJWT,
    geteventinfo,
    eventInfo,
    getLeaderBoardData,
    getReferDetails,
    getTransactionEventDetails,
    getTransactionServiceDetails,
  } = useContext(ServiceContext);

  // custom hook to get querries
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery();

  const [serviceType, setServiceType] = useState();
  const [eventDetailsPage, setEventDetailsPage] = useState("general");
  const [lastupdate, setLastUpdate] = useState();
  const [referal, setReferal] = useState();
  const [servicetransaction, setServiceTransaction] = useState();
  const [totalrefer, setTotalRefer] = useState();
  const [totalTransactionDetails, setTotalTransactionDetails] = useState();
  const [approvedUser, setapprovedUser] = useState(false); // check if user searching is appropriate
  const [openLoading, setopenLoading] = useState(false);

  useEffect(() => {
    props.progress(0);
    if (query.get("type") === "event") {
      setServiceType("event");
      geteventinfo(slug).then((e) => {
        compareJWT(e[0]?._id).then((result) => {
          if (result) {
            setapprovedUser(true);

            // Leaderboard Data ------
            getLeaderBoardData(
              e[1],
              localStorage.getItem("isUser") === ""
            ).then((e) => {
              if (e?.success) {
                const sortedData = e.data.sort((a, b) => b.points - a.points);
                //  console.log('sort',sortedData);
                setReferal(sortedData);
                // setReferal(e.data);
                // setLeaderBoardData(e);
              }
            });

            // Refer data ----------
            getReferDetails(e[1], localStorage.getItem("isUser") === "").then(
              (e) => {
                if (e?.success) {
                  setTotalRefer(e);
                }
              }
            );

            // Transaction data -----
            getTransactionEventDetails(e[1]).then((e) => {
              if (e?.success) {
                setTotalTransactionDetails(e?.data);
              }
            });

            props.progress(100);
          } else {
            navigate("/dashboard/mycontents");
          }
        });
      });
    } else {
      setServiceType("download");
      getserviceinfo(slug).then((e) => {
        compareJWT(e[0]?._id).then((result) => {
          if (result) {
            setapprovedUser(true);

            // get transaction data --------
            getTransactionServiceDetails(
              e[1],
              localStorage.getItem("isUser") === ""
            ).then((e) => {
              if (e?.success) {
                setServiceTransaction(e?.data);
              }
            });

            props.progress(100);
          } else {
            navigate("/dashboard/mycontents");
          }
        });
      });
    }

    if (query.get("get")) {
      setEventDetailsPage(query.get("get"));
    }
  }, []);

  //   // Loading mixpanel ------
  //   // mixpanel.track("Page Visit");

  //   // if (params.get("placedOrder") === "success") {
  //   //   setOpenSuccessModal(true);
  //   // }

  //   geteventinfo(slug).then((id) => {
  //     if (!id[0]) {
  //       // handles any irregular slug
  //       navigate("/");
  //       return null;
  //     }
  //     getLeaderBoardData(id[1], localStorage.getItem("isUser") === "").then(
  //       (e) => {
  //         if (e?.success) {
  //           const sortedData = e.data.sort((a, b) => b.points - a.points);
  //           //  console.log('sort',sortedData);
  //           setReferal(sortedData);
  //           // setReferal(e.data);
  //           // setLeaderBoardData(e);
  //         }
  //       }
  //     );

  //     getReferDetails(id[1], localStorage.getItem("isUser") === "").then(
  //       (e) => {
  //         if (e?.success) {
  //           setTotalRefer(e);
  //         }
  //       }
  //     );

  //     getTransactionEventDetails(id[1]).then((e) => {
  //       if (e?.success) {
  //         setTotalTransactionDetails(e?.data);
  //       }
  //     });
  //   });

  //   getserviceinfo(slug).then((id) => {
  //     if (!id[0]) {
  //       // handles any irregular slug
  //       navigate("/");
  //       return null;
  //     }

  //     getTransactionServiceDetails(
  //       id[1],
  //       localStorage.getItem("isUser") === ""
  //     ).then((e) => {
  //       if (e?.success) {
  //         setServiceTransaction(e);
  //       }
  //     });
  //   });
  // }, []);

  // getting data from analytics(google) data from the db
  const [bounceRate, setBounceRate] = useState(0);
  const [avgTime, setAvgTime] = useState(0);

  const [mixpaneldata, setMixpanelData] = useState({
    valueunique: 0,
    valuenotunique: 0,
  });

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

  const getAnalyticsData = async () => {
    let response = await fetch(`${host}/analytics/getdata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        serviceType,
        slug,
      }),
    });
    response = await response.json();
    if (response.result) {
      setBounceRate(response?.result?.bouncerate);
      setAvgTime(response?.result?.avgTime);
    }
  };

  useEffect(() => {
    setopenLoading(true);
    if (slug) {
      getAnalyticsData().then(() => {
        setopenLoading(false);
      });
    }
  }, [slug, serviceType]);

  // mixpanel api------------------------------
  const handler = async () => {
    setopenLoading(true);
    if (serviceType === undefined) {
    } else {
      if (serviceInfo?.service || eventInfo?.event) {
        fetch(`${host}/api/stats/getStats`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
            "jwt-token": localStorage.getItem("jwtToken"),
          },
          body: JSON.stringify({
            service:
              serviceType === "download"
                ? serviceInfo?.service
                : eventInfo?.event,
            serviceType: serviceType,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setMixpanelData({
              valueunique: data?.response?.uniquevisits,
              valuenotunique: data?.response?.Totalvisits,
            });
            setLastUpdate(data?.response?.updatedOn);
            setopenLoading(false);
            return data?.response;
          });
      }
    }
  };

  useEffect(() => {
    handler();
  }, [serviceInfo, eventInfo]);

  const totalReferConversion =
    serviceType === "download"
      ? (serviceInfo?.service?.downloads * 100) / mixpaneldata?.valueunique
      : (eventInfo?.event?.registrations * 100) / mixpaneldata?.valueunique;

  const totalDetails =
    serviceType === "download"
      ? servicetransaction?.length
      : totalTransactionDetails?.length;
  const totalRegister =
    serviceType === "download"
      ? serviceInfo?.service?.downloads
      : eventInfo?.event?.registrations;
  const data = [
    {
      MetricsName: "Total Visitor",
      Users: mixpaneldata?.valuenotunique,
      Comment: "",
      infoIcon: true,
      infotext: "Number of times your Event Page was checked out",
    },
    {
      MetricsName: "Total Unique Visitor",
      Users: mixpaneldata?.valueunique,
      Comment: "",
      infoIcon: true,
      infotext: "Number of Unique Visits on your Event Page",
    },
    // {
    //   MetricsName: "Total Signed up for the event",
    //   Users: eventInfo?.event?.registrations,
    //   Comment: "",
    // },
    {
      MetricsName: "Total Transaction ( Failed and dropped )",
      Users: totalDetails,
      Comment: "Check list of users and call them for better conversion",
      ViewMore: true,
      urlquery: "totalTransaction",
      removeObj:!eventInfo?.event?.isPaid
    },
    {
      MetricsName: `Total Register for the event`,
      Users: totalRegister,
      Comment: `Conversion Rate is ${totalReferConversion.toFixed(
        2
      )}%. It's more than standard.`,
      ViewMore: true,
      urlquery: "totalReferral",
    },
    {
      MetricsName: "Total User Register through Referral",
      Users: totalrefer?.combinedOrders?.length,
      Comment: `${(
        (totalrefer?.combinedOrders?.length / eventInfo?.event?.registrations) *
        100
      ).toFixed(0)}% of users register through referral`,
    },
    // },

    // {
    //   MetricsName: "Total Traffic Generated by User by sharing ( Link Clicks )",
    //   Users: 519,
    //   Comment: "",
    // },
    // {
    //   MetricsName: "Total Traffic Generated by you by sharing ( Link Clicks )",
    //   Users: 444,
    //   Comment: "Share with more audience through your social handles",
    // },
  ];

  const serviceData = [
    {
      MetricsName: "Total Visitor",
      Users: mixpaneldata?.valuenotunique,
      Comment: "",
      infoIcon: true,
      infotext: "Number of times your Service Page was checked out",
    },
    {
      MetricsName: "Total Unique Visitor",
      Users: mixpaneldata?.valueunique,
      Comment: "",
      infoIcon: true,
      infotext: "Number of Unique Visits on your Service Page",
    },{
      MetricsName: "Total Transaction ( Failed and dropped )",
      Users: totalDetails,
      Comment: "Check list of users and call them for better conversion",
      ViewMore: true,
      urlquery: "totalTransaction",
      removeObj:!serviceInfo?.service?.isPaid
    },
    {
      MetricsName: `Total Register for the service`,
      Users: totalRegister,
      Comment: `Conversion Rate is ${totalReferConversion.toFixed(
        2
      )}%. It's more than standard.`,
      ViewMore: true,
      urlquery: "totalSuccessfullRegister",
    },
  ];

  const [referdata, setReferData] = useState();

  useEffect(() => {
    if (totalrefer?.success) {
      setReferData(
        totalrefer?.registerOrders?.map((item, index) => {
          const orderDate = new Date(item?.orderDate);

          const day = orderDate.getDate();
          const month = orderDate.toLocaleString("default", { month: "long" });
          const year = orderDate.getFullYear();

          const formattedDate = `${day} ${month} ${year}`;

          return {
            rank: index + 1,
            name: item?.userID?.name || "",
            email: item?.userID?.email || "",
            registerdate: formattedDate,
            totalrefer: item?.totalrefer || 0,
            joinedfromrefer: item?.referredFrom ? "Yes" : "No",
            // emailsent: "23 Aug 2023 6:01 PM",
            // whatsappsent: "23 Aug 2023 6:01 PM",
            amount: item?.amount,
          };
        })
      );
    }
  }, [totalrefer]);

  return (
    <>
      <ToastContainer limit={1} />
      <LoadTwo open={openLoading} />

      {approvedUser && (
        <div className="servicestat_wrapper">
          <div className="serivce_heading_00">
            <h1>
              {eventDetailsPage === "totalTransaction"
                ? "Total Transaction Details"
                : eventDetailsPage === "totalSuccessfullRegister" ||
                  eventDetailsPage === "totalReferral"
                ? `User List for ${
                    serviceType === "event" ? "Event" : "Service"
                  }`
                : `Detailed ${
                    serviceType === "event" ? "Event" : "Service"
                  } Analysis`}
            </h1>
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
                    <AiOutlineCalendar /> {date + " " + time}
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    <BiRupee/>
                    {serviceType === "download"
                      ? serviceInfo?.service?.ssp * serviceInfo?.service?.downloads
                      : eventInfo?.event?.ssp * eventInfo?.event?.registrations}
                  </span>
                </section>
                <div className="serivce_heading_03">
                  {eventDetailsPage !== "totalReferral" && (
                    <button
                      onClick={() => {
                        serviceType === "download"
                          ? navigate(
                              `/dashboard/viewUserDetails/${slug}?type=download`
                            )
                          : navigate(
                              `/dashboard/viewUserDetails/${slug}?type=event`
                            );
                      }}
                    >
                      <AiOutlineUser />
                      List of Users
                    </button>
                  )}
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

          <div className="serivce_heading_updated_time">
            <p>last updated on:{new Date(lastupdate).toLocaleString()}</p>
          </div>

          <ReturnTable
            type={eventDetailsPage}
            data={serviceType === "event" ? data : serviceData}
            totalrefer={serviceType === "event" ? totalrefer : []}
            totalTransactionDetails={
              serviceType === "event"
                ? totalTransactionDetails
                : servicetransaction
            }
            referdata={serviceType === "event" ? referdata : []}
            dataType={serviceType}
            slug={slug}
          />
        </div>
      )}
      <SuperSEO title="Anchors - Service Statistics" />
    </>
  );
};

export default ServiceStats2;
