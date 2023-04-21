import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Table,
  TableRow,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { creatorContext } from "../../../../Context/CreatorState";
import ShowReviewModel from "../../../Modals/ShowReviewModel";
import { LoadTwo } from "../../../Modals/Loading";
import "./UserReview.css";
import { SuperSEO } from "react-super-seo";
import { ToastContainer, toast } from "react-toastify";
import { Button1 } from "../Create Services/InputComponents/buttons";
import { useNavigate, useParams } from "react-router-dom";
import ServiceContext from "../../../../Context/services/serviceContext";
import { AiOutlinePlus } from "react-icons/ai";

const UserReviews = ({creatorSlug}) => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [openModel, setOpenModel] = useState(false);
  const [changeStatus, setChangeStatus] = useState(1);
  const [openLoading, setOpenLoading] = useState(false);
  const { getAllFeedbacks, FeedbackStats } = useContext(creatorContext);
  const { getfeedbacksfromslug } = useContext(ServiceContext);
  const [feedbacks, setfeedbacks] = useState();
  const [feedbackStats, setfeedbackStats] = useState();
  const [selected, setSELECTED] = useState(null);
  const [dummyData, setdummyData] = useState(false);
  const [noData, setnoData] = useState(false);
  const [firstService, setfirstService] = useState(true);      // wheather a creator has its first service or not  ------ true means firstservice is present

  useEffect(() => {
    setOpenLoading(true);
    setnoData(false);
    setfeedbackStats();
    if (slug) {
      getfeedbacksfromslug(slug).then((e) => {
        if (e?.success) {
          setfeedbacks(e?.res);
          setfeedbackStats(e?.stats);
          setOpenLoading(false);
          if (e?.res?.length === 0) {
            setnoData(true);
          }
        } else if (!e?.creator) {
          navigate("/reviews");
        }
      });
    } else {
      getAllFeedbacks().then((e) => {
        setfeedbacks(e[0]);
        setdummyData(e[1]);
        setfirstService(e[2])
        setOpenLoading(false);
      });
    }
  }, [slug]);

  const handleCheckClick = (elem) => {
    setSELECTED(elem);
    if (!elem.status) {
      // means now it is checked

      setChangeStatus(1);
      setOpenModel(true);
    } else {
      // means now it is unchecked
      setChangeStatus(0);
      setOpenModel(true);
    }
  };

  const handleCopyLink = () =>{
    navigator.clipboard.writeText(`https:www.anchors.in/c/${creatorSlug}`)
    toast.info("Copied link successfully",{
      position:"top-center",
      autoClose:2000
    })
  }


  return (
    <>
      {openLoading && <LoadTwo open={openLoading} />}

      <div className="servicelist-wrapper">
        <h1>Audience Reviews</h1>
        <span className="servicelist_wrap_span">
          Get your detailed user reviews here.
        </span>
        <div className="usereview_details">
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 16.25L14.4375 11.9375L18.75 10L14.4375 8.0625L12.5 3.75L10.5625 8.0625L6.25 10L10.5625 11.9375L12.5 16.25ZM0 25V2.5C0 1.8125 0.245 1.22375 0.735 0.73375C1.22417 0.244583 1.8125 0 2.5 0H22.5C23.1875 0 23.7763 0.244583 24.2663 0.73375C24.7554 1.22375 25 1.8125 25 2.5V17.5C25 18.1875 24.7554 18.7763 24.2663 19.2663C23.7763 19.7554 23.1875 20 22.5 20H5L0 25Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="userreview_detailedno">
              <span>Total Reviews</span>
              <h3>
                {!noData && (feedbackStats?.total || FeedbackStats?.total)}
              </h3>
            </div>
          </div>
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 16.25L14.4375 11.9375L18.75 10L14.4375 8.0625L12.5 3.75L10.5625 8.0625L6.25 10L10.5625 11.9375L12.5 16.25ZM0 25V2.5C0 1.8125 0.245 1.22375 0.735 0.73375C1.22417 0.244583 1.8125 0 2.5 0H22.5C23.1875 0 23.7763 0.244583 24.2663 0.73375C24.7554 1.22375 25 1.8125 25 2.5V17.5C25 18.1875 24.7554 18.7763 24.2663 19.2663C23.7763 19.7554 23.1875 20 22.5 20H5L0 25Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="userreview_detailedno">
              <span>5 Star Reviews</span>
              <h3>
                {!noData &&
                  (feedbackStats?.fiveStar || FeedbackStats?.fiveStar)}
              </h3>
            </div>
          </div>
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 16.25L14.4375 11.9375L18.75 10L14.4375 8.0625L12.5 3.75L10.5625 8.0625L6.25 10L10.5625 11.9375L12.5 16.25ZM0 25V2.5C0 1.8125 0.245 1.22375 0.735 0.73375C1.22417 0.244583 1.8125 0 2.5 0H22.5C23.1875 0 23.7763 0.244583 24.2663 0.73375C24.7554 1.22375 25 1.8125 25 2.5V17.5C25 18.1875 24.7554 18.7763 24.2663 19.2663C23.7763 19.7554 23.1875 20 22.5 20H5L0 25Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="userreview_detailedno">
              <span>1 Star Reviews</span>
              <h3>
                {!noData && (feedbackStats?.oneStar || FeedbackStats?.oneStar)}
              </h3>
            </div>
          </div>
        </div>
        <ShowReviewModel
          id={selected?.id}
          status={changeStatus}
          open={openModel}
          onClose={() => {
            setOpenModel(false);
          }}
        />
        <div className="servicelist-table">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">S.No</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Service Name</TableCell>
                  <TableCell align="center">Ratings</TableCell>
                  <TableCell align="center">Review</TableCell>
                  <TableCell align="center">Review Date</TableCell>
                  <TableCell align="center">Display on Your Page</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbacks?.map((elem, i) => {
                  return (
                    <>
                      <TableRow key={i}>
                        <TableCell align="center">{i + 1}</TableCell>
                        <TableCell align="center">
                          {elem.user.name ? elem.user.name : "--"}
                        </TableCell>
                        <TableCell align="center">{elem.sname}</TableCell>
                        <TableCell align="center">{elem.rating}</TableCell>
                        <TableCell align="center">{elem.desc}</TableCell>
                        <TableCell align="center">{elem.date}</TableCell>
                        <TableCell align="center">
                          <span>
                            {/* <label className="switch2">
                                       <input
                                        type="checkbox"
                                        id={`checkbox_${i + 1}`}
                                        checked={elem.status}
                                      />
                                      <span className="slider2 round2"></span>
                                    </label> */}
                            <label className="switch_type_01">
                              <input
                                id={`checkbox_${i + 1}`}
                                type="checkbox"
                                checked={elem.status}
                                onChange={() =>
                                  !dummyData && handleCheckClick(elem)
                                }
                              />
                              <span className="slider_type_01 round_type_01"></span>
                            </label>
                          </span>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {dummyData && (
          <div className="cta_dummy_data">
            <span>{firstService ? `This is sample data, Share your profile page with your audience to get reviews ` :`This is sample data , start creating your first service for your data`}</span>
        <Button1 text={firstService ? `Copy Profile Page Link` :`Create your First Service` } icon={!firstService && <AiOutlinePlus size={18} width={30}/>} width="268px" onClick={()=>{firstService ? handleCopyLink() : navigate("/dashboard")}}/>
      </div>
        )}
      </div>
      <SuperSEO title="Anchors - User reviews" />
      <ToastContainer/>
    </>
  );
};

export default UserReviews;
