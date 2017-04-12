import {IsoState} from "src/redux/state_types";
import {buildNode} from "src/redux/value_objects/node";
import {buildGraph} from "src/redux/value_objects/graph";

export function buildTestState(): IsoState {
    const nodes = [
        {
            name: "testOne",
            isRoot: false,
            incidents: ["testTwo, testThree"],
            coords: {
                x: 0,
                y: 0,
            },
        },
        {
            name: "testTwo",
            isRoot: true,
            incidents: ["testThree"],
            coords: {
                x: 0,
                y: 0,
            },
        },
        {
            name: "testThree",
            incidents: ["testTwo"],
            isRoot: false,
            coords: {
                x: 0,
                y: 0,
            },
        },
        {
            name: "testFour",
            incidents: ["testOne"],
            isRoot: false,
            coords: {
                x: 0,
                y: 0,
            },
        },
    ];

    const wrappedNodes = nodes.map((nodeObj) => buildNode(nodeObj));

    const testState: IsoState = {
        console: {
            rootGraph: buildGraph({nodes: wrappedNodes, size: [1000, 1000]}),
        },
        admin: {},
        control: {},
        router: undefined,
    };

    return testState;
};
