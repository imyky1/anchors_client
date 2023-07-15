import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Filler
);

const Chart = () => {
  const gradient = document.createElement('canvas').getContext('2d');
  const chartGradient = gradient.createLinearGradient(0, 0, 0, 500);
  chartGradient.addColorStop(0, 'black');
  chartGradient.addColorStop(1, 'white');

  const data = {
    labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28', '31'],
    datasets: [
      {
        label: 'views',
        data: [9, 5, 6, 10, 6, 2, 3, 1, 10, 11, 12],
        borderColor: 'black',
        pointBackgroundColor:'white',
        pointRadius: 5, 
        fill: 'start', 
        backgroundColor: chartGradient,
        cubicInterpolationMode: 'monotone', 
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display:false,
        
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
        min: 2,
        max: 14,
        offset: true,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  return (
    <div style={{
      height: '100%', width: '100%',
      display: 'flex',
      boxSizing: 'border-box',
      justifyContent: 'center',
      alignItems: 'center',}}>
       
         <Line data={data} options={options} style={{maxHeight:'100%', maxWidth:'100%'}}></Line>

      </div>
  );
};

export default Chart;
