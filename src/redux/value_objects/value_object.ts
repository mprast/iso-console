import * as _ from "lodash";

export class ValueObjectInternal<T extends {}>{
    // never assigned to; only exists to set up the type
    // of the value object.
    public objectType: T;

    protected object: T;

    constructor(contents: T) {
        this.object = contents;
    }

    public isValid(): boolean {
        // this should be computed based on this.object
        return true;
    }

    public toJS(): T {
        return _.cloneDeep(this.object);
    }

    // this method should _only_ be visible
    // to the proxy. we can terminate calls
    // to it within the proxy itself for
    // now.
    // TODO(mprast): When TypeScript supports
    // the type subtraction operator
    // (https://github.com/Microsoft/TypeScript/issues/12215)
    // actually remove this method from the type, so
    // ppl can't call it accidentally.
    public getObj() {
        return this.object;
    }

    // implement your own methods down here to
    // transform this.object
}

export type ValueObject<T extends ValueObjectInternal<any>> = T & T["objectType"];

export function addProxy<T extends ValueObjectInternal<any>>(internalObj: T) {
    return new Proxy(internalObj, {
        // in a nutshell - forward any properties not implemented on the
        // value object itself to the wrapped object. throw when someone
        // tries to access getObj, since that should only be visible to
        // the Proxy itself.
        get: (target, property, _receiver) => {
            if (property === "getObj") {
               throw new ReferenceError("Please don't access getObj() directly; " +
                   "it's only for internal use. You can access all the properties of " +
                   "the wrapped object directly on the ValueObject itself.");
            }

            if (property in target) {
                return target[property];
            }
            // ideally TypeScript should keep us from ever getting here, but
            // just in case...
            if (!(target.getObj().hasOwnProperty(property))) {
                const objectString = JSON.stringify(target.getObj());
                throw new ReferenceError(`Property ${property} was called on a value object, but it is ` +
                       `not implemented directly on the value object and ` +
                       `was not found in the wrapped value (${objectString}) when ` +
                       `searched for using hasOwnProperty().`);
            }
            return target.getObj()[property];
        },
        has: (target, property) => {
            return property in target || property in target.getObj();
        },
    }) as ValueObject<T>;
}

// this type lets you 'mask' a ValueObject by only making some
// of its methods accessible. you'll still be able to read
// any properties you want. using the type is a way of ensuring
// that you'll only change the value in a specific way in the
// method body.
export type Mask<T extends ValueObject<any>, U> = U & T["objectType"];
