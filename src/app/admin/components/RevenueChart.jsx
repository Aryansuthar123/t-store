"use client"

import {Line} from "react-chartjs-2";
import {Chart as chartjs,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

chartjs.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
)

export default function RevenueChart(){
    const data = {
        labels: ["first day", "second day"],
        datasets :[
            {
                label: "Revenue",
                data: [14, 50],
                backgroundColour:"#879fff20",
                borderColor: "#879fff80",
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugien: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Revenue Line Chart", 
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
               beginAtZero: true,
                },
            },
        };
  
    return (
    <section className="bg-white p-5 rounded-lg  shadow w-full">
            <Line data={data} options={options}/>
    </section>);
}