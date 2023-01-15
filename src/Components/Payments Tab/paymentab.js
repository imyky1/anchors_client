import React, { useEffect, useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { host } from "../../config/config";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import "./paymentstab.css";

const PaymentsTab = (props) => {
  const [uorders, setUorders] = useState([]);
  const [totalearning, setTotalEarning] = useState(0);
  const [tablevalues, setTableValues] = useState({});
  const gettotalearning = async () => {
    const response = await fetch(`${host}/payments/totalearning`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await response.json();
    console.log(json);
    setUorders(json.uorders);
    if (json.success) {
      return json;
    } else {
      //console.log(json.error)
    }
  };
  const calculateTotalearning = () => {
    uorders.map((el) => {
      return setTotalEarning((prev) => prev + el.amount);
    });
  };
  const createtablerecords = () => {
    const counts = {};
    uorders.map(function (x) {
      return (counts[x.orderDate.slice(0, 10)] =
        (counts[x.orderDate.slice(0, 10)] || 0) + x.amount);
    });
    // let sorted = counts.sort(function (a, b) {
    //   // Turn your strings into dates, and then subtract them
    //   // to get a value that is either negative, positive, or zero.
    //   return new Date(b.) - new Date(a[0]);
    // });
    // console.log(sorted);
    // const keysSorted = Object.keys(counts).sort(function (a, b) {
    //   return new Date(b) - new Date(a);
    // });
    // console.log(keysSorted);

    setTableValues(counts);
  };
  console.log(tablevalues);
  useEffect(() => {
    gettotalearning();
  }, []);
  useEffect(() => {
    calculateTotalearning();
    createtablerecords();
  }, [uorders]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const style = { fontSize: "1.2em", paddingTop: "4.5px", paddingLeft: "10px" };

  return (
    <div className="paymentstabwrapper">
      <h1 className="paymentstabtitle">Payment Details</h1>
      <div className="topboxedwrapper">
        <div className="totalsalesbox">
          <div className="paymentsboxinside-flex">
            {" "}
            <p>{totalearning - (totalearning * 1) / 100}</p>
            <BsInfoCircle style={style}></BsInfoCircle>
          </div>

          <h2>Total Earning</h2>
        </div>
        <div className="widthdrawalbox">
          <div className="paymentsboxinside-flex">
            <p>23,000</p>
            <BsInfoCircle style={style}></BsInfoCircle>
          </div>
          <h2>Widthdrawal</h2>
        </div>
        <div className="availablebox">
          <div className="paymentsboxinside-flex">
            <p>4,000</p>
            <BsInfoCircle style={style}></BsInfoCircle>
          </div>
          <h2>Available Balance</h2>
        </div>
      </div>
      <div className="paymentstabtable">
        <h2>Day wise earning</h2>
        <TableContainer
          sx={{ minWidth: 450, width: 750, maxWidth: 850 }}
          component={Paper}
        >
          <Table
            sx={{ minWidth: 450, maxWidth: 850 }}
            aria-label="simple table"
          >
            <TableHead>
              <StyledTableRow>
                <TableCell align="center">S.No</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Earning (in Rupees)&nbsp;</TableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {Object.keys(tablevalues).map((elem, i) => {
                console.log(elem);
                var value = tablevalues[elem];

                return (
                  <>
                    <StyledTableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <StyledTableCell
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {i}{" "}
                      </StyledTableCell>
                      <StyledTableCell align="center">{elem}</StyledTableCell>
                      <StyledTableCell align="center">{value}</StyledTableCell>
                    </StyledTableRow>
                  </>
                );
              })}
              {/* {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableRow
                key="1"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="row">
                  1{" "}
                </TableCell>
                <TableCell align="center"> 2022-10-10</TableCell>
                <TableCell align="center">2000</TableCell>
                </TableRow>
              ))} */}
              {/* <StyledTableRow
                key="1"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell align="center" component="th" scope="row">
                  1{" "}
                </StyledTableCell>
                <StyledTableCell align="center"> 2022-10-10</StyledTableCell>
                <StyledTableCell align="center">2000</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow
                key="2"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell align="center" component="th" scope="row">
                  2{" "}
                </StyledTableCell>
                <StyledTableCell align="center"> 2022-10-09</StyledTableCell>
                <StyledTableCell align="center">200</StyledTableCell>
              </StyledTableRow> */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default PaymentsTab;
