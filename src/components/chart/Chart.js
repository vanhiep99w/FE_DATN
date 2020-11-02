import React from 'react';
import PropTypes from 'prop-types';
import './Chart.css';
import { Bar } from "react-chartjs-2";

const Chart = ({labels,datasets}) => {
    return (
        <div>
            <Bar
                width = {50}
                height={15}
                data={{
                    labels: labels,
                    datasets: [{
                        label: datasets.label,
                        backgroundColor: datasets.color,
                        data: datasets.data
                        }
                    ]
                }}
                options={{
                    legend: { 
                        display: false },
                    title: {
                        display: true,
                        text:""
                    },
                    
                }}
            />
        </div>
    )
}

Chart.propTypes = {
    labels: PropTypes.array,
    datasets : PropTypes.shape({
        
        label:PropTypes.string,
        backgroundColor:PropTypes.string,
        data:PropTypes.arrayOf(PropTypes.number)
    }),
}

export default Chart;