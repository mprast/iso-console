import React, { Component } from "react";

export default class Node extends Component {
    constructor(props) {
        super(props);
    }

    static constructElement(props){
        return <Node key={props.state.name} name={props.state.name}>
                {
                    props.state.children.map(function(childState) {
                        return Node.constructElement(Object.assign(Object.assign({}, props), {state: childState}));
                    })
                }             
               </Node>;
    }

    render() {
        return <g>
                <circle cx={this.props.leftOffset} cy={this.props.topOffset} r={10} stroke="green" fill="white" strokeWidth={3}/>
                <text x={this.props.leftOffset + 10} y={this.props.topOffset}>{this.props.name}</text>
                {React.Children.toArray(this.props.children)}
            </g>;
    }
}
