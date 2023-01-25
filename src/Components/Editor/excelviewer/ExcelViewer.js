import { render } from "@testing-library/react";
import { type } from "@testing-library/user-event/dist/type";
import React, { useEffect, useState } from "react";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
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

  async function createFile() {
    let response = await fetch(urlexcel);
    let data = await response.blob();
    let typeurl = urlexcel.split(".");
    typeurl = typeurl.at(-1);
    let metadata = {
      type:
        typeurl === "xls"
          ? "application/vnd.ms-excel"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    console.log(metadata);
    console.log(metadata);
    let file = new File([data], `file.${typeurl}`, metadata);
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
