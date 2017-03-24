import { ComponentTree } from "src/redux/state_types";
import { Node } from "src/console/components/node";
import traverse from "react-traverse";
import * as React from "react";
import {Motion, spring} from "react-motion";

export function injectMotion(tree: ComponentTree): ComponentTree {
    return traverse(tree, {
        ComponentElement(path: any) {
            switch (path.node.type) {
                case Node: {
                    const [x, y] = [path.node.props.finalX, path.node.props.finalY];
                    return <Motion style={{x: spring(x), y: spring(y)}}>
                        {
                            (position: any) => {
                                return React.cloneElement(
                                    path.node,
                                    Object.assign(
                                        {},
                                        path.node.props,
                                        {x: position.x, y: position.y},
                                    ),
                                    ...path.traverseChildren(),
                                );
                            }
                        }
                    </Motion>;
                }
                default: {
                    return path.traverseChildren();
                }
            }
        },
    }) as ComponentTree;
}
