import React from 'react'
import { useContext,useState,useEffect } from 'react';
import { creatorContext } from '../../Context/CreatorState';
import RequestDetail from './Request Details/RequestDetail';
import { LoadTwo } from "../Modals/Loading";
import "./Requests.css"
import { SuperSEO } from 'react-super-seo';

function Requests() {
  //const [openLoading, setOpenLoading] = useState(true)
  const {getUserQueries,RequestsStats} = useContext(creatorContext)
  const [querries, setQuerries] = useState()
  const [openLoading, setopenLoading] = useState(false)


  useEffect(() => {
    setopenLoading(true)
    getUserQueries().then((e)=>{
      setQuerries(e)
      setopenLoading(false)
    })
  }, [])
  

  return (
    <>
      <div className="review_list_page">
        <h2>Requested Resources from users</h2>
        <div className="subs_count_box">
          <div className="subs_box">
            <span>{RequestsStats?.total}</span>
            <span>Total Requests</span>
          </div>
          <div className="subs_box">
            <span>{RequestsStats?.ispaid}</span>
            <span>Ready To pay</span>
          </div>
          <div className="subs_box">
            <span>{RequestsStats?.free}</span>
            <span>Free Resources</span>
          </div>
        </div>

        
        <div className="request_table_head">
          <span>S.No.</span>
          <span>Name</span>
          <span>Requested resources</span>
          <span>Ready to pay</span>
          <span>Requested Date</span>
        </div>
      </div>

      {openLoading && <LoadTwo open={openLoading}/>}
      <div className="review_details_body">
        {querries?.length !==0? querries?.map((e,i) => {
             return (
              <RequestDetail key={i} sno={i+1} name={e.user.name} desc={e.desc} willPay={e.willPay} date={e.date} />
              
             ); 
         }):
          <h1 className="no_services">No requests to display</h1>
        } 
      </div>
      <SuperSEO
        title="Anchors - Request Resources"
      />
    </>
  );
      }


export default Requests