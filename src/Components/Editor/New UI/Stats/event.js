import React, { useState, useRef, useEffect, useContext } from "react";
import "./stats.css";
import Bar from './bargraph.js';
import { useNavigate,useLocation } from 'react-router-dom';
import calendar from './calendar.svg'
import below from './icon-park_down.svg';
import big_star from './Starbig.png';
import frame_service from './Frame.png';
import Stats from './stats.js';
import { LoadTwo } from "../../../Modals/Loading";
import { creatorContext } from "../../../../Context/CreatorState.js";
import Graph from './graph.js';
const Event = () => {
    const [activeButton, setActiveButton] = useState('event');
    const [showList1, setShowList1] = useState(false);
    const [selectedOption1, setSelectedOption1] = useState('Today');
    const [showList2, setShowList2] = useState(false);
    const [selectedOption2, setSelectedOption2] = useState('Today');
    const [showList3, setShowList3] = useState(false);
    const [selectedOption3, setSelectedOption3] = useState('Today');
    const [showList4, setShowList4] = useState(false);
    const [selectedOption4, setSelectedOption4] = useState('Last Month');
    const [regStats,  setRegStats] = useState(null);
    const [maxEventStats, setMaxEventStats] = useState(null);
    const [openLoading, setOpenLoading] = useState(false); // controlls the loader


    const menuRef1 = useRef(null);
    const menuRef2 = useRef(null);
    const menuRef3 = useRef(null);
    const menuRef4 = useRef(null);

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const paramsType = query.get("type");


      useEffect(() => {
        const handleOutsideClick = (e) => {
          if (

            //menuRef.current.contains(e.target) return if e.target is inside the menuRef

            !menuRef1.current.contains(e.target) &&
            !menuRef2.current.contains(e.target) &&
            !menuRef3.current.contains(e.target) &&
            !menuRef4.current.contains(e.target)
          ) {
            setShowList1(false);
            setShowList2(false);
            setShowList3(false);
            setShowList4(false);
          }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
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


      const handleDropmenuClick3 = () => {
        setShowList3(!showList3);
      };

      const handleOptionClick3 = (option) => {
        setSelectedOption3(option);
        setShowList3(false);
      };


      const handleDropmenuClick4 = () => {
        setShowList4(!showList4);
      };

      const handleOptionClick4 = (option) => {
        setSelectedOption4(option);
        setShowList4(false);
      };

    const navigate=useNavigate();

    const handleButtonClick = (buttonName) => {
        navigate('/dashboard/stats');
      setActiveButton('overall');
    };


    const handleDocumentClick = () => {
        setActiveButton('document');
        navigate("/dashboard/stats?type=document");
      };

      const handleEventClick = () => {
        setActiveButton('event');
        navigate("/dashboard/stats?type=event");
      };

   const{getMaxEvent,getEventReg}=useContext(creatorContext);

   useEffect(() => {
    setOpenLoading(true)
    const getEventRegis = async () => {
      try {
        const data = await getEventReg(selectedOption4);
        setOpenLoading(false)
        setRegStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    getEventRegis();
  }, [selectedOption4]);

  useEffect(() => {
    setOpenLoading(true)
    const getMaxEvents = async () => {
      try {
        const data = await getMaxEvent();
        setOpenLoading(false)
        setMaxEventStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    getMaxEvents();
  }, []);


  let mode_free,mode_paid;
  if(maxEventStats?. paid_max_mode===0)
  mode_paid='Offline';
  else
  mode_paid='Online'

   if(maxEventStats?.free_max_mode===0)
   mode_free='Offline';
   else
   mode_free='Online'


   if (paramsType === 'overall') {
    return <Stats />;
  }

  return (
    <>
     {/* {openLoading && <LoadTwo open={openLoading} />}
    <div className='outer_body_stats'> */}

{/* <div className='text1_stats'>Statistics</div>
      <p className='desc_stats'>This is your Statistics Page. View and track your data here.</p>
      <div className='button_list_stats'>
        <button
          className={activeButton === 'overall' ? 'button_overall_active' : 'overall'}
          onClick={() => handleButtonClick('overall')}
        >
          OVERALL
        </button>
        <button
          className={activeButton === 'document' ? 'button_document_active' : 'document'}
          onClick={handleDocumentClick}
        >
          DOCUMENT

        </button>
        <button
          className={activeButton === 'event' ? 'button_event_active' : 'event'}
          onClick={handleEventClick}
        >
          EVENT
        </button>
      </div> */}


      <div className='profile_view_stats'>
        <div className='profile_text_stats'>
            <span>Event Page Views</span>
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
                     <span className='num_stats'>2,39,045</span>
                     <span className='views_stats' >Total Views</span>
                 </div>
                </div>

            <div className='graph_stats'>

            </div>

            </div>

       </div>

       <div className='profile_view_stats'>
        <div className='profile_text_stats'>
            <span>Conversion Rate</span>
            <div className="time_stats">
            <div className='date'>
               <img src={calendar} alt='Calendar' />
               <span>{selectedOption2}</span>
               </div>

              <div className={`dropmenu_stats ${showList2 ? 'active' : ''}`} onClick={handleDropmenuClick2} ref={menuRef2} >
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
                     <span className='num_stats'>12,679</span>
                     <span className='views_stats' >Total Views</span>
                 </div>
                </div>

            <div className='graph_stats'>

                {/* <Bar/> */}

            </div>
         </div>

       </div>

       {mode_free !== '0' ||mode_paid !== '0' && (
       <div className="profile_view_stats">
          <div className="profile_text_stats">
            <span>Most Popular Event</span>
          </div>
          <div className="profile_graph_stats">
            <div className="service_stats">
              <span className="service_free_stats">Free Event</span>
              <div className="service_desc_stats">
                <img
                  className="free_service_img"
                  src={regStats?.free_img}
                />
                <div className="detail_service">
                  <p className="service_title">{maxEventStats?.free_name}</p>
                  {/* <span className='service_type'>
                      {type_service}
                      </span> */}
                </div>
              </div>
              <div className="type">
                <div className="service_type1">
                  <div className="outer_type">
                    {/* <img src={doc} /> */}
                    <div className="service_name">{mode_free}</div>
                  </div>
                  <span className="total_download">
                    Registration:{maxEventStats?.free_max_download}
                  </span>
                </div>
              </div>
            </div>

            <div className="service_stats">
              <span className="service_free_stats">Paid Event</span>
              <div className="service_desc_stats">
                <img
                  className="free_service_img"
                  src={regStats?.paid_img}
                />
                <div className="detail_service">
                  <p className="service_title">{maxEventStats?.paid_name}</p>
                  {/* <span className='service_type'>
                      {type_service}
                      </span> */}
                </div>
              </div>
              <div className="type">
                <div className="service_type1">
                  <div className="outer_type">
                    {/* <img src={doc} /> */}
                    <div className="service_name">{mode_paid}</div>
                  </div>
                  <span className="total_download">
                    Earning:{maxEventStats?.paid_max_earn}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>)}

       <div className='profile_view_stats'>
        <div className='profile_text_stats'>
            <span>Register for Event</span>
            <div className="time_stats">
            <div className='date'>
               <img src={calendar} alt='Calendar' />
               <span>{selectedOption4}</span>
               </div>

              <div className={`dropmenu_stats ${showList4 ? 'active' : ''}`} onClick={handleDropmenuClick4} ref={menuRef4} >
                 <img src={below} alt='Dropdown Menu' />
                 {showList4 && (
                <ul className='list'>
                  <li onClick={() => handleOptionClick4('Today')}>Today</li>
                  <li onClick={() => handleOptionClick4('Last Week')}>Last Week</li>
                  <li onClick={() => handleOptionClick4('Last Month')}>Last Month</li>
                  <li onClick={() => handleOptionClick4('Last Year')}>Last Year</li>
                </ul>
                   )}
            </div>

            </div>

        </div>
        <div className="profile_graph_stats">
            <div className="view_stats">
              <div className="frame_stats">
                <span className="num_stats">{regStats?.tot_download}</span>
                <span className="views_stats">Total Registration</span>
              </div>
              <div className="order_stats">
                <div className="free_order_stats">
                  <div className="inside_order_stats">
                    <span className="number_free_stats">
                      {regStats?.free_download}
                    </span>
                    <span className="free_order_in_stats">
                    Free Registration
                    </span>
                  </div>
                  <div className="line_stats"></div>
                  <div className="inside_order_stats">
                    <span className="number_paid_stats">
                      {regStats?.paid_download}
                    </span>
                    <span className="paid_order_in_stats">Paid Registration</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="graph_stats">
              <Bar
                show="order"
                hr_arr={regStats?.hr_arr}
                hr_arr_p={regStats?.hr_arr_p}
                week_arr={regStats?.weekEvent}
                week_arr_p={regStats?.weekEventp}
                month_arr={regStats?.month_arr}
                month_arr_p={regStats?.month_arr_p}
                data={regStats?.yearEvent}
                data_p={regStats?.yearEventp}
                selectedOption={selectedOption4}
              />
            </div>
          </div>

       </div>


       <div className='profile_view_stats'>
        <div className='profile_text_stats'>
            <span>Average Ratings</span>


        </div>
        <div className='profile_graph_stats'>
            <div className='view_stats'>
                 <div className='frame_stats'>
                     <span className='num_stats'>
                        <div className='star_user'>
                        <img src={big_star}/>
                        <span className='total_rating_stats'>4.5</span>

                        <span className='total_user'>(660 User)</span>
                        </div>

                     </span>
                     <span className='views_stats' >Total Ratings</span>
                 </div>
                 <div className='order_stats'>
                     <div className='free_order_stats'>
                        <div className='inside_order_stats'>
                             <span className='number_free_stats'>400</span>
                             <span className='free_order_in_stats'>Free Order</span>
                        </div>
                        <div className='line_stats'>
                        </div>
                        <div className='inside_order_stats'>
                             <span className='number_paid_stats'>150</span>
                             <span className='paid_order_in_stats'>Paid Order</span>


                        </div>

                     </div>
                 </div>
                </div>

            <div className='graph_stats'>
            {/* <Bar/> */}

            </div>

            </div>

       </div>

    {/* </div> */}
    </>
  )
}

export default Event;