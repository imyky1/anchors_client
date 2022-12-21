import React from 'react'
import { useContext,useEffect,useState } from 'react';
import { creatorContext } from '../../Context/CreatorState';
import ReviewDetail from './Review Details/ReviewDetail';
import "./Reviews.css"
import { LoadTwo } from "../Modals/Loading";
import { SuperSEO } from 'react-super-seo';

function Reviews(props) {
const [openLoading, setOpenLoading] = useState(false)
const {getAllFeedbacks,FeedbackStats} = useContext(creatorContext)
const [feedbacks, setfeedbacks] = useState()


useEffect(() => {
  setOpenLoading(true)
  getAllFeedbacks().then((e)=>{
    setfeedbacks(e)
    setOpenLoading(false)
  })

}, [])


  return (
    <>
      <div className="review_list_page">
        <h2>User Reviews</h2>
        <div className="subs_count_box">
          <div className="subs_box">
            <span>{FeedbackStats?.total}</span>
            <span>Total Reviews</span>
          </div>
          <div className="subs_box">
            <span>{FeedbackStats?.fiveStar}</span>
            <span>5 Star Reviews</span>
          </div>
          <div className="subs_box">
            <span>{FeedbackStats?.oneStar}</span>
            <span>1 Star Reviews</span>
          </div>
        </div>

        
        <div className="review_table_head">
          <span>S.No.</span>
          <span>Name</span>
          <span>Service Name</span>
          <span>Rating</span>
          <span>Review</span>
          <span>Review Date</span>
          <span>Display on your page</span>
        </div>
      </div>

      {openLoading && <LoadTwo open={openLoading}/>}
      <div className="review_details_body">
        {feedbacks?.length !==0? feedbacks?.map((e,i) => {
            return (
              <ReviewDetail
              key={i}
              sno={i+1}
              id={e.id}
              name={e.user.name}
              sname = {e.sname}
              rating={e.rating}
              desc={e.desc}
              status={e.status}
              date={e.date}
              progress={props.progress}
              />
            )
          
        }):
          <h1 className="no_services">No reviews to display</h1>
      }
      </div>
      <SuperSEO
        title="Anchors - Reviews"
      />
    </>
  );
      }




export default Reviews