import { IsoState } from "src/redux/state_types";
import { Node, NodeObject } from "src/redux/value_objects/node";
import { Mask } from "src/redux/value_objects/value_object";
import * as d3f from "d3-force";
import * as _ from "lodash";

export function injectLayout(state: IsoState["console"]): IsoState["console"] {
    // mutative
    injectLayoutIntoNodes(state.rootGraph.nodes);
    return state;
}

export function injectLayoutIntoNodes(
    nodes: Array<Mask<Node, {setCoords: Node["setCoords"]}>>) {

    let d3Index = -1;
    const indexToName = {};

    const d3Nodes = nodes.map((_node) => {
        const node = _node!;

        d3Index++;
        indexToName[d3Index] = node.name;

        let dNode = {
            d3Index,
            x: node.coords.x,
            y: node.coords.y,
        };

        if(node.isRoot) {
            dNode = Object.assign(dNode, {x: 0, y: 0, fx: 0, fy: 0});
        }

        return dNode;
    });

    let d3EdgeIndex = -1;
    const d3Edges = nodes.reduce((_acc: any, _node) => {
        const acc = _acc!;
        const node = _node!;

        const edgesFromNode = node.incidents.map((incidentEdge) => {
            return {
                source: d3EdgeIndex + 1,
                target: nodes.findIndex((incNode) => {
                    return incNode!.name === incidentEdge;
                }) + 1,
            };
        });

        return acc.concat(edgesFromNode);
    }, []);

    // distance_max helps performance a lot! helps produce a ***localized layout***.
    // we want this.
    const simulation = d3f.forceSimulation(d3Nodes)
        .force("charge", d3f.forceManyBody().strength(-160))
        .force("link", d3f.forceLink(d3Edges).distance(200).strength(0.1).iterations(10))
        .force("x", d3f.forceX())
        .force("y", d3f.forceY())
        .stop();

    const numTicks = Math.ceil(Math.log(simulation.alphaMin()) /
        Math.log(1 - simulation.alphaDecay()));

    for (let i = 0; i < numTicks; i++) {
        simulation.tick();
    }

    const projectedD3 = project(d3Nodes);

    if (nodes.length !== d3Nodes.length) {
        throw RangeError(`Nodes array is of length ${nodes.length}, node array returned ` +
                         `by d3 is of length ${d3Nodes.length}`);
    }

    const zipNodes = (node: Mask<Node, {setCoords: Node["setCoords"]}>,
                    d3Node: {x: number, y: number}) => {
        node.setCoords(d3Node);
    };
    _.zipWith(nodes, d3Nodes, zipNodes);

    return nodes;
}

// returns coords as floats in [0, 1]. The graph component will pass
// down its size to the node objects & we can use that to get the
// layout in pixels.
export function project<T>(nodes: Array<{x: number, y: number} & T>) {
    // square canvas, so size should be greatest of all the coords
    let boxRadNoPadding = Math.max(..._.flatMap(nodes, (n) => [n.x, n.y]));

    // a zero-size box will screw things up; default to 1
    if (boxRadNoPadding === 0) {
        boxRadNoPadding = 1;
    }

    // 5% padding around the edges so other stuff can render outside of where the
    // nodes are
    const boxRadWithPadding = boxRadNoPadding * 1.05;

    // -coords need to be converted into floats in [0, 1]
    // -origin needs to be converted to the upper *left* corner of the
    // box rather than the center of the box
    return nodes.map((node) => {
        return Object.assign(node, {
            x: (node.x / (boxRadWithPadding * 2)) + 0.5,
            y: 0.5 - (node.y / (boxRadWithPadding * 2)),
        });
    });
}
