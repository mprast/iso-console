import * as _ from "underscore";
import { IsoState } from "src/redux/state_types";
import { Component } from "react";

// here mainly for type-checking
function buildPipeline<T>(stages: Array<(input: T) => T>) {
    return _.compose(stages);
};

let preStages = [];
let postStages = [];
const preUpdatePipeline = buildPipeline<IsoState>(preStages);
const postUpdatePipeline = buildPipeline<[IsoState, Component]>(postStages);

const Root = (props) => {
};

const ConsoleRoot = connect((state) => {return {state: state.console}; })(Root);

export default ConsoleRoot;
