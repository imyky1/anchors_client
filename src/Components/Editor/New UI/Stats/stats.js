import React, { useState, useRef, useEffect, useContext } from "react";
import "./stats.css";
import Bar from "./bargraph.js";
import { useLocation, useNavigate } from "react-router-dom";
import calendar from "./calendar.svg";
import red_star from "./newstar.png";
import { creatorContext } from "../../../../Context/CreatorState.js";
import below from "./icon-park_down.svg";
import big_star from "./Starbig.png";
import blue_star from "./newstar.png";
import frame_service from "./Frame.png";
import doc from "./iconoir_page.svg";
import Graph from "./graph.js";
import { Rating } from "@mui/material";
import { LoadTwo } from "../../../Modals/Loading";
import Event from "./event";
const Stats = () => {
  const [activeButton, setActiveButton] = useState("overall");
  const [showList1, setShowList1] = useState(false);
  const [selectedOption1, setSelectedOption1] = useState("Today");
  const [showList2, setShowList2] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState("Today");
  const [showList4, setShowList4] = useState(false);
  const [selectedOption4, setSelectedOption4] = useState("Last Month");

  const menuRef1 = useRef(null);
  const menuRef2 = useRef(null);
  const menuRef3 = useRef(null);
  const menuRef4 = useRef(null);

  // for checking the type of service we need to create --------------------------------------
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const paramsType = query.get("type");

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !menuRef1.current?.contains(e.target) &&
        !menuRef2.current?.contains(e.target) &&
        !menuRef3.current?.contains(e.target) &&
        !menuRef4.current?.contains(e.target)
      ) {
        setShowList1(false);
        setShowList2(false);
        setShowList4(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleDropmenuClick1 = () => {
    setShowList1(!showList1);
  };

  const handleOptionClick1 = (option) => {
    setSelectedOption1(option);
    setShowList1(false);
  };

  const handleDropmenuClick2 = () => {
    setShowList2(!showList2);
  };

  const handleOptionClick2 = (option) => {
    setSelectedOption2(option);
    setShowList2(false);
  };

  const handleDropmenuClick4 = () => {
    setShowList4(!showList4);
  };

  const handleOptionClick4 = (option) => {
    setSelectedOption4(option);
    setShowList4(false);
  };

  const handleButtonClick = (buttonName) => {
    navigate("/dashboard/stats");
    setActiveButton("overall");
  };

  const navigate = useNavigate();
  const [orderStats, setOrderStats] = useState(null);
  const [serviceStats, setServiceStats] = useState(null);
  const [avgStats, setavgStats] = useState(null);
  const [views, setViews] = useState(null);
  const [openLoading, setOpenLoading] = useState(false); // controlls the loader

  const handleDocumentClick = () => {
    setActiveButton("document");
    navigate("/dashboard/stats?type=document");
  };

  const handleEventClick = () => {
    setActiveButton("event");
    navigate("/dashboard/stats?type=event");
  };

  //{avgStats?.a}
  const { getOrderStats, getMaxService, getAvgRating, getViews } =
    useContext(creatorContext);

  useEffect(() => {
    setOpenLoading(true);
    const fetchOrderStats = async () => {
      try {
        const data = await getOrderStats(selectedOption4);
        setOpenLoading(false);
        setOrderStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrderStats();
  }, [selectedOption4]);

  // useEffect(() => {
  //   setOpenLoading(true)
  //   const fetchViews = async () => {
  //     try {
  //       const data = await getViews();
  //       setOpenLoading(false)
  //       if (data.success) {
  //         setViews(data.response);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchViews();
  // }, []);

  useEffect(() => {
    setOpenLoading(true);
    const fetchServiceStats = async () => {
      try {
        const data = await getMaxService();
        setOpenLoading(false);
        setServiceStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchServiceStats();
  }, []);

  useEffect(() => {
    const fetchAvgStats = async () => {
      try {
        const data = await getAvgRating();
        setavgStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAvgStats();
  }, []);

  let free_rate;
  free_rate = [
    avgStats?.one_star,
    avgStats?.two_star,
    avgStats?.three_star,
    avgStats?.four_star,
    avgStats?.five_star,
  ];
  let paid_rate;
  paid_rate = [
    avgStats?.one_star_p,
    avgStats?.two_star_p,
    avgStats?.three_star_p,
    avgStats?.four_star_p,
    avgStats?.five_star_p,
  ];

  let free_type = serviceStats?.free_max_type;
  let paid_type = serviceStats?.paid_max_type;
  let type_service, type_service_paid;
  if (free_type === 0) {
    type_service = "pdf";
  } else if (free_type === 1) {
    type_service = "excel";
  } else if (free_type === 2) {
    type_service = "video";
  }

  if (paid_type === 0) {
    type_service_paid = "pdf";
  } else if (paid_type === 1) {
    type_service_paid = "excel";
  } else if (paid_type === 2) {
    type_service_paid = "video";
  }

  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}

      <div className="outer_body_stats">
        <div className="text1_stats">Statistics</div>
        <p className="desc_stats">
          This is your Statistics Page. View and track your data here.
        </p>
        {/* <div className="button_list_stats">
          <button
            className={
              activeButton === "overall" ? "button_overall_active" : "overall"
            }
            onClick={() => handleButtonClick("overall")}
          >
            OVERALL
          </button>
          <button
            className={
              activeButton === "document"
                ? "button_document_active"
                : "document"
            }
            onClick={handleDocumentClick}
          >
            DOCUMENT
          </button>
          <button
            className={
              activeButton === "event" ? "button_event_active" : "event"
            }
            onClick={handleEventClick}
          >
            EVENT
          </button>
        </div> */}
        {/* <div className='profile_view_stats'>
        <div className='profile_text_stats'>
            <span>Profile Views</span>
            <div className="time_stats">
            <div className='date'>
               <img src={calendar} alt='Calendar' />
               <span>{selectedOption1}</span>
               </div>
                
              <div className={`dropmenu_stats ${showList1 ? 'active' : ''}`} onClick={handleDropmenuClick1} ref={menuRef1} >
                 <img src={below} alt='Dropdown Menu' />
                 {showList1 && (
                <ul className='list'>
                  <li onClick={() => handleOptionClick1('Today')}>Today</li>
                  <li onClick={() => handleOptionClick1('Last Week')}>Last Week</li>
                  <li onClick={() => handleOptionClick1('Last Month')}>Last Month</li>
                  <li onClick={() => handleOptionClick1('Last Year')}>Last Year</li>
                </ul>
                   )}
            </div>
            </div>

        </div>
        <div className='profile_graph_stats'>
            <div className='view_stats'>
                 <div className='frame_stats'>
                     <span className='num_stats'>{views?.uniquevisits}</span>
                     <span className='views_stats' >Total Views</span>
                 </div>
                </div>

            <div className='graph_stats'>
              
                 <Graph/>
               
            </div>
         </div>

       </div> */}
        {/* <div className='profile_view_stats'>
        <div className='profile_text_stats'>
            <span>Service Page Views</span>
            <div className="time_stats">
            <div className='date'>
               <img src={calendar} alt='Calendar' />
               <span>{selectedOption2}</span>
               </div>

              <div className={`dropmenu_stats ${showList2 ? 'active' : ''}`} onClick={handleDropmenuClick2} ref={menuRef2}>
                 <img src={below} alt='Dropdown Menu' />
                 {showList2 && (
                <ul className='list'>
                  <li onClick={() => handleOptionClick2('Today')}>Today</li>
                  <li onClick={() => handleOptionClick2('Last Week')}>Last Week</li>
                  <li onClick={() => handleOptionClick2('Last Month')}>Last Month</li>
                  <li onClick={() => handleOptionClick2('Last Year')}>Last Year</li>
                </ul>
                   )}
            </div>

            </div>

        </div>
        <div className='profile_graph_stats'>
            <div className='view_stats'>
                 <div className='frame_stats'>
                     <span className='num_stats'>2,39,045</span>
                     <span className='views_stats' >Total Views</span>
                 </div>
                </div>

            <div className='graph_stats'>

            </div>

            </div>

       </div> */}

        {/* {paramsType === "event" ? (
          <Event />
        ) : ( */}
          <>
            {(type_service || type_service_paid !== "0") && (
              <div className="profile_view_stats">
                <div className="profile_text_stats">
                  <span>Most Used Services</span>
                </div>
                <div className="profile_graph_stats">
                  <div className="service_stats">
                    <span className="service_free_stats">Free Service</span>
                    <div className="service_desc_stats">
                      <img
                        className="free_service_img"
                        src={serviceStats?.free_img}
                      />
                      <div className="detail_service">
                        <p className="service_title">
                          {serviceStats?.free_name}
                        </p>
                        {/* <span className='service_type'>
              {type_service}
            </span> */}
                      </div>
                    </div>
                    <div className="type">
                      <div className="service_type1">
                        <div className="outer_type">
                          <img src={doc} />
                          <div className="service_name">{type_service}</div>
                        </div>
                        <span className="total_download">
                          Downloads: {serviceStats?.free_max_download}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="service_stats">
                    <span className="service_free_stats">Paid Service</span>
                    <div className="service_desc_stats">
                      <img
                        className="free_service_img"
                        src={serviceStats?.paid_img}
                      />
                      <div className="detail_service">
                        <p className="service_title">
                          {serviceStats?.paid_name}
                        </p>
                        {/* <span className='service_type'>
              {type_service}
            </span> */}
                      </div>
                    </div>
                    <div className="type">
                      <div className="service_type1">
                        <div className="outer_type">
                          <img src={doc} />
                          <div className="service_name">
                            {type_service_paid}
                          </div>
                        </div>
                        <span className="total_download">
                          Earning: {serviceStats?.paid_max_earn}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            .
            <div className="profile_view_stats">
              <div className="profile_text_stats">
                <span>Orders</span>
                <div className="time_stats">
                  <div className="date">
                    <img src={calendar} alt="Calendar" />
                    <span>{selectedOption4}</span>
                  </div>

                  <div
                    className={`dropmenu_stats ${showList4 ? "active" : ""}`}
                    onClick={handleDropmenuClick4}
                    ref={menuRef4}
                  >
                    <img src={below} alt="Dropdown Menu" />
                    {showList4 && (
                      <ul className="list">
                        <li onClick={() => handleOptionClick4("Today")}>
                          Today
                        </li>
                        <li onClick={() => handleOptionClick4("Last Week")}>
                          Last Week
                        </li>
                        <li onClick={() => handleOptionClick4("Last Month")}>
                          Last Month
                        </li>
                        <li onClick={() => handleOptionClick4("Last Year")}>
                          Last Year
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="profile_graph_stats">
                <div className="view_stats">
                  <div className="frame_stats">
                    <span className="num_stats">
                      {orderStats?.tot_download}
                    </span>
                    <span className="views_stats">Total Orders</span>
                  </div>
                  <div className="order_stats">
                    <div className="free_order_stats">
                      <div className="inside_order_stats">
                        <span className="number_free_stats">
                          {orderStats?.free_download}
                        </span>
                        <span className="free_order_in_stats">Free Order</span>
                      </div>
                      <div className="line_stats"></div>
                      <div className="inside_order_stats">
                        <span className="number_paid_stats">
                          {orderStats?.paid_download}
                        </span>
                        <span className="paid_order_in_stats">Paid Order</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="graph_stats">
                  <Bar
                    show="order"
                    hr_arr={orderStats?.hr_arr}
                    hr_arr_p={orderStats?.hr_arr_p}
                    week_arr={orderStats?.weekArr}
                    week_arr_p={orderStats?.weekArrP}
                    month_arr={orderStats?.month_arr}
                    month_arr_p={orderStats?.month_arr_p}
                    data={orderStats?.data}
                    data_p={orderStats?.data_p}
                    selectedOption={selectedOption4}
                  />
                </div>
              </div>{" "}
            </div>
            <div className="profile_view_stats">
              <div className="profile_text_stats">
                <span>Average Ratings</span>
              </div>
              <div className="profile_graph_stats">
                <div className="view_stats">
                  <div className="frame_stats">
                    <span className="num_stats">
                      <div className="star_user">
                        <img src={big_star} />
                        <span className="total_rating_stats">
                          {isNaN(avgStats?.avg_rating)
                            ? 0
                            : avgStats?.avg_rating}
                        </span>

                        <span className="total_user">
                          ({avgStats?.total_user})
                        </span>
                      </div>
                    </span>
                    <span className="views_stats">Total Ratings</span>
                  </div>
                  <div className="order_stats">
                    <div className="free_order_stats">
                      <div className="inside_star_user">
                        <div className="inside_star_both">
                          <img src={blue_star} />
                          <span className="inside_star">
                            {isNaN(avgStats?.free_rating)
                              ? 0
                              : avgStats?.free_rating}
                          </span>
                          <span className="free_user">
                            ({avgStats?.free_user})
                          </span>
                        </div>

                        <span className="view_free_ser">Free Service</span>
                      </div>
                      <div className="line_stats"></div>
                      <div className="inside_star_user">
                        <div className="inside_star_both">
                          <img src={red_star} />
                          <span className="inside_star_red">
                            {isNaN(avgStats?.paid_rating)
                              ? 0
                              : avgStats?.paid_rating}
                          </span>
                          <span className="free_use_red">
                            ({avgStats?.paid_user})
                          </span>
                        </div>

                        <span className="view_free_ser_red">Paid Service</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="graph_stats">
                  <Bar
                    show="rating"
                    freeRate={free_rate}
                    paidRate={paid_rate}
                  />
                </div>
              </div>
            </div>
          </>

      </div>
    </>
  );
};

export default Stats;
