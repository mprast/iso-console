import React, {Component} from "react";

class TestC1 extends Component {
    constructor(props) {
        super(props);
    }

    static constructElement(props){
        return <TestC1>
                 <div>
                    <strong>{"Bazinga says: " + props.state.bazinga}</strong>
                    <button type="button" onClick={() => props.dispatch({type: "DO_IT"})}>DO_IT</button>
                    <button type="button" onClick={() => props.dispatch({type: "DO_NOT_DO_IT"})}>no dont do it augh</button>
                 </div>
               </TestC1>;
    }

    render(){
        return this.props.children;
    }
}

export default TestC1;
