import { IsoState } from "src/redux/state_types";
import * as d3f from "d3-force";
import * as _ from "lodash";

function injectLayout(state: IsoState): IsoState {
    const nodes = state.console.nodes;

    let d3Index = -1;
    const indexToName = {};

    const d3Nodes = nodes.map((_node) => {
        const node = _node!;

        d3Index++;
        indexToName[d3Index] = node.name;

        const dNode = {
            d3Index,
            x: node.coords.x,
            y: node.coords.y,
        };

        if(node.isRoot) {
            dNode.x = dNode.y = 0;
        }

        return dNode;
    });

    let d3EdgeIndex = -1;
    const d3Edges = nodes.reduce((_acc: any, _node) => {
        const acc = _acc!;
        const node = _node!;

        const edgesFromNode = node.incidents.map((incidentEdge) => {
            return {
                source: d3EdgeIndex,
                target: nodes.findIndex((incNode) => {
                    return incNode!.name === incidentEdge;
                }),
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

    const newNodes = Object.keys(indexToName).map((index) => {
        const node = nodes.find((n) => n.name === indexToName[index]);
        if (node === undefined) {throw "node is null";}
        const d3Node = projectedD3.find((n) => n.d3Index === parseInt(index, 10));
        if (d3Node === undefined) {throw "d3Node is null";}

        return Object.assign(node, {coords: {x: d3Node.x, y: d3Node.y}});
    });

    return Object.assign({}, state, {nodes: newNodes});
}

// returns coords as floats in [0, 1]. The graph component will pass
// down its size to the node objects & we can use that to get the
// layout in pixels.
function project<T>(nodes: Array<{x: number, y: number} & T>) {
    // square canvas, so size should be greatest of all the coords
    const boxRadNoPadding = Math.max(_.flatMap(nodes, (n) => [n.x, n.y]));
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
