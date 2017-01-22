const React = require("react");
const { Component } = React;
const { render } = require("react-dom");

class Test extends Component {
    render(){
        return <div>It rendered! Huzzah!</div>;
    } 
}

render(<Test/>, document.getElementById("root"));
