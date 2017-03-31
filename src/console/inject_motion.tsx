import { ComponentTree } from "src/redux/state_types";
import { Node } from "src/console/components/node";
import traverse from "react-traverse";
import * as React from "react";
import { Component, ReactElement } from "react";
import {Motion, spring} from "react-motion";

export function injectMotion(tree: ComponentTree): ComponentTree {
    return traverse(tree, {
        ComponentElement(path: any) {
            switch (path.node.type) {
                case Node: {
                    return wrapMotion(path.node, path.traverseChildren);
                }
                default: {
                    return path.traverseChildren();
                }
            }
        },
    }) as ComponentTree;
}

function wrapMotion(node: ReactElement<any>, traverseChildren: () => ReactElement<any>): JSX.Element {
    const [x, y] = [node.props.leftOffset, node.props.topOffset];
    return <Motion style={{x: spring(x), y: spring(y)}}>
        {
            (position: any) => {
                return React.cloneElement(
                    node,
                    Object.assign(
                        {},
                        node.props,
                        {leftOffset: position.x, topOffset: position.y},
                    ),
                    traverseChildren(),
                );
            }
        }
        </Motion>;
}
