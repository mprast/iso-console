"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const value_object_1 = require("src/redux/value_objects/value_object");
function buildNode(obj) {
    return value_object_1.addProxy(new NodeInternal(obj));
}
exports.buildNode = buildNode;
class NodeInternal extends value_object_1.ValueObjectInternal {
    setCoords(coords) {
        this.object.coords = coords;
    }
    addEdgesTo(target) {
        this.object.incidents.push(target.object.name);
    }
}
let bodeObj = {
    name: "heygrughnus",
    isRoot: false,
    incidents: [],
    coords: { x: 0, y: 0 },
};
let theTruthUnmasked = buildNode(bodeObj);
let theTruthMasked = theTruthUnmasked;
theTruthUnmasked.addEdgesTo(buildNode(bodeObj));
let bobus = theTruthMasked.setCoords({ x: 0, y: "hey gruhgonus how ya doin" });
