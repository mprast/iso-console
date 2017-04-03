import * as _ from "lodash";
import { IsoState } from "src/redux/state_types";
import { buildPipeline } from "src/util/std_functional";
import { constructComponentTree } from "src/console/construct_component_tree";
import { injectMotion } from "src/console/inject_motion";
import * as React from "react";
import { Component, StatelessComponent } from "react";
import { connect } from "react-redux";

const consolePostUpdatePipeline = buildPipeline(constructComponentTree, [injectMotion]);

// we want the console view to fill the viewport
const Root = (props: {state: IsoState["console"]}) => {
    return <svg style={{width: "100%", height: "100%"}}> 
    {
        // turns the state tree into the elements we want to map on the svg view
        consolePostUpdatePipeline(props.state)
    }
    </svg>;
};

export const ConsoleRoot = connect((state) => {return {state: state.console}; })(Root);
