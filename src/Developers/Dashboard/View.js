import React, { useState, useEffect } from "react";
import { host } from "../../config/config";
import { useNavigate } from "react-router-dom";
import "./View.css";
import Moment from "moment";
import { AiOutlineClose } from "react-icons/ai";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";

const OtpModal = ({ onClose,cid,currentStatus }) => {
  const [data, setData] = useState();
  const [cookies, setCookie] = useCookies();

  const CheckOTP = async () => {
    if (data?.length !== 6) {
      toast.info("Enter a proper code", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      let code = cookies?.ccoondfe;
      if (!code) {
        toast.error("OTP was valid for 1 minute, Please retry again", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        if (parseInt(data) === parseInt(parseInt(code) / 562002)) {
          const response = await fetch(`${host}/api/developer/devChangeCreatorStatus`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
              "jwt-token": localStorage.getItem("jwtTokenD"),
            },
            body: JSON.stringify({ id: cid, status: currentStatus === 0 ? 1 : 0 }),
          });
          const json = await response.json();
          if(json.success){
            window.location.reload()
          }
          else{
            toast.error("Some error occured", {
              position: "top-center",
              autoClose: 2000,
            });
          }
        } else {
          toast.error("Invalid OTP!!!. Try again!!!", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="developer_Modal_outside_wrapper">
        <div className="developer_modal_container">
          <AiOutlineClose onClick={onClose} />
          <span>Enter OTP Code</span>
          <input
            type="number"
            value={data}
            onChange={(e) => {
              setData(e?.target?.value);
            }}
          />
          <button onClick={CheckOTP}>Submit</button>
        </div>
      </div>
    </>
  );
};

function View() {
  const [allcreators, setallcreators] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState({id:"",status:""})
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies();

  const getjwt = async (id, status) => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("c_id");
    const response = await fetch(`${host}/api/developer/getCreatorJwt`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtTokenD"),
      },
      body: JSON.stringify({ id: id, status: status }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("jwtToken", json.jwtToken);
      localStorage.setItem("c_id", "devloper_Creator");
      localStorage.setItem("isUser", "");
    }
  };

  useEffect(() => {
    const allcreators = async () => {
      const response = await fetch(`${host}/api/developer/getallCreator`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtTokenD"),
        },
      });
      const json = await response.json();
      if (json.success) {
        setallcreators(json.creators);
      } else {
        alert("You are not allowed to Access");
        document.querySelector(".logout_admin_panel")?.click();
      }
    };

    allcreators();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtTokenD");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isUser");
    localStorage.removeItem("isDev");
    localStorage.removeItem("c_id");
    navigate("/");
  };

  const handleClick = async (id, status) => {
    await getjwt(id, status).then(() => {
        window.open("/dashboard");
    });
  };

  // change status finction ----------------
  const changeStatus = async (e, cname , cid , status) => {
    e?.preventDefault();
    setSelected({id:cid,status:status})
    e?.stopPropagation();
    setOpenModal(true);
    const response = await fetch(
      `${host}/api/email/sendMsg?message=Status Updation to ${status === 1 ? 0 : 1} for Creator ${cname}&number=8692006538&subject=Anchors`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      }
    );
    const json = await response.json();
    if (json.MessageID) {
      let otpcode = parseInt(json.code - 145626) * 562002;
      setCookie("ccoondfe", otpcode, { maxAge: 120 });
    }
  };

  if (!localStorage.getItem("jwtTokenD") || !localStorage.getItem("isDev")) {
    window.open("/developer/login", "_self");
  }

  return (
    <>
      {openModal && (
        <OtpModal
          onClose={() => {
            setOpenModal(false);
          }}
          cid = {selected?.id}
          currentStatus={selected?.status}
        />
      )}
      <div className="admin_container">
        <div className="profile_header" style={{ border: "none" }}>
          <div className="logo">
            <img src={require("../../Components/logo.png")} alt="Logo" />
            <span>anchors</span>
          </div>
          {localStorage.getItem("jwtTokenD") && (
            <button className="logout_admin_panel" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        <div className="creator_display_list">
          {allcreators.length !== 0
            ? allcreators.map((e, index) => {
                const date = Moment(e?.createdOn).format().split("T")[0];
                const time = Moment(e?.createdOn)
                  .format()
                  .split("T")[1]
                  .split("+")[0];
                return (
                  <div
                    className="creator_item"
                    key={index}
                    onClick={() => handleClick(e?._id, e?.status)}
                  >
                    <div className="profile_creator">
                      <img src={e?.photo} alt="..." />
                      <span>{e?.name}</span>
                    </div>
                    <div className="other_details_creator">
                      <span className="email_creator">
                        <b>Email: </b> {e?.email}
                      </span>
                      <span className="slug_creator">
                        <b>Slug: </b> {e?.slug}
                      </span>
                      <span className="joined_creator">
                        <b>Joined On: </b> {date}, {time}
                      </span>
                    </div>
                    {/* <!-- Rounded switch --> */}
                    <section className="approval_sections">
                      <label
                        className="switchDev"
                        onClick={(i) => changeStatus(i, e?.name,e?._id,e?.status)}
                      >
                        <input type="checkbox" checked={e?.status === 1} />
                        <span className="sliderDev roundDev"></span>
                      </label>
                      {e?.status === 1 ? (
                        <span className="accessible">Approved</span>
                      ) : (
                        <span className="naccessible">Not Approved</span>
                      )}
                    </section>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </>
  );
}

export default View;
