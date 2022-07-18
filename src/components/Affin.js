import React, {Component} from 'react';
import {Graph} from "react-d3-graph";
import  _ from 'lodash';

class Affin extends Component{
    constructor(props) {
        super(props);
        this.state= {
            tw:this.props.tw,
            data:{},
            display:false,
            toolTip:''
        }
    }
    componentWillMount() {
        let tw = this.state.tw;
        this.node_edges(tw);
    }
    onMouseOverNode = (node) =>{
        this.setState({
            toolTip: node.toString()
        })
    }

    node_edges = (tweet) => {
        let colorGroup = {
            parent: "#d3701d",
            hashtag: "#3979d1",
            people: "#ffffff",
            url: "#000"
        };
        let graph = {
            "nodes": [],
            "links": []
        }
        let allTags = [];
        for (let i=0; i < tweet.length; i++) {
            // let index = graph.nodes.findIndex(x => x.rel === "parent");

            let hashtag = tweet[i].text.match(/#\S+/gm) || [];
            let people = tweet[i].text.match(/@\S+/gm) || [];
            let url = tweet[i].text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi) || [];
            let childArray = hashtag.concat(people, url);
            allTags = allTags.concat(childArray);
            graph.nodes.push({"name": tweet[i].text,
                "group": i,
                color: colorGroup.parent,
                fontColor: "rgba(255,255,255,0.0)",
                rel: "parent",
                id: tweet[i].text,
                rd:'',
                "size": 200,
                "childArray": childArray,
                labelProperty: "rd"
            });
        }

        allTags = _.uniq(allTags);
        let tagsHashMap = {};
        for (let i in graph.nodes) {
            let node = graph.nodes[i];
            for (let t in allTags) {
                let at = allTags[t];
                if (node.name.toLowerCase().indexOf(at.toLowerCase()) > -1) {
                    if (tagsHashMap[at] && Object.keys(tagsHashMap[at]).length > 0) {
                        tagsHashMap[at].links.push(node.id);
                        tagsHashMap[at].repeats++;
                    } else {
                        tagsHashMap[at] = {
                            links: [node.id],
                            repeats: 1
                        };
                    }
                }
            }
        }

        _.each(tagsHashMap, (item, i) => {
            let obj = {
                id: i,
                name: i,
                links: item.links,
                size: (item.repeats +200)*3,
                color: colorGroup.hashtag,
                labelProperty: "name"
            };
            graph.nodes.push(obj)
        });

        _.each(graph.nodes, (item) => {
            let edge = {};
            if (item.links && item.links.length > 0) {
                for (let i in item.links) {
                    edge.source = item.id;
                    edge.target = item.links[i];
                }
                graph.links.push(edge);
                if (item.links.length > 1) {
                    for (let j in item.links) {
                        let newEdge = {};
                        if (j === 0 && item.links.length === 2) {
                            newEdge.source = item.links[0];
                            newEdge.target = item.links[1];
                            graph.links.push(newEdge);
                        } else if (j > 0 && item.links.length >= j+1 && item.links.length !== j+1) {
                            newEdge.source = item.links[j];
                            newEdge.target = item.links[j++];
                            graph.links.push(newEdge);
                        }
                    }
                }
            }
        });

        let t_nodes =_.filter(graph.nodes, (o)=> o.rel === "parent" );
        for (let i in t_nodes) {
            let newEdge = {};
            if (i === 0) {
                newEdge.source = t_nodes[0].id;
                newEdge.target = t_nodes[1].id;
                graph.links.push(newEdge);
            } else if (i < t_nodes.length-1) {
                newEdge.source = t_nodes[i].id;
                newEdge.target = t_nodes[++i].id;
                graph.links.push(newEdge);
            }
        }

        // console.log("GRAPH NODES: ", graph.nodes);

        this.setState({data: graph})
    };


    render(){
        const myConfig = {

            height: (window.screen.height > 700 ? (window.screen.height/2) + 70 : window.screen.height - 200),
            width:window.screen.width -250,
            nodeHighlightBehavior: true,
            automaticRearrangeAfterDropNode: true,
            node: {
                fontSize : 15,
                fontWeight:600,
                highlightStrokeColor: "blue",
                labelProperty: "name"
            },
            link: {
                highlightColor: "lightblue",
                color:"#2bcbba"
            },
        };
        return(


            <div style={{
                background: "#fff",
                border:"1px solid rgba(0, 40, 100, 0.12)",
                width: myConfig.width,
                height: myConfig.height,
                marginRight: 'auto',
                marginLeft: 'auto',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
                <div className="tooltip">
                    <span>{this.state.toolTip}</span>
                </div>
                <Graph id="graph01"
                        onClickNode={this.onMouseOverNode}
                       data={this.state.data}
                       config={myConfig}
                />

            </div>

        )
    }
}

export default Affin;
