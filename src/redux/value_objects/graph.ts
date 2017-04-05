import {ValueObject, buildValueObject, Mask} from "src/redux/value_objects/value_object";
import {Node} from "src/redux/value_objects/node";
import * as _ from "lodash";

function setRoot(name: String): void {
    const newRoot = _.find(this.nodes as Array<Node>, (node) => node.name === name);
    if (newRoot === undefined) {
        // TODO(mprast): log warning and keep the root the same
        return;
    }

    const root = _.find(this.nodes as Array<Node>, (node) => node.isRoot);
    if (root !== undefined) {
        root!.isRoot = false;
    }

    newRoot.isRoot = true;
}

export function buildGraph(object: GraphObject): Graph {
    const newObject: any = buildValueObject(object);
    newObject.setRoot = setRoot.bind(object);
    return newObject as Graph;
};

export type Graph = ValueObject<GraphObject> &
{
    setRoot: (target: string) => void,
};

export type GraphObject = {
    nodes: Array<Node>;
};
