import React, { Component } from "react";
import { render } from "react-dom";
import { SplitBrain } from "split-brain";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = { doIt: false };
    }

    getTheLazyLoad(doIt){
        if(doIt) {
            return <SplitBrain.Chunk imports={{"CssTest": "components/css_test.js"}}>
                      <CssTest/>
                   </SplitBrain.Chunk>;
        }
    }
    
    render(){
        return <div>
            <button type="button" onClick={() => this.setState({doIt: true})}>Go!!!</button>
            {this.getTheLazyLoad(this.state.doIt)}
            </div>;
    }
}

render(<Test/>, document.getElementById("root"));
