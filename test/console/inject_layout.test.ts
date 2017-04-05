import {injectLayout, project} from "src/console/inject_layout";
import {buildTestState} from "test/redux/test_state";
import {ErrorsAsserter} from "test/helpers/assertion_helpers";
import {IsoConsoleState} from "src/redux/state_types";
import * as _ from "lodash";

// declare jest-imported globals so we don't
// get errors from typescript
declare let test: any;
declare let expect: any;

const consoleState = () => {
    return buildTestState().console;
};

const nodes = (cs: IsoConsoleState) => {
    return cs.rootGraph.nodes;
};

test("node count remains the same", () => {
    // need to build test state twice here since injectLayout mutates
    const initialState = consoleState();
    const finalState = injectLayout(consoleState());
    expect(nodes(finalState).length).toEqual(nodes(initialState).length);
});

test("root node should be in the center", () => {
    const finalState = injectLayout(consoleState());
    const rootNode = _.find(nodes(finalState), (node) => node.isRoot)!;
    const ea = new ErrorsAsserter();
    // gotta project these guys to figure out what (0, 0) is in our
    // final coordinate system. shouldn't matter what the other
    // nodes are; measures are fractions of 1 so 0 coord is scale-invariant
    const {x: targetX, y: targetY} = project([{x: 0, y: 0}])[0];
    if (rootNode.coords.x !== targetX || rootNode.coords.y !== targetY) {
        ea.push(`Root node should be at {${targetX}, ${targetY}}, but is at ` +
            `{${rootNode.coords.x}, ${rootNode.coords.y}}`);
    }
    ea.assertNoErrors();
});
