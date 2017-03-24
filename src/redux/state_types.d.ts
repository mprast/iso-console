import {Node} from "src/redux/value_objects/node";
/// <reference path="react.d.ts" />

export interface IsoState {
    console: IsoConsoleState;
    admin: IsoAdminState;
}

export interface IsoConsoleState {
    nodes: Array<Node>;
}

export interface IsoAdminState {
}

// as we need more powerful contracts perhaps we'll
// beef up this type a little more.
export type ComponentTree = React.ReactElement<any>;
