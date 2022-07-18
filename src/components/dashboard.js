import React, {Component} from 'react';
import DChart from './piechart';
import LineChartComponent from "./linechart2";
import Wordcloud from './wordcloud';
import {APICALL, STOP_WORDS} from "../lib/constants";
import _ from 'lodash';
import Tweetscard from "./tweetscard";
import Affin from "./Affin";
import {Container} from "react-bootstrap";
import Chart from 'react-google-charts';


class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state={
            TweetText : this.props.data,
            AffinGenerate : false,
            arrayTweet: [],
            o: this.props.query,
            type: this.props.type,
            location:[]
        }
    }
    saveData =() =>{
        let o = this.state.o;
        fetch(APICALL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(o)
        }).then(res => res.json()).then(result => alert(result.message))
            .catch(err => console.log(err));
    }

    handleAffin = () => {
        this.setState({
            AffinGenerate: !this.state.AffinGenerate
        })
    }

    handleDisplay = () => {
        this.props.onClick(true, '','')
    };
    getText = (tweets) => {
        let text='';
        for (let i=0; i < tweets.length; i++){
            text += (tweets[i].text).toLowerCase();
        }
        for (let i = 0; i< STOP_WORDS.length; i++) {
            // let regex = `[\s]+[\W*(${STOP_WORDS[i]})\W*][\s]+`
            // text = text.replace(RegExp(regex), '');
            text = text.split(" " + STOP_WORDS[i] + " ").join(" ")
        }
        return text;
    }

    getWordCloud = (text, uniqueWordsArr) => {
        let newArr = []
        for (let i = 0 ; i < uniqueWordsArr.length; i++){
            if (uniqueWordsArr[i].length >3){
            let obj = {
                text: uniqueWordsArr[i],
                value: (text.split(uniqueWordsArr[i]).length -1)
                }
            newArr.push(obj)
            }
        }
        return newArr
    }

    wordcloud=(text)=>{

        text = text.split(/[@|#]\S+/gm).join(" ")
        let allWords = text.split(" ")
        let uniqueWordsArr = _.uniq(allWords);
        let wordCloudArr = this.getWordCloud(text, uniqueWordsArr)
        return wordCloudArr
    };
    hashcloud =(text) => {
        let hashtags = text.match(/#\S+/gm);
        let uniqHashtag = _.uniq(hashtags);
        let requiredArray = [];

        for (let i = 0; i< uniqHashtag.length; i++) {
            let obj = {
                "text": uniqHashtag[i],
                "value": hashtags.filter((o) => o === uniqHashtag[i]).length
            };
            requiredArray.push(obj)
        }
        return requiredArray;
    };
    getFollowers = (data) => {
        let totalFollowers = 0;
        for (let i = 0; i < data.length; i++){
            totalFollowers = totalFollowers + data[i].user.followers_count;
        }
        return totalFollowers;
    };

    getImpression = (data) =>{
      let impression = 0;
      for (let i = 0; i < data.length; i++){
          impression = impression + data[i].user.followers_count + data[i].retweet_count;
      }
      return impression;
    };
    getFav = (data) => {
        let fav =0;
        for (let i=0; i <data.length; i++){
            fav = fav + data[i].user.favourites_count;
        }
        return fav;
    }
    getLocation = (loc) => {
        let countryList =[
            {"name": "Afghanistan", "code": "AF"},
            {"name": "land Islands", "code": "AX"},
            {"name": "Albania", "code": "AL"},
            {"name": "Algeria", "code": "DZ"},
            {"name": "American Samoa", "code": "AS"},
            {"name": "AndorrA", "code": "AD"},
            {"name": "Angola", "code": "AO"},
            {"name": "Anguilla", "code": "AI"},
            {"name": "Antarctica", "code": "AQ"},
            {"name": "Antigua and Barbuda", "code": "AG"},
            {"name": "Argentina", "code": "AR"},
            {"name": "Armenia", "code": "AM"},
            {"name": "Aruba", "code": "AW"},
            {"name": "Australia", "code": "AU"},
            {"name": "Austria", "code": "AT"},
            {"name": "Azerbaijan", "code": "AZ"},
            {"name": "Bahamas", "code": "BS"},
            {"name": "Bahrain", "code": "BH"},
            {"name": "Bangladesh", "code": "BD"},
            {"name": "Barbados", "code": "BB"},
            {"name": "Belarus", "code": "BY"},
            {"name": "Belgium", "code": "BE"},
            {"name": "Belize", "code": "BZ"},
            {"name": "Benin", "code": "BJ"},
            {"name": "Bermuda", "code": "BM"},
            {"name": "Bhutan", "code": "BT"},
            {"name": "Bolivia", "code": "BO"},
            {"name": "Bosnia and Herzegovina", "code": "BA"},
            {"name": "Botswana", "code": "BW"},
            {"name": "Bouvet Island", "code": "BV"},
            {"name": "Brazil", "code": "BR"},
            {"name": "British Indian Ocean Territory", "code": "IO"},
            {"name": "Brunei Darussalam", "code": "BN"},
            {"name": "Bulgaria", "code": "BG"},
            {"name": "Burkina Faso", "code": "BF"},
            {"name": "Burundi", "code": "BI"},
            {"name": "Cambodia", "code": "KH"},
            {"name": "Cameroon", "code": "CM"},
            {"name": "Canada", "code": "CA"},
            {"name": "Cape Verde", "code": "CV"},
            {"name": "Cayman Islands", "code": "KY"},
            {"name": "Central African Republic", "code": "CF"},
            {"name": "Chad", "code": "TD"},
            {"name": "Chile", "code": "CL"},
            {"name": "China", "code": "CN"},
            {"name": "Christmas Island", "code": "CX"},
            {"name": "Cocos (Keeling) Islands", "code": "CC"},
            {"name": "Colombia", "code": "CO"},
            {"name": "Comoros", "code": "KM"},
            {"name": "Congo", "code": "CG"},
            {"name": "Congo, The Democratic Republic of the", "code": "CD"},
            {"name": "Cook Islands", "code": "CK"},
            {"name": "Costa Rica", "code": "CR"},
            {"name": "Cote D'Ivoire", "code": "CI"},
            {"name": "Croatia", "code": "HR"},
            {"name": "Cuba", "code": "CU"},
            {"name": "Cyprus", "code": "CY"},
            {"name": "Czech Republic", "code": "CZ"},
            {"name": "Denmark", "code": "DK"},
            {"name": "Djibouti", "code": "DJ"},
            {"name": "Dominica", "code": "DM"},
            {"name": "Dominican Republic", "code": "DO"},
            {"name": "Ecuador", "code": "EC"},
            {"name": "Egypt", "code": "EG"},
            {"name": "El Salvador", "code": "SV"},
            {"name": "Equatorial Guinea", "code": "GQ"},
            {"name": "Eritrea", "code": "ER"},
            {"name": "Estonia", "code": "EE"},
            {"name": "Ethiopia", "code": "ET"},
            {"name": "Falkland Islands (Malvinas)", "code": "FK"},
            {"name": "Faroe Islands", "code": "FO"},
            {"name": "Fiji", "code": "FJ"},
            {"name": "Finland", "code": "FI"},
            {"name": "France", "code": "FR"},
            {"name": "French Guiana", "code": "GF"},
            {"name": "French Polynesia", "code": "PF"},
            {"name": "French Southern Territories", "code": "TF"},
            {"name": "Gabon", "code": "GA"},
            {"name": "Gambia", "code": "GM"},
            {"name": "Georgia", "code": "GE"},
            {"name": "Germany", "code": "DE"},
            {"name": "Ghana", "code": "GH"},
            {"name": "Gibraltar", "code": "GI"},
            {"name": "Greece", "code": "GR"},
            {"name": "Greenland", "code": "GL"},
            {"name": "Grenada", "code": "GD"},
            {"name": "Guadeloupe", "code": "GP"},
            {"name": "Guam", "code": "GU"},
            {"name": "Guatemala", "code": "GT"},
            {"name": "Guernsey", "code": "GG"},
            {"name": "Guinea", "code": "GN"},
            {"name": "Guinea-Bissau", "code": "GW"},
            {"name": "Guyana", "code": "GY"},
            {"name": "Haiti", "code": "HT"},
            {"name": "Heard Island and Mcdonald Islands", "code": "HM"},
            {"name": "Holy See (Vatican City State)", "code": "VA"},
            {"name": "Honduras", "code": "HN"},
            {"name": "Hong Kong", "code": "HK"},
            {"name": "Hungary", "code": "HU"},
            {"name": "Iceland", "code": "IS"},
            {"name": "India", "code": "IN"},
            {"name": "Indonesia", "code": "ID"},
            {"name": "Iran, Islamic Republic Of", "code": "IR"},
            {"name": "Iraq", "code": "IQ"},
            {"name": "Ireland", "code": "IE"},
            {"name": "Isle of Man", "code": "IM"},
            {"name": "Israel", "code": "IL"},
            {"name": "Italy", "code": "IT"},
            {"name": "Jamaica", "code": "JM"},
            {"name": "Japan", "code": "JP"},
            {"name": "Jersey", "code": "JE"},
            {"name": "Jordan", "code": "JO"},
            {"name": "Kazakhstan", "code": "KZ"},
            {"name": "Kenya", "code": "KE"},
            {"name": "Kiribati", "code": "KI"},
            {"name": "Korea, Democratic People'S Republic of", "code": "KP"},
            {"name": "Korea, Republic of", "code": "KR"},
            {"name": "Kuwait", "code": "KW"},
            {"name": "Kyrgyzstan", "code": "KG"},
            {"name": "Lao People'S Democratic Republic", "code": "LA"},
            {"name": "Latvia", "code": "LV"},
            {"name": "Lebanon", "code": "LB"},
            {"name": "Lesotho", "code": "LS"},
            {"name": "Liberia", "code": "LR"},
            {"name": "Libyan Arab Jamahiriya", "code": "LY"},
            {"name": "Liechtenstein", "code": "LI"},
            {"name": "Lithuania", "code": "LT"},
            {"name": "Luxembourg", "code": "LU"},
            {"name": "Macao", "code": "MO"},
            {"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"},
            {"name": "Madagascar", "code": "MG"},
            {"name": "Malawi", "code": "MW"},
            {"name": "Malaysia", "code": "MY"},
            {"name": "Maldives", "code": "MV"},
            {"name": "Mali", "code": "ML"},
            {"name": "Malta", "code": "MT"},
            {"name": "Marshall Islands", "code": "MH"},
            {"name": "Martinique", "code": "MQ"},
            {"name": "Mauritania", "code": "MR"},
            {"name": "Mauritius", "code": "MU"},
            {"name": "Mayotte", "code": "YT"},
            {"name": "Mexico", "code": "MX"},
            {"name": "Micronesia, Federated States of", "code": "FM"},
            {"name": "Moldova, Republic of", "code": "MD"},
            {"name": "Monaco", "code": "MC"},
            {"name": "Mongolia", "code": "MN"},
            {"name": "Montenegro", "code": "ME"},
            {"name": "Montserrat", "code": "MS"},
            {"name": "Morocco", "code": "MA"},
            {"name": "Mozambique", "code": "MZ"},
            {"name": "Myanmar", "code": "MM"},
            {"name": "Namibia", "code": "NA"},
            {"name": "Nauru", "code": "NR"},
            {"name": "Nepal", "code": "NP"},
            {"name": "Netherlands", "code": "NL"},
            {"name": "Netherlands Antilles", "code": "AN"},
            {"name": "New Caledonia", "code": "NC"},
            {"name": "New Zealand", "code": "NZ"},
            {"name": "Nicaragua", "code": "NI"},
            {"name": "Niger", "code": "NE"},
            {"name": "Nigeria", "code": "NG"},
            {"name": "Niue", "code": "NU"},
            {"name": "Norfolk Island", "code": "NF"},
            {"name": "Northern Mariana Islands", "code": "MP"},
            {"name": "Norway", "code": "NO"},
            {"name": "Oman", "code": "OM"},
            {"name": "Pakistan", "code": "PK"},
            {"name": "Palau", "code": "PW"},
            {"name": "Palestinian Territory, Occupied", "code": "PS"},
            {"name": "Panama", "code": "PA"},
            {"name": "Papua New Guinea", "code": "PG"},
            {"name": "Paraguay", "code": "PY"},
            {"name": "Peru", "code": "PE"},
            {"name": "Philippines", "code": "PH"},
            {"name": "Pitcairn", "code": "PN"},
            {"name": "Poland", "code": "PL"},
            {"name": "Portugal", "code": "PT"},
            {"name": "Puerto Rico", "code": "PR"},
            {"name": "Qatar", "code": "QA"},
            {"name": "Reunion", "code": "RE"},
            {"name": "Romania", "code": "RO"},
            {"name": "Russian Federation", "code": "RU"},
            {"name": "RWANDA", "code": "RW"},
            {"name": "Saint Helena", "code": "SH"},
            {"name": "Saint Kitts and Nevis", "code": "KN"},
            {"name": "Saint Lucia", "code": "LC"},
            {"name": "Saint Pierre and Miquelon", "code": "PM"},
            {"name": "Saint Vincent and the Grenadines", "code": "VC"},
            {"name": "Samoa", "code": "WS"},
            {"name": "San Marino", "code": "SM"},
            {"name": "Sao Tome and Principe", "code": "ST"},
            {"name": "Saudi Arabia", "code": "SA"},
            {"name": "Senegal", "code": "SN"},
            {"name": "Serbia", "code": "RS"},
            {"name": "Seychelles", "code": "SC"},
            {"name": "Sierra Leone", "code": "SL"},
            {"name": "Singapore", "code": "SG"},
            {"name": "Slovakia", "code": "SK"},
            {"name": "Slovenia", "code": "SI"},
            {"name": "Solomon Islands", "code": "SB"},
            {"name": "Somalia", "code": "SO"},
            {"name": "South Africa", "code": "ZA"},
            {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
            {"name": "Spain", "code": "ES"},
            {"name": "Sri Lanka", "code": "LK"},
            {"name": "Sudan", "code": "SD"},
            {"name": "Suriname", "code": "SR"},
            {"name": "Svalbard and Jan Mayen", "code": "SJ"},
            {"name": "Swaziland", "code": "SZ"},
            {"name": "Sweden", "code": "SE"},
            {"name": "Switzerland", "code": "CH"},
            {"name": "Syrian Arab Republic", "code": "SY"},
            {"name": "Taiwan, Province of China", "code": "TW"},
            {"name": "Tajikistan", "code": "TJ"},
            {"name": "Tanzania, United Republic of", "code": "TZ"},
            {"name": "Thailand", "code": "TH"},
            {"name": "Timor-Leste", "code": "TL"},
            {"name": "Togo", "code": "TG"},
            {"name": "Tokelau", "code": "TK"},
            {"name": "Tonga", "code": "TO"},
            {"name": "Trinidad and Tobago", "code": "TT"},
            {"name": "Tunisia", "code": "TN"},
            {"name": "Turkey", "code": "TR"},
            {"name": "Turkmenistan", "code": "TM"},
            {"name": "Turks and Caicos Islands", "code": "TC"},
            {"name": "Tuvalu", "code": "TV"},
            {"name": "Uganda", "code": "UG"},
            {"name": "Ukraine", "code": "UA"},
            {"name": "United Arab Emirates", "code": "AE"},
            {"name": "United Kingdom", "code": "GB"},
            {"name": "United States", "code": "US"},
            {"name": "United States Minor Outlying Islands", "code": "UM"},
            {"name": "Uruguay", "code": "UY"},
            {"name": "Uzbekistan", "code": "UZ"},
            {"name": "Vanuatu", "code": "VU"},
            {"name": "Venezuela", "code": "VE"},
            {"name": "Viet Nam", "code": "VN"},
            {"name": "Virgin Islands, British", "code": "VG"},
            {"name": "Virgin Islands, U.S.", "code": "VI"},
            {"name": "Wallis and Futuna", "code": "WF"},
            {"name": "Western Sahara", "code": "EH"},
            {"name": "Yemen", "code": "YE"},
            {"name": "Zambia", "code": "ZM"},
            {"name": "Zimbabwe", "code": "ZW"}
        ];
        let geoData= [];
        for (let i =0; i < loc.length; i++){

            if (loc[i].user.location){
                geoData.push(loc[i].user.location)
            }
        }
        let x;
        let arr = [["Country", "Tweets"]];
        let Country='';
        for (let j = 0; j< countryList.length; j++) {
            Country=countryList[j].name;

            x = _.filter(geoData, function(o) {
                return o.indexOf(countryList[j].name) > -1; })
            if (x.length > 0) {
                let item = [Country, x.length];
                arr.push(item);
            }
        }
        return arr;
    }

    render(){
        const tweetsData = this.state.TweetText;
        console.log('total Tweets',tweetsData)
        const location = tweetsData.tweets.statuses;

        const totalTweets = tweetsData.tweets.statuses.length;
        const tweetsInfo = tweetsData.otherInfo.tweetsInfo;
        const timeData = tweetsData.otherInfo.tweetsInfo.timeBasedTweets;
        const timeduration = Object.keys(tweetsInfo.timeBasedTweets);
        const timeStart = timeduration[0];
        const timeEnd = timeduration[timeduration.length-1];
        const timeDiffInSecs = Math.floor(((new Date(timeEnd)).getTime() - (new Date(timeStart)).getTime())/1000 )
        const min = Math.floor(timeDiffInSecs > 60 ? timeDiffInSecs / 60 : 0)
        const hour = Math.floor(min > 60 ? min / 60 : 0)
        const day = Math.floor(hour > 24 ? hour / 24 : 0)
        const timeString =
            (day > 0 ? `${day} (d)` : '') ||
            (hour > 0 ? `${hour} (h)` : '') ||
            (min > 0 ? `${min} (m)` : '') ||
            (timeDiffInSecs > 0 ? `${timeDiffInSecs} (s)` : '')

        const sentimentAnalysis = tweetsData.otherInfo.sentiment;
        const tweetsByType = [tweetsInfo.tweets, tweetsInfo.retweets, tweetsInfo.replies];
        const myTweet = tweetsData.tweets.statuses;
        const followersCount = this.getFollowers(myTweet);
        const impressionCount = this.getImpression(myTweet);
        const totalFav = this.getFav(myTweet);
        let wordcl= this.wordcloud(this.getText(myTweet));
        let hashCloud = this.hashcloud(this.getText(myTweet));
        let data = {
            datasets: [{
                data: Object.values(sentimentAnalysis),
                backgroundColor: [
                    '#a55eea','#5eba00','#17a2b8',
                    '#f62f99','#cd201f'
                ],
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Great', 'Good','Neutral','Bad', 'Terrible'
            ],

        };

        let data2 = {
            datasets: [{
                data: tweetsByType,
                backgroundColor : [
                    '#467fcf','#a55eea', '#fd9644'
                ],
            }],
            labels : [
                'Tweets', 'Re-tweets', 'Replies'
            ]

        };
        return(
            <>
            <div className="header py-4" style={{marginBottom : '10px', backgroundColor: "#000"}} >
                <div className="container">
                    <div className="d-flex sm md">
                        <a className="header-brand" href="/" style={{color: '#fff', fontFamily: 'Avenir',
                            fontWeight: 400, fontSize: '30px'
                        }}>Trend Analysis</a>
                        <h1 style={{marginLeft: "auto", marginRight:"auto" , color:'white'}}> Search Result for {this.state.o.q.toLocaleUpperCase()}</h1>
                        <div className="d-flex order-lg-2 ml-auto">
                            <div className="nav-item">
                                {this.state.type === 'online'?
                                    <button
                                    className="btn btn-sm btn-outline-light"
                                    style={{marginRight: '10px'}}
                                    onClick={this.saveData}>
                                    Save Data</button>:''}
                                <button className="btn btn-sm btn-outline-light" onClick={this.handleDisplay}>Search Again</button></div>
                        </div>
                    </div>
                </div>
            </div>
            <Container fluid>
                <div className="page">
                    <div className="row row row-cards" >
                        <div className="col col-6 col-sm-4 col-lg-2">
                            <div className="card">
                                <div className="card-body p-3 text-center">
                                    <div className="text">TWEETS
                                    </div>
                                    <div className="h1 m-0">{totalTweets}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-6 col-sm-4 col-lg-2">
                            <div className="card">
                                <div className="card-body p-3 text-center">
                                    <div className='text'>Timeframe</div>
                                    <div className="h1 m-0">{timeString}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-6 col-sm-4 col-lg-2">
                            <div className="card">
                                <div className="card-body p-3 text-center">
                                    <div className="text">Reach</div>
                                    <div className="h1 m-0">{followersCount}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-6 col-sm-4 col-lg-2">
                            <div className="card">
                                <div className="card-body p-3 text-center">
                                    <div className="text">Impressions
                                    </div>
                                    <div className="h1 m-0">{impressionCount}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-6 col-sm-4 col-lg-2">
                            <div className="card">
                                <div className="card-body p-3 text-center">
                                    <div className="text">Total RTs</div>
                                    <div className="h1 m-0">{tweetsInfo.totalRetweetCount}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col col-6 col-sm-4 col-lg-2">
                            <div className="card">
                                <div className="card-body p-3 text-center">
                                    <div className="text">Total Faves</div>
                                    <div className="h1 m-0">{totalFav}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="row row">
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-sm-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h3 className="card-title">Tweets By Time</h3>
                                        </div>
                                        <div className='card-body'>
                                            <LineChartComponent data={timeData}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-sm-12">
                                    <div className="card">
                                        <div className="card-header" >
                                            <h3 className="card-title">Tweets By Sentiment</h3>
                                        </div>
                                        <div className="card-body" >
                                            <DChart children={data}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-sm-12">
                                    <div className="card">
                                        <div className="card-header" >
                                            <h3 className="card-title">Tweets By Type</h3>
                                        </div>
                                        <div className="card-body">
                                            <DChart children={data2}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h3 className="card-title">Word Cloud</h3>
                                        </div>
                                        <div className="card-body">
                                            <Wordcloud words={wordcl}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h3 className="card-title">Hashtag Cloud</h3>
                                        </div>
                                        <div className="card-body">
                                            <div style={{width: '100%', height: '100%'}}>
                                                <Wordcloud words={hashCloud}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='offset-lg-3 col-lg-6 col-md-8 offset-md-2 col-sm-10 offset-sm-1'>
                                    <Chart
                                        width={'auto'}
                                        height={'auto'}
                                        chartType="GeoChart"
                                        data={this.getLocation(location)}
                                        mapsApiKey="AIzaSyDAwI6dXQtSCUlHHDBjE_8nBOA4h2sXR6Q"
                                        rootProps={{ 'data-testid': '1' }}
                                    />
                                </div>

                                <div className="col col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <button className="btn-facebook" onClick={this.handleAffin}>{!this.state.AffinGenerate?"Generate Affinity Graph" : "Close Affinity Graph"}</button>
                                    {this.state.AffinGenerate?<Affin tw={myTweet}/>:""}
                                </div>

                                <div className="col col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <Tweetscard data={myTweet}/>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
        )
    }
}

export default Dashboard;
