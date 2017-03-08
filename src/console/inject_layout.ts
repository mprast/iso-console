import { IsoState, ImmutableRecord } from "src/redux/state_types";

function injectLayout(state: IsoState) {
    const nodes = state.console.nodes;

    let d3Index = -1;
    const d3Nodes = nodes.map((_node) => {
        const node = _node!;

        d3Index++;
        const dNode = {
            d3Index,
            x: node.coords.x,
            y: node.coords.y,
        };

        if(node.isRoot) {
            dNode.x = dNode.y = 0;
        }

        return dNode;
    }).toJS();

    let d3EdgeIndex = -1;
    const d3Edges = nodes.reduce((_acc, _node) => {
        const acc = _acc!;
        const node = _node!;

        const edgesFromNode = node.incidents.map((incidentEdge) => {
            return {
                source: d3EdgeIndex,
                target: nodes.findIndex((incNode) => {
                    return incNode!.name === incidentEdge;
                }),
            };
        }).toJS();

        return acc.concat(edgesFromNode);
    }, []);
}
