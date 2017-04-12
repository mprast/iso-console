import * as React from "react";
import { Component } from "react";
import { addDispatch } from "src/redux/util/add_dispatch";
import * as styles from "src/console/components/node.css";

type propTypes = {
                    name: String,
                    key: String,
                    leftOffset?: number,
                    topOffset?: number,
                    graphWidth: number,
                    graphHeight: number,
                 };

type stateTypes = {cssClass: string};

export class Node extends Component<propTypes, stateTypes> {
    private cRootAction = {type: "CHANGE_ROOT", nodename: this.props.name};

    constructor(props: propTypes) {
        super(props);
        this.state = {cssClass: styles.default};
    }

    public render() {
        // implicitly assuming leftOffset and topOffset get set before
        // we ever try to render the node
        return <circle
                cx={this.props.leftOffset! * this.props.graphWidth}
                cy={this.props.topOffset! * this.props.graphHeight}
                r={10}
                className={this.state.cssClass}
                onMouseOver={() => this.setState({cssClass: styles.mousedOver})}
                onMouseOut={() => this.setState({cssClass: styles.default})}
                onClick={() => this.context.dispatch(this.cRootAction)}/>;
    }
}
addDispatch(Node);
