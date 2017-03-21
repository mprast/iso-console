import {ValueObject, buildValueObject, Mask} from "src/redux/value_objects/value_object";

function setCoords(coords: NodeObject["coords"]): void {
    this.coords = coords;
}

function addEdgesTo(target: Node): void {
    this.incidents.push(target.name);
}

export function buildNode(object: NodeObject): Node {
    const newObject: any = buildValueObject(object);
    newObject.setCoords = setCoords.bind(object);
    newObject.addEdgesTo = addEdgesTo.bind(object);
    return newObject as Node;
};

export type Node = ValueObject<NodeObject> &
{
    setCoords: (coords: NodeObject["coords"]) => void,
    addEdgesTo: (target: Node) => void,
};

export type NodeObject = {
    name: string,
    isRoot: boolean,
    incidents: Array<string>,
    coords: {
        x: number,
        y: number,
    },
};
