import { Pie } from 'react-chartjs-2';
import React, {Component} from 'react';
import 'chartjs-plugin-labels';

class DChart extends Component {

    render(){
        const options = {
            legend: {render:'value',position: 'right'},
            plugins: {
                labels: {
                    // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
                    render: 'percentage',

                    // precision for percentage, default is 0
                    precision: 0,

                    // identifies whether or not labels of value 0 are displayed, default is false
                    showZero: false,

                    // font size, default is defaultFontSize
                    fontSize: 12,

                    // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
                    fontColor: '#fff',

                    // font style, default is defaultFontStyle
                    fontStyle: 'normal',

                    // font family, default is defaultFontFamily
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

                    // draw text shadows under labels, default is false
                    textShadow: true,

                    // text shadow intensity, default is 6
                    shadowBlur: 10,

                    // text shadow X offset, default is 3
                    shadowOffsetX: -5,

                    // text shadow Y offset, default is 3
                    shadowOffsetY: 5,

                    // text shadow color, default is 'rgba(0,0,0,0.3)'
                    shadowColor: 'rgba(0,0,0,0.3)',

                    // draw label in arc, default is false
                    // bar chart ignores this
                    arc: false,

                    // position to draw label, available value is 'default', 'border' and 'outside'
                    // bar chart ignores this
                    // default is 'default'
                    position: 'border',

                    // draw label even it's overlap, default is true
                    // bar chart ignores this
                    overlap: true,

                    // show the real calculated percentages from the values and don't apply the additional logic to fit the percentages to 100 in total, default is false
                    showActualPercentages: true,

                    // add padding when position is `outside`
                    // default is 2
                    outsidePadding: 4,

                    // add margin of text when position is `outside` or `border`
                    // default is 2
                    textMargin: 4
                }
            }};

            return(
            <div>
                <Pie data={this.props.children} options={options}/>
            </div>
        )
    }
}

export default DChart;
