
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import { creatorContext } from "../../../../Context/CreatorState";
import { LoadTwo } from "../../../Modals/Loading";
import { Button1, Button2 } from "../Create Services/InputComponents/buttons";
import "./UserRequest.css";
import { AiOutlinePlus, AiFillGift } from "react-icons/ai";
import { MdShoppingCart } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import { Table1 } from "../Create Services/InputComponents/fields_Labels";

const UserRequest = ({ creatorSlug }) => {
  const navigate = useNavigate();
  const { getUserQueries, RequestsStats } = useContext(creatorContext);
  const [querries, setQuerries] = useState();
  const [openLoading, setopenLoading] = useState(false);
  const [dummyData, setdummyData] = useState(false);
  const [isHoveredTooltip, setIsHoveredTooltip] = useState(false);
  const [firstService, setfirstService] = useState(true); // wheather a creator has its first service or not  ------ true means firstservice is present

  useEffect(() => {
    setopenLoading(true);
    getUserQueries().then((e) => {
      setQuerries(e[0]);
      setdummyData(e[1]);
      setfirstService(e[2]);
      setopenLoading(false);
    });
  }, []);

  const renderdate1 = (date) => {
    const splity = date.split(",");
    return splity[0];
  };

  const renderdate2 = (date) => {
    const splity = date.split(",");
    return splity[1];
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https:www.anchors.in/c/${creatorSlug}`);
    mixpanel.track("Copy Profile Page Link ");
    toast.info("Copied link successfully", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  return (
    <>
      <div className="servicelist-wrapper">
        <h1 className="text_type01_payment_info">Audience Requests</h1>
        <span className="servicelist_wrap_span">
          Quick glimpse of what your audience wants from you
        </span>
        <div className="usereview_details">
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <FaClipboardList color="#d0d0d0" size={30} />
            </div>
            <div className="userreview_detailedno">
              <span>Total Requests</span>
              <h3>{RequestsStats?.total}</h3>
            </div>
          </div>
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <MdShoppingCart color="#d0d0d0" size={30} />
            </div>
            <div className="userreview_detailedno">
              <span>Ready to Pay</span>
              <h3>{RequestsStats?.ispaid}</h3>
            </div>
          </div>
          <div className="userreview_detail1">
            <div className="userreview_detail_svg">
              <AiFillGift color="#d0d0d0" size={30} />
            </div>
            <div className="userreview_detailedno">
              <span>Free Resources</span>
              <h3>{RequestsStats?.free}</h3>
            </div>
          </div>
        </div>
        {openLoading && <LoadTwo open={openLoading} />}

        <div
          className="userrequest-table"
          onMouseEnter={() => {
            dummyData && setIsHoveredTooltip(true);
          }}
          onMouseLeave={() => {
            dummyData && setIsHoveredTooltip(false);
          }}
        >
          <Table1
            headArray={[
              "Sr.No",
              "Name",
              "Resources Requested",
              "Ready to pay",
              "Requested date",
            ]}
            bodyArray={querries?.map((elem, i) => {
              return [
                i + 1,
                elem.user.name ? elem.user.name : "--",
                elem.desc,
                elem.willPay === true ? "Yes" : "No",
                <p>{renderdate1(elem.date)} <br></br>
                {renderdate2(elem.date)}</p>,
              ];
            })}
            gridConfig="8% 23% 29% 18% 22%"
          />

          {dummyData && isHoveredTooltip && (
            <div className="opacity-layer-over-table">
              {firstService
                ? `This is sample data, Share your profile page with your audience to get requests `
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
      <SuperSEO title="Anchors - User requests" />
      <ToastContainer />
    </>
  );
};

export default UserRequest;
