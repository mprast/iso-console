import React from "react";
import traverse from "react-traverse";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { render } from "react-dom";
import Node from "components/node";
import * as d3f from "d3-force";

const project = (x, y, boxSize) => {
    const center = boxSize / 2;
    const cartesian = [x, y];
    const offsets = cartesian.map((coord) => center + coord);
    // we've calculated the offset from the bottom but we want the 
    // offset from the top.
    offsets[1] = boxSize - offsets[1];
    return offsets;
};

var bestReducer = (state = {}, action) => {
    var retState = state;
    var node = null;
    var nIndex = -1;
    switch(action.type) {
    case "CHANGE_ROOT":
        nIndex = retState.nodes.findIndex((n) => {return n.name == action.nodename;});
        retState.nodes.forEach((n) => {n.root = false;});
        retState.nodes[nIndex].root = true;
        break;
    default:
        break;
    }

    var thing = calcLayout(retState);
    return thing;
};

var calcLayout = (state = {}) => {
    var index = -1;
    const d3_nodes = state.nodes.map(function(node) {
         index++;
         const dNode = {
             index: index,
             x: node.coords[0],
             y: node.coords[1]
         };
         if(node.root == true) {
            dNode.x = 0;
            dNode.y = 0;
            dNode.fx = 0;
            dNode.fy = 0;
         }
        return dNode;
    });


    index = -1;
    const d3_edges = state.nodes.reduce(function(acc, node) {
        index++;
        return acc.concat( node.incidents.map(function(incident) {
            return {
                source: index,
                target: state.nodes.findIndex((incNode) => {return incNode.name == incident;})
            };
        }));
    }, []);

    const simulation = d3f.forceSimulation(d3_nodes)    
        .force("charge", d3f.forceManyBody().strength(-80))
        .force("link", d3f.forceLink(d3_edges).distance(200).strength(1).iterations(10))
        .force("x", d3f.forceX())
        .force("y", d3f.forceY())
        .stop();

    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
        simulation.tick();
    }
   
    index = -1;
    state.nodes = state.nodes.map(function(node){
        index++;
        const d3n = d3_nodes.find((n) => {return n.index == index;});
        node.coords = project(d3n.x, d3n.y, 1000);
        return node;
    });

    var newState = {};
    newState.nodes = state.nodes;
    return newState;
};

var defaultState = {
    "nodes":
    [
        {
            "name": "nodeOne",
            "root": false,
            "incidents": [],
            "coords": [0, 0]
        },
        {
            "name": "bodeTwo",
            "root": false,
            "incidents": [],
            "coords": [0, 0]
        },
        {
            "name": "bodeThree",
            "root": true,
            "incidents": ["nodeOne", "bodeTwo"],
            "coords": [0, 0]
        },
        {
            "name": "guh-godus!",
            "root": false,
            "incidents": ["bodeThree"],
            "coords": [0, 0]
        }
    ]
};

var bestStore = createStore(bestReducer, defaultState);

const injectMotion = (state, rootNode) => {
    return rootNode;
};

const filterTree = (state, rootNode) => {
    return injectMotion(state, rootNode);
};

var Root = (props) => {
    const elTree = <svg width="1000" height="1000">
            <rect style={{fillOpacity:0, strokeWidth:5, stroke:"black"}} width="1000" height="1000"/>
            {
                props.state.nodes.map(function(nodeProps) {
                        return Node.constructElement(Object.assign(nodeProps, {dispatch: props.dispatch}));
                    })
            }
           </svg>;

    return filterTree(props.state, elTree);
};

function mapStateToProps(state) {
    return {state: state};
}

const NewRoot = connect(mapStateToProps)(Root);

const topLevel = <Provider store={bestStore}>
                    <NewRoot/> 
                 </Provider>;

render(topLevel, document.getElementById("root"));
