import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import graph_star from './graph_start.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const barGraph = (props) => {


  const freeRate = props?.freeRate;
  const paidRate =  props?.paidRate;

  const alldays = props?.month_tot;
  let valuees = [];

  if (alldays) {
    for (const key in alldays) {
      const value = alldays[key];
      valuees.push(value);
    }
  }

  let options;
  let labels;
  let data;

  if (props.show === 'rating') {
    options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },

        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const dayLabel = 'Rating: ' + context.label;
              const orderLabel = 'User: ' + context.raw;
              return [dayLabel, orderLabel];
            },
            title: function () {
              return ''; // Hide x-axis label from tooltip
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          offset: true,
          maxRotation: 0,
          ticks: {
            stepSize: 3,
          },
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.2)',
            borderDash: [5, 5],
          },
          // min: 1,
          // max: 60,
          offset: true,
          ticks: {
            stepSize: 5,
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
        },
      },
    };

    labels = ['1', '2', '3', '4', '5'];

    data = {
      labels,
      datasets: [
        {
          data: paidRate,
          backgroundColor: '#94A3B8',
          borderRadius: 5,
          barThickness: 10,
          label:"Paid Service"
        },
        {
          data: freeRate,
          backgroundColor: '#334155',
          borderRadius: 5,
          barThickness: 10,
          label:"Free Service"
        },
      ],
    };
  } else if (props.show === 'order') {
    if(props?.selectedOption==='Today'){
       options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const dayLabel = 'Hour: ' + context.label;
              const orderLabel = 'Order: ' + context.raw;
              return [dayLabel, orderLabel];
            },
            title: function () {
              return ''; // Hide x-axis label from tooltip
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          offset: true,
          maxRotation: 0,
          ticks: {
            stepSize: 3,
          },
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.2)',
            borderDash: [5, 5],
          },
          // min: 1,
          // max: 50,
          offset: true,
          ticks: {
            stepSize: 5,
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
        },
      },
    };

 labels = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  const freedata=props?.hr_arr;
  const paiddata=props?.hr_arr_p;
   

    data = {
      labels,
      datasets: [
        {
            data: freedata,
            backgroundColor: '#334155',
            borderRadius: 5,
            barThickness: 10,
            label:"Free Order"
          },
          {
            data: paiddata,
            backgroundColor: '#94A3B8',
            borderRadius: 5,
            barThickness: 10,
            label:"Paid Order"
          },
      ],
    };

    }
    else  if(props?.selectedOption==='Last Week')
    {
      options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const dayLabel = 'WeekDay: ' + context.label;
              const orderLabel = 'Order: ' + context.raw;
              return [dayLabel, orderLabel];
            },
            title: function () {
              return ''; // Hide x-axis label from tooltip
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          offset: true,
          maxRotation: 0,
          ticks: {
            stepSize: 3,
          },
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.2)',
            borderDash: [5, 5],
          },
          // min: 1,
          // max: 10,
          offset: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
        },
      },
    };

    labels = Object.keys(props?.week_arr ?? {});
//  labels = ['Sunday',"Mon","Tue","Wed","Thu","Fri","Sat"]
  // const freedata=props?.;
  // const paiddata=props?.week_arr_p;

  const freedata = Object.values(props?.week_arr ?? {});
  const paiddata = Object.values(props?.week_arr_p ?? {});
   

    data = {
      labels,
      datasets: [
        {
            data: freedata,
            backgroundColor: '#334155',
            borderRadius: 5,
            barThickness: 10,
            label:"Free Order"
          },
          {
            data: paiddata,
            backgroundColor: '#94A3B8',
            borderRadius: 5,
            barThickness: 10,
            label:"Paid Order"
          },
      ],
    };

    }
   

    else if (props?.selectedOption === "Last Month") {
      options = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {

                var dayLabel = "Day: " + context.label;
                var orderLabel = "Order:"+ context.formattedValue;

                return [dayLabel, orderLabel];
              },
              title: function () {
                return ""; // Hide x-axis label from tooltip
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            offset: true,
            maxRotation: 0,
            ticks: {
              stepSize: 3,
            },
          },
          y: {
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.2)",
              borderDash: [5, 5],
            },
            // min: 2,
            // max: 20,
            offset: true,
            ticks: {
              stepSize: 2,
            },
          },
        },
        layout: {
          padding: {
            left: 1,
            right: 1,
          },
        },
      };



      labels = [];

      if (alldays) {
        for (const key in alldays) {

          labels.push(key);
        }
      }



      // const allLabels = [...labels, ...labels2];
      // const freedata = Object.values(props?.month_arr??{});
      // const paiddata = Object.values(props?.month_arr_p??{} );
      const freedata = props?.month_arr;
      const paiddata = props?.month_arr_p;
      // console.log("data", freedata, paiddata);
      data = {
        labels,
        datasets: [
          {
            data: freedata,
            backgroundColor: "#334155",
            borderRadius: 5,
            barThickness: 10,
            label: "Free Order",
          },
          {
            data: paiddata,
            backgroundColor: "#94A3B8",
            borderRadius: 5,
            barThickness: 10,
            label: "Paid Order",
          },
        ],
      };
    }
