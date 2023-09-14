import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Table,
  TableRow,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { creatorContext } from "../../../../Context/CreatorState";
import ShowReviewModel from "../../../Modals/ShowReviewModel";
import { LoadTwo } from "../../../Modals/Loading";
import "./UserReview.css";
import { SuperSEO } from "react-super-seo";
import { ToastContainer, toast } from "react-toastify";
import { Button1, Button2 } from "../Create Services/InputComponents/buttons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ServiceContext from "../../../../Context/services/serviceContext";
import { AiOutlinePlus } from "react-icons/ai";
import { BiCommentAdd } from "react-icons/bi";

const UserReviews = ({ creatorSlug }) => {
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
  const [isHoveredTooltip, setIsHoveredTooltip] = useState(false);
  const [firstService, setfirstService] = useState(true); // wheather a creator has its first service or not  ------ true means firstservice is present

  // custom hook to get querries
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery();

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
          navigate("/dashboard/reviews");
        }
      });
    } else {
      getAllFeedbacks().then((e) => {
        setfeedbacks(e[0]);
        setdummyData(e[1]);
        setfirstService(e[2]);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https:www.anchors.in/${creatorSlug}`);
    toast.info("Copied link successfully", {
      position: "top-center",
      autoClose: 2000,
    });
  };

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
            <BiCommentAdd color="#d0d0d0" size={30}/>
            </div>
            <div className="userreview_detailedno">
              <span>Total Reviews</span>
              <h3>
                {!noData ? feedbackStats?.total || FeedbackStats?.total : 0}
              </h3>
            </div>
          </div>
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
            <BiCommentAdd color="#d0d0d0" size={30}/>
            </div>
            <div className="userreview_detailedno">
              <span>5 Star Reviews</span>
              <h3>
                {!noData
                  ? feedbackStats?.fiveStar || FeedbackStats?.fiveStar
                  : 0}
              </h3>
            </div>
          </div>
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
            <BiCommentAdd color="#d0d0d0" size={30}/>
            </div>
            <div className="userreview_detailedno">
              <span>1 Star Reviews</span>
              <h3>
                {!noData ? feedbackStats?.oneStar || FeedbackStats?.oneStar : 0}
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
        <div
          className="servicelist-table"
          onMouseEnter={() => {
            dummyData && setIsHoveredTooltip(true);
          }}
          onMouseLeave={() => {
            dummyData && setIsHoveredTooltip(false);
          }}
        >
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

          {dummyData && isHoveredTooltip && (
            <div className="opacity-layer-over-table">
              {firstService
                ? `This is sample data, Share your profile page with your audience to get reviews `
                : `This is sample data , start creating your first service for your data`}
            </div>
          )}

          {dummyData && (
            <div className="cta_dummy_data">
              <Button2
                text={
                  firstService
                    ? `Copy Profile Page Link`
                    : `Create your First Service`
                }
                icon={!firstService && <AiOutlinePlus size={18} width={30} />}
                width="268px"
                onClick={() => {
                  firstService ? handleCopyLink() : navigate("/dashboard");
                }}
              />
            </div>
          )}
        </div>
      </div>
      <SuperSEO title="Anchors - User reviews" />
      <ToastContainer />
    </>
  );
};

export default UserReviews;
