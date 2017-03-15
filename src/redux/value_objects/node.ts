import {ValueObject, ValueObjectInternal, addProxy, Mask} from "src/redux/value_objects/value_object";

export function buildNode(obj: NodeObj) {
    return addProxy(new NodeInternal(obj));
}

export type Node = ValueObject<NodeInternal>;

type NodeObj = {
    name: string,
    isRoot: boolean,
    incidents: Array<string>,
    coords: {
        x: number,
        y: number,
    },
};

class NodeInternal extends ValueObjectInternal<NodeObj> {
    public setCoords(coords: NodeObj["coords"]) {
        this.object.coords = coords;
    }

    public addEdgesTo(target: Node) {
        this.object.incidents.push(target.name);
    }
}