// else if (props?.selectedOption === 'Last Month') {
//   options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//       },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: function (context) {
//             const dayLabel = 'Day: ' + context.label;
//             const orderLabel = 'Order: ' + context.raw;
//             return [dayLabel, orderLabel];
//           },
//           title: function () {
//             return ''; // Hide x-axis label from tooltip
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         offset: true,
//         maxRotation: 0,
//         ticks: {
//           stepSize: 3,
//         },
//       },
//       y: {
//         grid: {
//           display: true,
//           color: 'rgba(0, 0, 0, 0.2)',
//           borderDash: [5, 5],
//         },
//         // min: 2,
//         // max: 20,
//         offset: true,
//         ticks: {
//           stepSize: 2,
//         },
//       },
//     },
//     layout: {
//       padding: {
//         left: 1,
//         right: 1,
//       },
//     },
    
    
    
//   };

//   labels = [
//     '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',
//     '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26',
//     '27', '28', '29', '30', '31'
//   ];

//   const freedata = props?.month_arr;
//   const paiddata = props?.month_arr_p;
//   data = {
//     labels,
//     datasets: [
//        {
//             data: freedata,
//             backgroundColor: '#334155',
//             borderRadius: 5,
//             barThickness: 10,
//             label:"Free Order"
//           },
//           {
//             data: paiddata,
//             backgroundColor: '#94A3B8',
//             borderRadius: 5,
//             barThickness: 10,
//             label:"Paid Order"
//           },
//     ],
//   };
// }


    else{

      options = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },

          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {
                const dayLabel = 'Month: ' + context.label;
                const orderLabel = 'Order: ' + context.raw;
                return [dayLabel, orderLabel];
              },
              title: function () {
                return ''; // Hide x-axis label from tooltip
              },
            },
          },

        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            offset: true,
            maxRotation: 0,
            ticks: {
              stepSize: 3,
            },
          },
          y: {
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.2)',
              borderDash: [5, 5],
            },
            // min: 100,
            // max: 2000,
            offset: true,
            ticks: {
              stepSize: 100,
            },
          },
        },
        layout: {
          padding: {
            left: 1,
            right: 1,
          },
        },
        
      };
  
      // labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      labels = Object.keys(props?.data ?? {});


      const freedata = Object.values(props?.data ?? {});
      const paiddata = Object.values(props?.data_p ?? {});
      
  
      data = {
        labels,
        datasets: [
          {
            data: freedata,
            backgroundColor: '#334155',
            borderRadius: 5,
            barThickness: 10,
            label:"Free Order"
          },
          {
            data: paiddata,
            backgroundColor: '#94A3B8',
            borderRadius: 5,
            barThickness: 10,
            label:"Paid Order"
          },
        ],
      };
  

    }
   
  }

  return (
    <div
      style={{
         height: '100%', width: '100%',
        display: 'flex',
        boxSizing: 'border-box',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Bar options={options} data={data} style={{maxHeight:'105%', maxWidth:'100%'}} />
    </div>
  );
};

export default barGraph;
