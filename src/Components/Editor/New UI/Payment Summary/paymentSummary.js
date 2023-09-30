import React, { useEffect, useState } from "react";
import { LoadTwo } from "../../../Modals/Loading";
import "./paymentSummary.css";
import { host } from "../../../../config/config";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import { Button1 } from "../Create Services/InputComponents/buttons";
import mixpanel from "mixpanel-browser";
import { BiCommentAdd } from "react-icons/bi";
import {
  Table1,
  TooltipBox,
} from "../Create Services/InputComponents/fields_Labels";
import { HiInformationCircle } from "react-icons/hi";

const PaymentSummary = () => {
  const navigate = useNavigate();
  const [openLoading, setopenLoading] = useState(false);
  const [totalEarningServiceData, setTotalEarningServiceData] = useState(null);
  const [totalEarningEventsData, setTotalEarningEventsData] = useState(null);
  const [withdrawal, setWithdrawal] = useState(0);
  const [sort, setSort] = useState(0);
  const [filterType, setFilterType] = useState("service");

  const [isHovered, setIsHovered] = useState({
    tip1: false,
    tip2: false,
    tip3: false,
  });

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
    if (json?.success) {
      setTotalEarningServiceData(json);
    }

    const jsonEvent = await responseEvent.json();
    if (jsonEvent?.success) {
      setTotalEarningEventsData(jsonEvent);
    }
  };

  useEffect(() => {
    setopenLoading(true);
    gettotalearning().then(() => {
      setopenLoading(false);
    });
  }, []);

  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}
      <div className="servicelist-wrapper">
        <section className="headers_section_paymentInfo">
          <h1 className="text_type01_payment_info">Earnings Summary</h1>
          <Button1
            text="Account Details"
            onClick={() => {
              navigate("/dashboard/paymentInfo");
              mixpanel.track("Account Details");
            }}
          />
        </section>
        <div className="usereview_details">
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <BiCommentAdd color="#d0d0d0" size={30} />
            </div>
            <div className="userreview_detailedno" >
              <h3>
                ₹{" "}
                {(totalEarningServiceData?.totalCreatorServiceEarning +
                  totalEarningEventsData?.totalCreatorEventsEarning) *
                  0.9}
              </h3>
              <span>Total Earning</span>

              <HiInformationCircle
                size={20}
                color="grey"
                style={{ cursor: "pointer",position:'absolute',right:"10px",top:'10px' }}
                onMouseEnter={() => {
                  setIsHovered({ ...isHovered, tip1: true });
                }}
                onMouseLeave={() => {
                  setIsHovered({ ...isHovered, tip1: false });
                }}
              />

              {isHovered?.tip1 && <TooltipBox text="Total Earning = Actual Earning - anchors Cut(10%)" />}
            </div>
          </div>
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <BiCommentAdd color="#d0d0d0" size={30} />
            </div>
            <div className="userreview_detailedno">
              <h3>₹ {withdrawal}</h3>
              <span>Amount Withdrawn</span>
              
              <HiInformationCircle
                size={20}
                color="grey"
                style={{ cursor: "pointer",position:'absolute',right:"10px",top:'10px' }}
                onMouseEnter={() => {
                  setIsHovered({ ...isHovered, tip2: true });
                }}
                onMouseLeave={() => {
                  setIsHovered({ ...isHovered, tip2: false });
                }}
              />

              {isHovered?.tip2 && <TooltipBox text="Amount you have withdrawn" />}
            </div>
          </div>
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <BiCommentAdd color="#d0d0d0" size={30} />
            </div>
            <div className="userreview_detailedno">
              <h3>
                ₹{" "}
                {(totalEarningServiceData?.totalCreatorServiceEarning +
                  totalEarningEventsData?.totalCreatorEventsEarning) *
                  0.9 -
                  withdrawal}
              </h3>
              <span>Balance Amount</span>


              <HiInformationCircle
                size={20}
                color="grey"
                style={{ cursor: "pointer",position:'absolute',right:"10px",top:'10px' }}
                onMouseEnter={() => {
                  setIsHovered({ ...isHovered, tip3: true });
                }}
                onMouseLeave={() => {
                  setIsHovered({ ...isHovered, tip3: false });
                }}
              />

              {isHovered?.tip3 && <TooltipBox text="Net Balance = Total Earning - Withdrawn Amount" />}
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
          <Table1
            headArray={
              sort === 1
                ? ["Sr.No", "Date", "Earning (INR)"]
                : [
                    "Sr.No",
                    filterType === "service" ? "Service Name" : "Event Name",
                    "Created on",
                    "Earning (INR)",
                  ]
            }
            bodyArray={
              filterType === "service"
                ? sort === 1
                  ? Object.keys(totalEarningServiceData?.dateWiseData)?.map(
                      (elem, i) => {
                        return [
                          i + 1,
                          elem,
                          totalEarningServiceData?.dateWiseData[elem],
                        ];
                      }
                    )
                  : totalEarningServiceData?.serviceWiseData?.map((elem, i) => {
                      return [
                        i + 1,
                        elem.service_name,
                        moment(elem.date).fromNow(),
                        elem.earning,
                      ];
                    })
                : sort === 1
                ? Object.keys(totalEarningEventsData?.dateWiseData).map(
                    (elem, i) => {
                      return [
                        i + 1,
                        elem,
                        totalEarningEventsData?.dateWiseData[elem],
                      ];
                    }
                  )
                : totalEarningEventsData?.eventsWiseData?.map((elem, i) => {
                    return [
                      i + 1,
                      elem.event_name,
                      moment(elem?.date).fromNow(),
                      elem.earning,
                    ];
                  })
            }
            gridConfig={sort === 1 ? "20% 40% 40%" : "15% 30% 30% 25%"}
          />
        </div>
      </div>
      <SuperSEO title="Anchors - Payment Summary" />
    </>
  );
};

export default PaymentSummary;
