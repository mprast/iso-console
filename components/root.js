import React from "react";
import traverse from "react-traverse";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { render } from "react-dom";
import Node from "components/node";
import * as d3h from "d3-hierarchy";

// import {Motion, spring} from "react-motion";
// import { Container, Row, Col } from "react-grid-system";
// import styles from "./root.css";

// class Root extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { doIt: false };
//     }
   
//     componentDidMount() {
//     }

//     getPos() {
//         if (this.state.doIt) {
//             return 800;
//         } else {
//             return 0;
//         }
//     }

//     getTheLazyDazy() {
//         if (this.state.doIt) {
//             return <h1>but I am here too</h1>;
//         }
//     }

//     render(){
//         return <Container fluid={true}> 
//                   <Row>
//                     <Col sm={12} className={styles.navBar}>
//                         <span/>
//                     </Col>
//                   </Row>
//                   <Row>           
//                     <Col sm={6}> 
//                         <h1 className={styles.title}>iso</h1>
//                     </Col>
//                     <Col sm={6}>
//                         <TransitionMotion>
//                             <Motion defaultStyle={{right: 0}} style={{right: spring(this.getPos())}}>
//                                 {(style) => 
//                                     <div>
//                                         <h1 style={Object.assign(style, {position: "relative"})}>mooooooving</h1>
//                                         {this.getTheLazyDazy()}
//                                     </div>}
//                             </Motion>
//                         </TransitionMotion>
//                     </Col>
//                   </Row>
//                   <Row>
//                     <Col sm={12}>
//                         <button type="button" onClick={() => this.setState({doIt: !this.state.doIt})}>Go!!!</button>
//                     </Col>
//                   </Row>
//               </Container>;
//     }
// }

var bestReducer = (state = {}, action) => {
    switch(action.type) {
    case "DO_IT":
        return {"bazinga": "mazinga ha got you it says mazinga"};
    case "DO_NOT_DO_IT":
        return {"bazinga": "oh jeez oh man oh goddddd"};
    default:
        return state;
    }
};

var defaultState = {
    "name": "nodeOne",
     "children": [
        {
         "name": "bodeTwo", 
         "children": [
            {
                "name": "guh-godus!",
                "children": []
            }  
          ]
        },
       {
        "name": "bodeThree",
        "children": []
       }
     ]
};

var bestStore = createStore(bestReducer, defaultState);

const replaceStrongsWithEms = (node) => traverse(node, {
    DOMElement(path) {
        if(path.node.type === "strong") {
            return React.createElement(
                    "em",
                    path.node.props,
                    ...path.traverseChildren()
                  );
        }
        return React.cloneElement(
            path.node,
            path.node.props,
            ...path.traverseChildren()
          );
    },
});

const project = (angle, radius, boxSize) => {
    const center = boxSize / 2;
    const cartesian = [Math.cos(angle) * radius, Math.sin(angle) * radius];
    const offsets = cartesian.map((coord) => center + coord);
    // we've calculated the offset from the bottom but we want the 
    // offset from the top.
    offsets[1] = boxSize - offsets[1];
    return offsets;
};

const injectLayout = (node) => {
    const d3_hierarchy = traverse(node, {
        ComponentElement(path){
            switch(path.node.type){
            case Node: {
                var nodeHash = {
                    "name": path.node.props.name
                };
                const children = path.traverseChildren();
                if(children.length > 0) {
                    nodeHash = Object.assign(nodeHash, {"children": children});
                }
                return nodeHash;
            }
            default: {
                return path.traverseChildren();
            }
            }
        }
    });

    const d3_node = d3h.hierarchy(d3_hierarchy);

    const tree = d3h.tree().size([360, 500]);

    tree(d3_node);

    const posMap = d3_node.descendants().reduce((acc, val) => {acc[val.data.name] = [val.x, val.y]; return acc;}, {});

    const nodes_with_pos = traverse(node, {
        ComponentElement(path){
            switch(path.node.type){
                case Node: {
                    const offsets = project(...posMap[path.node.props.name], 1000);
                    return React.cloneElement(
                        path.node,
                        Object.assign(Object.assign({}, path.node.props), {leftOffset: offsets[0], topOffset: offsets[1]}),
                        ...path.traverseChildren()
                    );
                }
                default: {
                    return path.traverseChildren();
                }
                
            }
        } 
    });

    return nodes_with_pos; 
};

const filterTree = (node) => {
    return injectLayout(node);
};

var Root = (props) => {
    return <svg width="1000" height="1000">
            <rect style={{fillOpacity:0, strokeWidth:5, stroke:"black"}} width="1000" height="1000"/>
            {filterTree(Node.constructElement(props))}
           </svg>;
};

function mapStateToProps(state) {
    return {state: state};
}

const NewRoot = connect(mapStateToProps)(Root);

const topLevel = <Provider store={bestStore}>
                    <NewRoot/> 
                 </Provider>;

render(topLevel, document.getElementById("root"));
