import React, {Component} from 'react';
import './style/style.css'
import '../node_modules/react-vis/dist/style.css';
import './App.css';
import Search from './components/search';

import {  Card } from 'react-bootstrap';
import Dashboard from './components/dashboard';


class App extends Component {
  constructor (props){
    super(props);
    this.state={
      display : true,
      TweetsData:{},
      query:'',
      type:''
    }
  }
  displayhandler = (sw, data, query, type) => {
    this.setState({
      display: sw,
      TweetsData : data,
      query: query,
      type:type
    })
  };


  render(){
    let o = {
      q: this.state.query.toLowerCase()
    }
    return (
      <>
          {this.state.display ?
            <Card className="offset-lg-3 col-lg-6 col-md-8 offset-md-2 col-sm-10 offset-sm-1" style={{marginTop: '50px'}}>
              <Card.Header style= {{textAlign: 'center', display: 'block', lineHeight: '40px', fontWeight: '700', fontSize: '22px', fontFamily: 'Avenir'}} fluid={"true"}>
                Search For Tweets
              </Card.Header>
             <Card.Body>
               <Search onClick={this.displayhandler} />
             </Card.Body>

            </Card>
              : <Dashboard onClick={this.displayhandler} query ={o} type={this.state.type} data = {this.state.TweetsData}/>}
    </>
    );
  }
}

export default App;
