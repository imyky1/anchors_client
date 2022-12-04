import { type } from "@testing-library/user-event/dist/type";
import React, { useEffect } from "react";
import { useState } from "react";
import Chart from "react-apexcharts";

const Apexcharts = ({ titletext, xdata, ydata, property }) => {
  const [loading, setLoading] = useState(true);

  const [userdata, setuserData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: xdata
          ? xdata
          : [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
      title: {
        text: titletext,
        align: "left",
      },
      stroke: {
        curve: "straight",
      },
    },
    series: [
      {
        name: "Unique Visits",
        data: ydata ? ydata : [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  });

  useEffect(() => {
    setuserData({
      options: {
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: xdata
            ? xdata
            : [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
        title: {
          text: titletext,
          align: "left",
        },
        stroke: {
          curve: "straight",
        },
      },
      series: [
        {
          name: "Unique Visits",
          data: ydata ? ydata : [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],
    });
    setLoading(false);
  }, [xdata, ydata]);

  return (
    <>
      {loading ? (
        ""
      ) : (
        <Chart
          options={userdata.options}
          series={userdata.series}
          type="line"
          width={property ? "700" : "500"}
          height="300"
        />
      )}
    </>
  );
};

export default Apexcharts;
