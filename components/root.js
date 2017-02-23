import React from "react";
import traverse from "react-traverse";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { render } from "react-dom";
import TestC1 from "components/testc1.js";
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

var bestStore = createStore(bestReducer, {"bazinga": "bazinga!!!"});

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

var Root = (props) => {
    return replaceStrongsWithEms(<div>{TestC1.constructElement(props)}</div>);
};

function mapStateToProps(state) {
    return {state: state};
}

const NewRoot = connect(mapStateToProps)(Root);

const topLevel = <Provider store={bestStore}>
                    <NewRoot/> 
                 </Provider>;

render(topLevel, document.getElementById("root"));
