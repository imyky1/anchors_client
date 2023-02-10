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
import { LoadTwo } from "../../../Modals/Loading";
import ShowReviewModel from "../../../Modals/ShowReviewModel";
import "./UserRequest.css";

const UserRequest = () => {
  const { getUserQueries, RequestsStats } = useContext(creatorContext);
  const [querries, setQuerries] = useState();
  const [openLoading, setopenLoading] = useState(false);

  useEffect(() => {
    setopenLoading(true);
    getUserQueries().then((e) => {
      setQuerries(e);
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

  return (
    <div className="servicelist-wrapper">
      <h1>Requested Resources from users</h1>
      <span className="servicelist_wrap_span">
        Get your detailed user requests here.
      </span>
      <div className="usereview_details">
        <div className="userreview_detail1">
          <div className="userreview_detail_svg">
            <svg
              width="17"
              height="22"
              viewBox="0 0 17 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.59375 3.20833C4.59375 1.62627 5.87627 0.34375 7.45833 0.34375H9.54167C11.1237 0.34375 12.4062 1.62627 12.4062 3.20833V5.29167C12.4062 5.72314 12.0565 6.07292 11.625 6.07292H5.375C4.94353 6.07292 4.59375 5.72314 4.59375 5.29167V3.20833ZM7.45833 1.90625C6.73921 1.90625 6.15625 2.48921 6.15625 3.20833V4.51042H10.8437V3.20833C10.8437 2.48921 10.2608 1.90625 9.54167 1.90625H7.45833Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.75722 3.13413C2.88891 3.071 3.03512 3.17149 3.03485 3.31753L3.03125 5.29167C3.03125 6.58609 4.08058 7.63542 5.375 7.63542H11.625C12.9194 7.63542 13.9687 6.58609 13.9687 5.29167V3.31694C13.9687 3.17106 14.1149 3.07084 14.2464 3.1339C15.4809 3.72572 16.3125 4.98623 16.3125 6.42235V17.3488C16.3125 19.1309 14.9851 20.6339 13.2167 20.8541C10.0843 21.2442 6.91567 21.2442 3.7833 20.8541C2.01491 20.6339 0.6875 19.1309 0.6875 17.3488V6.42235C0.6875 4.98642 1.52251 3.72605 2.75722 3.13413ZM11.625 10.5C12.0565 10.5 12.4062 10.8498 12.4062 11.2812C12.4062 11.7127 12.0565 12.0625 11.625 12.0625H5.375C4.94353 12.0625 4.59375 11.7127 4.59375 11.2812C4.59375 10.8498 4.94353 10.5 5.375 10.5H11.625ZM10.5833 13.625C11.0148 13.625 11.3646 13.9748 11.3646 14.4062C11.3646 14.8377 11.0148 15.1875 10.5833 15.1875H5.375C4.94353 15.1875 4.59375 14.8377 4.59375 14.4062C4.59375 13.9748 4.94353 13.625 5.375 13.625H10.5833Z"
                fill="black"
              />
            </svg>
          </div>
          <div className="userreview_detailedno">
            <span>Total Requests</span>
            <h3>{RequestsStats?.total}</h3>
          </div>
        </div>
        <div className="userreview_detail1">
          <div className="userreview_detail_svg">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.9456 3.46842H4.55748L3.32813 1.26488C3.19014 1.01754 2.9291 0.864258 2.64587 0.864258H1.08337C0.651901 0.864258 0.302124 1.21404 0.302124 1.64551C0.302124 2.07698 0.651901 2.42676 1.08337 2.42676H2.18712L3.40035 4.60139L6.19834 10.7923L6.20121 10.7986L6.44765 11.3439L3.63844 14.3403C3.43645 14.5558 3.37322 14.8667 3.47503 15.144C3.57683 15.4212 3.82626 15.6173 4.11969 15.6509L6.68024 15.9435C9.88303 16.3095 13.1171 16.3095 16.3199 15.9435L18.8804 15.6509C19.3091 15.6019 19.6169 15.2146 19.5679 14.786C19.5189 14.3573 19.1317 14.0495 18.703 14.0985L16.1425 14.3911C13.0576 14.7437 9.94255 14.7437 6.85766 14.3911L5.84149 14.275L7.90334 12.0757C7.92329 12.0544 7.94181 12.0323 7.95892 12.0095L8.7431 12.1115C9.84198 12.2545 10.9528 12.2826 12.0575 12.1952C14.634 11.9914 17.0219 10.7654 18.6891 8.79038L19.2912 8.07702C19.3115 8.05306 19.3302 8.02791 19.3474 8.0017L20.4697 6.29143C21.2652 5.07918 20.3955 3.46842 18.9456 3.46842Z"
                fill="black"
              />
              <path
                d="M5.77088 17.2705C4.90793 17.2705 4.20838 17.9701 4.20838 18.833C4.20838 19.696 4.90793 20.3955 5.77088 20.3955C6.63382 20.3955 7.33338 19.696 7.33338 18.833C7.33338 17.9701 6.63382 17.2705 5.77088 17.2705Z"
                fill="black"
              />
              <path
                d="M15.6667 18.833C15.6667 17.9701 16.3663 17.2705 17.2292 17.2705C18.0922 17.2705 18.7917 17.9701 18.7917 18.833C18.7917 19.696 18.0922 20.3955 17.2292 20.3955C16.3663 20.3955 15.6667 19.696 15.6667 18.833Z"
                fill="black"
              />
            </svg>
          </div>
          <div className="userreview_detailedno">
            <span>Ready to Pay</span>
            <h3>{RequestsStats?.ispaid}</h3>
          </div>
        </div>
        <div className="userreview_detail1">
          <div className="userreview_detail_svg">
            <svg
              width="19"
              height="21"
              viewBox="0 0 19 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.5104 3.72917C3.5104 1.85945 5.0261 0.34375 6.89581 0.34375C7.94292 0.34375 8.87899 0.819133 9.49998 1.56585C10.121 0.819133 11.057 0.34375 12.1041 0.34375C13.9739 0.34375 15.4896 1.85945 15.4896 3.72917C15.4896 4.51486 15.2219 5.23804 14.7728 5.8125H15.75C17.1882 5.8125 18.3541 6.97843 18.3541 8.41667V9.71875C18.3541 10.1502 18.0044 10.5 17.5729 10.5H10.5937C10.4211 10.5 10.2812 10.3601 10.2812 10.1875V6.58239C9.98649 6.39369 9.72293 6.16057 9.49998 5.89248C9.27703 6.16057 9.01346 6.39369 8.71873 6.58239V10.1875C8.71873 10.3601 8.57882 10.5 8.40623 10.5H1.42706C0.995591 10.5 0.645813 10.1502 0.645813 9.71875V8.41667C0.645813 6.97843 1.81174 5.8125 3.24998 5.8125H4.22715C3.77805 5.23804 3.5104 4.51486 3.5104 3.72917ZM8.71873 3.72917C8.71873 2.7224 7.90258 1.90625 6.89581 1.90625C5.88904 1.90625 5.0729 2.7224 5.0729 3.72917C5.0729 4.73594 5.88904 5.55208 6.89581 5.55208C7.90258 5.55208 8.71873 4.73594 8.71873 3.72917ZM10.2812 3.72917C10.2812 4.73594 11.0974 5.55208 12.1041 5.55208C13.1109 5.55208 13.9271 4.73594 13.9271 3.72917C13.9271 2.7224 13.1109 1.90625 12.1041 1.90625C11.0974 1.90625 10.2812 2.7224 10.2812 3.72917Z"
                fill="black"
              />
              <path
                d="M8.71873 12.2188C8.71873 12.0462 8.57882 11.9063 8.40623 11.9063H2.88437C2.46181 11.9063 2.10073 12.2107 2.02937 12.6272C1.79807 13.977 1.79807 15.3563 2.02937 16.7061L2.26302 18.0697C2.42035 18.9878 3.16603 19.6912 4.09177 19.7946L5.20128 19.9186C6.26472 20.0375 7.33186 20.1121 8.39995 20.1425C8.57494 20.1475 8.71873 20.0064 8.71873 19.8314L8.71873 12.2188Z"
                fill="black"
              />
              <path
                d="M10.6 20.1425C10.425 20.1475 10.2812 20.0064 10.2812 19.8314L10.2812 12.2188C10.2812 12.0462 10.4211 11.9063 10.5937 11.9063H16.1156C16.5381 11.9063 16.8992 12.2107 16.9706 12.6272C17.2019 13.977 17.2019 15.3563 16.9706 16.7061L16.7369 18.0697C16.5796 18.9878 15.8339 19.6912 14.9082 19.7946L13.7987 19.9186C12.7352 20.0375 11.6681 20.1121 10.6 20.1425Z"
                fill="black"
              />
            </svg>
          </div>
          <div className="userreview_detailedno">
            <span>Free Resources</span>
            <h3>{RequestsStats?.free}</h3>
          </div>
        </div>
      </div>
      {openLoading && <LoadTwo open={openLoading} />}

      <div className="userrequest-table">
        <TableContainer component={Paper} >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">S.No</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Requested Resources</TableCell>
                <TableCell align="center">Ready to pay</TableCell>
                {/* <TableCell>Amount</TableCell> */}
                <TableCell align="center">Requested date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {querries?.length !== 0
                ? querries?.map((elem, i) => {
                    return (
                      <>
                        <TableRow key={i}>
                          <TableCell align="center">{i + 1}</TableCell>
                          <TableCell align="center">{elem.user.name ? elem.user.name : "--"}</TableCell>
                          <TableCell align="center">{elem.desc}</TableCell>
                          <TableCell align="center">
                            {elem.willPay === true ? "Yes" : "No"}
                          </TableCell>
                          <TableCell align="center">
                            {renderdate1(elem.date)}
                            <br></br>
                            {renderdate2(elem.date)}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                : ""}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default UserRequest;
