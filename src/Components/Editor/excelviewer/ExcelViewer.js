import { render } from "@testing-library/react";
import { type } from "@testing-library/user-event/dist/type";
import React, { useEffect, useState } from "react";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import { host } from "../../../config/config";
import readXlsxFile from "read-excel-file";

import "./excelview.css";

const ExcelViewer = ({ url }) => {
  const [urlexcel, setUrl] = useState(null);
  useEffect(() => {
    setUrl(
      url
        ? url
        : "https://anchors-files.s3.ap-south-1.amazonaws.com/docs/1674668029771-dsasheet.xlsx"
    );
  }, []);
  const [blob, setBlob] = useState(null);
  const getBlobFromUrl = (myImageUrl) => {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open("GET", myImageUrl, true);
      request.setRequestHeader("Content-Type", "application/octet-stream");
      request.responseType = "blob";
      request.onload = () => {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = (e) => {
          console.log(e.target.result);
          const objUrl = window.URL.createObjectURL(
            new Blob([e.target.result])
          );
          console.log(objUrl);
          setBlob(e.target.result);
          return objUrl;
        };
      };
      request.send();
    });
  };

  useEffect(() => {
    window.addEventListener(
      "keydown",
      function (event) {
        if (
          event.keyCode === 80 &&
          (event.ctrlKey || event.metaKey) &&
          !event.altKey &&
          (!event.shiftKey || window.chrome || window.opera)
        ) {
          event.preventDefault();
          if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
          } else {
            event.stopPropagation();
          }
          return;
        }
      },
      true
    );
  }, []);

  async function createFile() {
    const response = await fetch(
      `${host}/analytics/getfileurl`,

      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify({
          url: urlexcel,
        }),
      }
    );
    const rd = await response.json();

    const byteCharacters = window.atob(rd.rd);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/octet-stream" });
    // console.log(data2);
    // const data = data2.blob();
    // const data = await fetch(
    //   "https://anchors-files.s3.ap-south-1.amazonaws.com/docs/1674668029771-dsasheet.xlsx",
    //   {
    //     headers: {
    //       "Content-Type": "application/octet-stream",
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Methods":
    //         "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    //       "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    //     },
    //     // credentials: "include",
    //   }
    // ).then((res) => res.blob());
    // const data = await getBlobFromUrl(urlexcel);
    // console.log(data);
    // const fe = await fetch(url);
    // const data = await fe.blob();
    // console.log(data);
    // let typeurl = urlexcel.split(".");
    // typeurl = typeurl.at(-1);
    // let response = await fetch(
    //   "https://anchors-files.s3.ap-south-1.amazonaws.com/docs/1674668029771-dsasheet.xlsx"
    //   // {
    //   //   mode: "no-cors",
    //   //   headers: {
    //   //     "Content-Type": "application/octet-stream",
    //   //     "Access-Control-Allow-Origin": "*",
    //   //     "Access-Control-Allow-Methods":
    //   //       "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    //   //     "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    //   //   },
    //   // }
    // );
    // let data = await response.blob();
    // console.log(data);
    let metadata = {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    let file = new File([blob], `file.xlsx`, metadata);
    console.log(file);
    renderFile(file);
  }

  useEffect(() => {
    createFile();
  }, [urlexcel]);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [cols, setCols] = useState(null);

  const [rows, setRows] = useState(null);

  const renderFile = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        setCols(resp.cols);
        setRows(resp.rows);
        setDataLoaded(true);
      }
    });
  };

  return (
    <div className="excel-viewer-container">
      <h2>SERVICE TITLE</h2>
      {dataLoaded ? (
        <OutTable
          data={rows}
          columns={cols}
          tableClassName="ExcelTable2007"
          tableHeaderRowClass="heading"
        />
      ) : (
        "LOADING :) PLEASE WAIT"
      )}
    </div>
  );
};

export default ExcelViewer;
