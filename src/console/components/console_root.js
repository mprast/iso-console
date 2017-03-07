"use strict";
exports.__esModule = true;
var _ = require("underscore");
var doTheThing = true;
function noReturn() {
    var ab = "2";
}
;
// point of no return
noReturn();
// here mainly for type-checking
function buildPipeline(stages) {
    return _.compose(stages);
}
;
var myNewVarrr;
myNewVarrr = { heythingone: 3, heythingtwo: { babobo: [1, 2, 3], bababo: 3 } };
var preUpdatePipeline = buildPipeline();
var Root = function (props) {
};
var helloBOne = "bone";
var ConsoleRoot = connect(function (state) { return { state: state.console }; })(Root);
exports["default"] = ConsoleRoot;
