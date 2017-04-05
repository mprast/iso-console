import {buildTestState} from "test/redux/test_state";
import {ErrorsAsserter} from "test/helpers/assertion_helpers";
import {IsoState} from "src/redux/state_types";
import {Node} from "src/redux/value_objects/node";

// declare jest-imported globals so we don't
// get errors from typescript
declare let test: any;
declare let expect: any;
declare let beforeEach: any;

// Typescript doesn't know when the block in beforeEach
// is gonna get run.
let testState: IsoState, nodeOne: Node, nodeTwo: Node;

// TODO(mprast): when we make things immutable let's
// take this out (since it's expensive)
beforeEach(() => {
    testState = buildTestState();
    nodeOne = testState.console.rootGraph.nodes[0];
    nodeTwo = testState.console.rootGraph.nodes[1];
});

test("setCoords sets the coordinates", () => {
    const newCoords = {x: 100, y: 200};
    nodeOne.setCoords(newCoords);
    expect(nodeOne.coords).toBe(newCoords);
});
