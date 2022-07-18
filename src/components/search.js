import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import {APICALL, APILocal} from "../lib/constants";

class Search extends Component {
    constructor(props){
        super(props);
        this.state= {
            type: '',
            loading : false,
            display : false,
            search:'',
            noTweets:'10',
            ApiKey: '',
            ApiSec: '',
            AT: '',
            ATSec: '',
            response:{},
            all:false

        }
    }

    componentDidMount = () => {

    };

    searchTweets = async () => {
        if(this.state.search !== '' && this.state.noTweets <5001) {
            let o = {
                tweetsInfo: {
                    q: this.state.search.toLowerCase(),
                    count: this.state.noTweets
                },
                twitterSecrets: {
                    "apiKey": this.state.ApiKey,
                    "apiSecret": this.state.ApiSec,
                    "accessToken": this.state.AT,
                    "accessTokenSecret": this.state.ATSec
                }
            };

            if (this.state.display === true) {
                this.setState({loading: true}, () => fetch(APICALL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(o)
                    }).then(res => res.json())
                        .then((result) => this.setState({response: result},
                            () => this.props.onClick(false, this.state.response, this.state.search, this.state.type)))
                        .catch(err => console.log(err))
                )
            } else {
                let p;
                if (this.state.all === false) {
                    p = {
                        "q": this.state.search.toLowerCase(),
                        "count": this.state.noTweets,
                    }
                }else{
                    p = {
                        "q": this.state.search.toLowerCase(),
                    }
                }
                this.setState({loading: true}, () => fetch(APILocal, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(p)
                    }).then(res => res.json())
                        .then((result) => {
                            if(result.error){
                                console.log(result.error.message)
                                alert(result.error.message)
                                this.setState({loading: false})
                            }else{
                                this.setState({response: result}
                            ,
                            () => this.props.onClick(false, this.state.response, this.state.search, this.state.type))}})
                        .catch(err => console.log(err))
                )
            }
        }
        else {
            alert('check search parameters,note *number of tweets must not exceed above 5000')
        }
    };
    handleChange=(e)=>{
        if (e.target.id === 'database'){
            this.setState({display : false, type : 'offline'})
        }else if (e.target.id === 'internet') {
            this.setState({display:true, type: 'online', all:false});
        }
    };
    handleFormChange= (e) => {
        if (e.target.id === 'tag'){
            let search = e.target.value;
            this.setState({search:search});
        }else if (e.target.id ==='numTweets'){
            this.setState({noTweets: e.target.value})
        }else if (e.target.id === 'AccessToken'){
            this.setState({AT: e.target.value})
        }else if (e.target.id === 'ApiSec'){
            this.setState({ApiSec: e.target.value})
        }else if (e.target.id === 'ATSec'){
            this.setState({ATSec: e.target.value})
        }else if (e.target.id === 'ApiKey'){
            this.setState({ApiKey: e.target.value})
        }
    }

    render(){
        return(
            <Container>
                <Form>
                    <Form.Group controlId="formBasicSearch">
                        <Form.Label>Search</Form.Label>
                        <Form.Control type="Text" id="tag" placeholder="e.g. Cricket" onChange={this.handleFormChange}/>
                    </Form.Group>
                    {this.state.all?"":<Form.Group controlId="formNoTweets">
                        <Form.Label>No Of Tweets</Form.Label>
                        <Form.Control type='number' id="numTweets" min='10' onChange={this.handleFormChange}/>
                    </Form.Group>}
                    <Form.Group as={Row}>
                        <Form.Label as="legend" column sm={2}>
                            Search From
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Check
                                checked={this.state.display}
                                id='internet'
                                type="radio"
                                label="Internet"
                                name="formHorizontalRadios"
                                onChange={this.handleChange}
                            />
                            <Form.Check
                                checked={!this.state.display}
                                id='database'
                                type="radio"
                                label="Database"
                                name="formHorizontalRadios"
                                onChange={this.handleChange}
                            />
                        </Col>
                    </Form.Group>
                    {this.state.display?
                        <>
                        <Form.Group controlId="formAPIkey">
                            <Form.Label>Your API key</Form.Label>
                            <Form.Control type="Text" placeholder="TWITTER API KEY " id='ApiKey' onChange={this.handleFormChange}/>
                        </Form.Group>
                        <Form.Group controlId="formAPISecret">
                            <Form.Label>Your API Secret</Form.Label>
                            <Form.Control type="Text" placeholder="TWITTER API SECRET " id='ApiSec' onChange={this.handleFormChange}/>
                        </Form.Group>
                        <Form.Group controlId="formAPIToken">
                        <Form.Label>Your Access Token</Form.Label>
                        <Form.Control type="Text" placeholder="TWITTER ACCESS TOKEN" id='AccessToken' onChange={this.handleFormChange}/>
                        </Form.Group>
                        <Form.Group controlId="formAPITokenS">
                        <Form.Label>Your Access Token Secret</Form.Label>
                        <Form.Control type="Text" placeholder="TWITTER ACCESS TOKEN SECRET" id='ATSec' onChange={this.handleFormChange}/>
                        </Form.Group>
                        </>
                        : <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1" checked={this.state.all} onChange={() => this.setState({
                                all:!this.state.all
                            })}/>
                                <label className="form-check-label" htmlFor="exampleCheck1">Get all tweets</label>
                        </div>}
                    {this.state.loading?
                        <Button variant="primary" disabled>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Loading...
                        </Button>
                        :<Button variant="primary" type="button" onClick= {this.searchTweets}>
                            Submit
                        </Button>}
                </Form>
            </Container>
        );
    }
}

export default Search;
