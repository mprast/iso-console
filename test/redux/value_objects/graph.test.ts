import {buildTestState} from "test/redux/test_state";
import {ErrorsAsserter} from "test/helpers/assertion_helpers";
import {IsoState} from "src/redux/state_types";
import {Graph} from "src/redux/value_objects/graph";
import {Node} from "src/redux/value_objects/node";
import * as _ from "lodash";

// declare jest-imported globals so we don't
// get errors from typescript
declare let test: any;
declare let expect: any;
declare let beforeEach: any;

// Typescript doesn't know when the block in beforeEach
// is gonna get run.
let testState: IsoState, graph: Graph;

// TODO(mprast): when we make things immutable let's
// take this out (since it's expensive)
beforeEach(() => {
    testState = buildTestState();
    graph = testState.console.rootGraph;
});

function firstNonRoot(iGraph: Graph): Node {
    return _.find(graph.nodes, (node) => !node.isRoot)!;
}

function firstRoot(iGraph: Graph): Node {
    return _.find(graph.nodes, (node) => node.isRoot)!;
}

function getAllRoots (iGraph: Graph): Array<Node> {
    return _.filter(graph.nodes, (node) => node.isRoot)!;
}

test("changeRoot changes the root", () => {
    const targetName = firstNonRoot(graph).name;
    graph.setRoot(targetName);
    expect(firstRoot(graph).name).toBe(targetName);
});

test("changeRoot doesn't change the root if it can't find the name", () => {
    const badName = "XXXXI'm not in the graphXXXX";
    const targetName = firstRoot(graph).name;
    graph.setRoot(badName);
    expect(firstRoot(graph).name).toBe(targetName);
});
