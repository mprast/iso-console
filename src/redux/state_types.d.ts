import {Graph} from "src/redux/value_objects/graph";
/// <reference path="react.d.ts" />

export interface IsoState {
    console: IsoConsoleState;
    admin: IsoAdminState;
    control: IsoControlState;
    // this is handled by react-router-redux
    router: any;
}

export interface IsoConsoleState {
    rootGraph: Graph;
}

export interface IsoAdminState {
}

export interface IsoControlState {
}

// as we need more powerful contracts perhaps we'll
// beef up this type a little more.
export type ComponentTree = React.ReactElement<any>;
