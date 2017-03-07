import React, { Component } from "react";

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {opacity: 0.6};
    }

    static constructElement(nodeProps){
        return <Node key={nodeProps.name} name={nodeProps.name} dispatch={nodeProps.dispatch}/>;
    }

    render() {
        return <g>
                <circle cx={this.props.leftOffset} cy={this.props.topOffset} r={10} stroke="green" fill="green" fillOpacity={this.state.opacity} strokeWidth={3} onMouseOver={() => this.setState({opacity: 0.3})} onMouseOut={() => this.setState({opacity: 0.6})} onClick={() => this.props.dispatch({type: "CHANGE_ROOT", nodename: this.props.name})}/>
                <text x={this.props.leftOffset + 10} y={this.props.topOffset}>{this.props.name}</text>
            </g>;
    }
}
