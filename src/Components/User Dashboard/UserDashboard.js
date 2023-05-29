import React, { useContext, useEffect, useState } from "react";
import "./UserDashboard.css";
import Navbar from "../Layouts/Navbar User/Navbar";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";
import Footer2 from "../Footer/Footer2";
import DocIcon from "../../Utils/Icons/iconDocs.svg";
import SheetIcon from "../../Utils/Icons/iconSheet.svg";
import VideoIcon from "../../Utils/Icons/iconVideo.svg";
import EventIcon from "../../Utils/Icons/iconEvent.svg";
import ImageIcon from "../../Utils/Icons/iconImage.svg";
import { UserDashbaord } from "../../Context/userdashbaord";
import { LoadThree } from "../Modals/Loading";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../Modals/Feedback_Modal";
import { ToastContainer } from "react-toastify";
import mixpanel from "mixpanel-browser";

let Dummyimg =
  "data:image/png;base64,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";

const PageOptions = [
  { id: "all", name: "All" },
  { id: "documents", name: "Documents" },
  { id: "excel", name: "Excel Sheets" },
  { id: "videos", name: "Videos" },
  { id: "event", name: "Events" },
  { id: "image", name: "Image Assets" },
];

const CreatorCard = ({ name, photo, setSelectedCreator, selected }) => {
  return (
    <div className="creator_card_user_dashboard" onClick={setSelectedCreator}>
      <div
        className={`outline_stroke_selected_creator ${
          selected && "active_stroke_selected_creator"
        }`}
      >
        <img
          src={photo ? photo : Dummyimg}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = Dummyimg;
          }}
        />
      </div>
      <span>{name?.split(" ")[0]}</span>
    </div>
  );
};

const SelectedCreatorCard = ({ serviceCount, name, photo, slug }) => {
  return (
    <div className="selected_creator_user_db">
      <img
        src={photo ? photo : Dummyimg}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = Dummyimg;
        }}
        alt=""
        onClick={() => {
          mixpanel.track("Dashboard Creator Profile",{
            creatorSlug:slug
          })
          window.open(`/c/${slug}`);
        }}
      />
      <section>
        <p>
          <b>{serviceCount}</b> Unlocked Items from{" "}
        </p>
        <span>{name}</span>
      </section>
    </div>
  );
};

const ServiceCard = ({ name, type, slug, surl, reviewed , openFbModal }) => {
  const navigate = useNavigate();

  const handleView = (e) => {
    e?.stopPropagation();
    mixpanel.track("View Now",{
      serviceSlug:slug
    })
    sessionStorage.setItem("link", surl);
    if (type === 1) {
      navigate("/viewExcel");
    } else {
      navigate("/viewPdf");
    }
  };

  return (
    <>
      <div
        className="service_card_user_db"
        onClick={() => {
          window.open(`/s/${slug}`);
        }}
      >
        <span className="service_card_tag">
          {type === 1 ? "Excel Sheet" : type === 2 ? "Videos" : "Document"}
        </span>

        <section className="service_card_details">
          <img
            src={type === 1 ? SheetIcon : type === 2 ? VideoIcon : DocIcon}
            alt=""
          />
          <span>{name}</span>
        </section>

        <section className="service_card_buttons">
          {reviewed ? (
            <button
              onClick={(e) => {
                e?.stopPropagation();
              }}
            >
              {" "}
              <AiOutlineCheck color="#369D6E" /> Reviewed{" "}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e?.stopPropagation();
                mixpanel.track("Write Review",{
                  serviceSlug:slug
                })
                openFbModal()
              }}
            >
              Write Review{" "}
            </button>
          )}
          <button onClick={handleView}>View Now</button>
        </section>
      </div>
    </>
  );
};

const NoServiceHanlder = ({ option, selectedCreator }) => {
  return (
    <section className="optional_info_service_section_user_db">
      <img
        src={
          option === "image"
            ? ImageIcon
            : option === "event"
            ? EventIcon
            : option === "excel"
            ? SheetIcon
            : option === "videos"
            ? VideoIcon
            : DocIcon
        }
        alt=""
      />
      <span>
        Oops you have no {option !== "event" && "services of"}{" "}
        {`${
          option === "image"
            ? "Image assets"
            : option === "event"
            ? "Events"
            : option === "excel"
            ? "Excel Sheets"
            : option === "videos"
            ? "Videos"
            : "Documents"
        }`}{" "}
        from creator{" "}
      </span>
      {selectedCreator?.id && (
        <button
          onClick={() => {
            window.open(`/c/${selectedCreator?.slug}`);
          }}
        >
          Explore{" "}
        </button>
      )}
    </section>
  );
};

