import * as React from "react";
import { Component } from "react";
import * as styles from "src/console/components/node.css";

type propTypes = {
                    name: String,
                    key: String,
                    dispatch: (action: {}) => {},
                    leftOffset?: number,
                    topOffset?: number,
                 };

type stateTypes = {style: {}};

export class Node extends Component<propTypes, stateTypes> {
    private cRootAction = {type: "CHANGE_ROOT", nodename: this.props.name};

    constructor(props: propTypes) {
        super(props);
        this.state = {style: styles.default};
    }

    public render() {
        return <circle
                cx={this.props.leftOffset}
                cy={this.props.topOffset}
                r={10}
                style={this.state.style}
                onMouseOver={() => this.setState({style: styles.mousedOver})}
                onMouseOut={() => this.setState({style: styles.default})}
                onClick={() => this.props.dispatch(this.cRootAction)}/>;
    }
}
