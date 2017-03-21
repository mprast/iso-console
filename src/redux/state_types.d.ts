import {Node} from "src/redux/value_objects/node";

export interface IsoState {
    console: IsoConsoleState;
    admin: IsoAdminState;
}

export interface IsoConsoleState {
    nodes: Array<Node>;
}

export interface IsoAdminState {
}
