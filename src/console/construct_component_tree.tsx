import * as _ from "lodash";
import * as React from "react";
import { IsoState, ComponentTree } from "src/redux/state_types";
import { traverse } from "src/util/std_functional";
import { Node } from "src/console/components/node";

export function constructComponentTree(state: IsoState): ComponentTree {
    return <g>
        {
            _.map(state.console.nodes, (node) => {
                return <Node key={node.name} name={node.name}/>;
            })
        }
        </g>;
}
