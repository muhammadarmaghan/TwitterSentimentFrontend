import React, {Component} from 'react';
import ReactWordcloud from "react-wordcloud";
import {COLORS} from "../lib/constants";


class Wordcloud extends Component{
    render() {

        const options = {
            colors: COLORS,
            enableTooltip: true,
            deterministic: false,
            fontFamily: 'andalus',
            fontSizes: [20,40],
            fontStyle: 'normal',
            fontWeight: 'normal',
            padding: 1,
            randomSeed: null,
            rotations: 3,

            scale: 'sqrt',
            spiral: 'archimedean',
            transitionDuration: 1000,
        };
        return(

                <ReactWordcloud words={this.props.words} options={options} />

        )
    }
}
export default Wordcloud;
