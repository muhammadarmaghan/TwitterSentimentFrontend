import React, {Component} from 'react';
import {Line} from "react-chartjs-2";
import moment from "moment";

class LineChartComponent extends Component {

    timeLabels = () => {
        let labels = [];
        let oldLabels = Object.keys(this.props.data);
        for ( let i =0; i < oldLabels.length; i++){
            labels.push(moment(oldLabels[i]).format('hh:mm:ss'));
        }
        return labels;
    }
    render(){

        var data = {
            datasets: [{
                label: 'Time Based Analysis',
                fill: false,
                lineTension: 0.1,
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 1,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(225,2,82,0.8)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: Object.values(this.props.data),
                backgroundColor: [
                    'red','green','blue'
                ],
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: this.timeLabels(),

        };
        return(
            <div>
                <Line data= {data} options={{legend: {position: 'bottom'}}}/>
            </div>
        )
    }
}

export default LineChartComponent;