function UserDashboard(props) {
  // States ------------------------
  const [selectedCreator, setSelectedCreator] = useState();
  const [countServices, setCountServices] = useState();
  const [option, setOption] = useState("all");
  const [servicesArray, setServicesArray] = useState([]);
  const [openLoading, setOpenLoading] = useState(false);
  const [fbModalDetails, setFbModalDetails] = useState({
    open: false,
    service: {},
    stype: "",
  }); // feedback modal details opening and details ----

  // COntexts ----------

  const {
    getallcreatorsofuser,
    userCreators,
    getallordersofuser,
    alluserDocs,
  } = useContext(UserDashbaord);

  useEffect(() => {
    mixpanel.track("Page Visit")
    setOpenLoading(true);
    getallcreatorsofuser().then(() => {
      setOpenLoading(false);
    });
    getallordersofuser().then(() => {
      setOpenLoading(false);
    });
  }, []);

  // get the count for the selected creator
  useEffect(() => {
    setCountServices(
      alluserDocs
        ?.filter((e) => {
          return e?.service?.sname && e?.service?.status !== 0;
        })
        ?.filter((e) => {
          return e?.service?.c_id === selectedCreator?.id;
        }).length
    );
  }, [selectedCreator]);

  // refresh the services every time the following options are changed
  useEffect(() => {
    getServicesArray();
  }, [option, alluserDocs, selectedCreator]);

  // Functions --------------------------

  const handleOptionClick = (option) => {
    setOption(option);
  };

  // COntrols the service in the user dashboard based on selected creator and the option
  const getServicesArray = () => {
    setOpenLoading(true);
    let finalArr2 = [];
    let finalArr1 = alluserDocs?.filter((e) => {
      return e?.service?.sname && e?.service?.status !== 0;
    });

    switch (option) {
      case "all":
        finalArr2 = finalArr1;
        break;
      case "documents":
        finalArr2 = finalArr1?.filter((e) => {
          return e?.service?.stype === 0;
        });
        break;
      case "excel":
        finalArr2 = finalArr1?.filter((e) => {
          return e?.service?.stype === 1;
        });
        break;
      case "videos":
        finalArr2 = finalArr1?.filter((e) => {
          return e?.service?.stype === 2;
        });
        break;
      case "event":
        finalArr2 = finalArr1?.filter((e) => {
          return e?.service?.stype === 3;
        });
        break;
      case "image":
        finalArr2 = finalArr1?.filter((e) => {
          return e?.service?.stype === 4;
        });
        break;

      default:
        finalArr2 = finalArr1;
        break;
    }

    if (selectedCreator?.id) {
      setOpenLoading(false);
      setServicesArray(
        finalArr2?.filter((e) => {
          return (
            selectedCreator?.id && e?.service?.c_id === selectedCreator?.id
          );
        })
      );
    } else {
      setOpenLoading(false);
      setServicesArray(finalArr2);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer/>

      {openLoading && <LoadThree />}

      {/* Feedback Modal -------------------- */}
      <FeedbackModal
        open={fbModalDetails?.open}
        onClose={() => {
          setFbModalDetails({ ...fbModalDetails, open: false });
        }}
        progress={props.progress}
        name={fbModalDetails?.service?.sname}
        slug={fbModalDetails?.service?.slug}
        id={fbModalDetails?.service?._id}
        reload={true}
      />

      <div className="main_wrapper_user_dashboard">
        {/* Creator section user dashboard */}
        <div className="user_dashboard_creator_section">
          <section>
            {userCreators
              ?.filter((e) => {
                return e?.creatorID?.status !== 0;
              })
              ?.map((e) => {
                return (
                  <CreatorCard
                    key={e?.creatorID?.slug}
                    name={e?.name}
                    selected={e?.creatorID?._id === selectedCreator?.id}
                    photo={e?.profile}
                    setSelectedCreator={() => {
                      setSelectedCreator({
                        id: e?.creatorID?._id,
                        name: e?.name,
                        photo: e?.profile,
                        slug: e?.creatorID?.slug,
                      });
                    }}
                  />
                );
              })}
          </section>
          {userCreators.length > 13 && <BsChevronDown />}
        </div>

        {/* Selected Creator Card for Mobile */}
        {window.screen.width < 650 && selectedCreator?.id && (
          <SelectedCreatorCard
            serviceCount={countServices}
            name={selectedCreator?.name}
            slug={selectedCreator?.slug}
            photo={selectedCreator?.photo}
          />
        )}

        {/* Options in user Dashboard */}
        <div className="options_section_user_dashboard">
          {PageOptions.map((e) => {
            return (
              <span
                className={`${
                  option === e?.id && "active_option_user_dashboard"
                } options_span_user_dashboard`}
                key={e?.id}
                onClick={() => {
                  mixpanel.track(e?.name)
                  handleOptionClick(e?.id);
                }}
              >
                {e?.name}
              </span>
            );
          })}
        </div>

        {/* Selected Creator Card for Desktop */}
        {window.screen.width > 650 && selectedCreator?.id && (
          <SelectedCreatorCard
            serviceCount={countServices}
            name={selectedCreator?.name}
            slug={selectedCreator?.slug}
            photo={selectedCreator?.photo}
          />
        )}

        {/* Service Cards of selected Creator */}
        {servicesArray?.length !== 0 ? (
          <div className="services_section_user_dashboard">
            {/* If the creator is selected or not */}
            {servicesArray?.map((e) => {
              return (
                <ServiceCard
                  key={e?.service?.slug}
                  type={e?.service?.stype}
                  name={e?.service?.sname}
                  slug={e?.service?.slug}
                  surl={e?.service?.surl}
                  reviewed={e?.Reviewed}
                  openFbModal={()=>{
                    setFbModalDetails({
                      ...fbModalDetails,
                      open: true,
                      service: { sname: e?.service?.sname, slug: e?.service?.slug, _id: e?.service?._id },
                    });
                  }}
                />
              );
            })}
          </div>
        ) : (
          <NoServiceHanlder option={option} selectedCreator={selectedCreator} />
        )}
      </div>

      <Footer2 />
    </>
  );
}

export default UserDashboard;
