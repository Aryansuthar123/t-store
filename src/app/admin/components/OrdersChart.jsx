"use client"

import {Bar} from "react-chartjs-2";
import {Chart as chartjs,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

chartjs.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
)

export default function OrdersChart(){
    const data = {
        labels: ["first day", "second day"],
        datasets :[
            {
                label: "Orders",
                data: [14, 50],
                 backgroundColour:"#879fff20",
                borderColor: "#879fff80",
                borderWidth: 0.5,
                barThickness: 30,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio:false,
        plugien: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: " Total Order Line Chart",
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
    <section className="bg-white p-5 rounded-lg shadow w-full">
            <Bar data={data} options={options}/>
    </section>);
}