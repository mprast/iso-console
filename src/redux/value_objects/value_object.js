"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValueObjectInternal {
    constructor(contents) {
        this.object = contents;
    }
    isValid() {
        // this should be computed based on this.object
        return true;
    }
    toJS() {
        return this.object;
    }
}
exports.ValueObjectInternal = ValueObjectInternal;
function addProxy(internalObj) {
    return new Proxy(internalObj, {
        // in a nutshell - forward any properties not implemented on the
        // value object itself to the wrapped object
        get: (target, property, _receiver) => {
            if (property in target) {
                return target[property];
            }
            // ideally TypeScript should keep us from ever getting here, but
            // just in case...
            if (!(target.hasOwnProperty(property))) {
                throw `Property ${property} not found in wrapped value of value object ${target}` +
                    ` when searched for using hasOwnProperty().`;
            }
            return target.object[property];
        },
    });
}
exports.addProxy = addProxy;
