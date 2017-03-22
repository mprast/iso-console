# Implementing ValueObject using typescript classes and a proxy
## Feature Motivation
ValueObjects needed to have custom methods (definable for each subclass) 
but also needed to expose every property of the wrapped object. Ideally we 
wanted to be able to treat a ValueObject as a POJO with custom methods, 
so if we have a value object defined as `let valueobj = buildValueObject({myProp: "myString"});`
instead of doing `console.log(valueobj.object.myProp);`
or something similar, we can do `console.log(valueobj.myProp)`. This seems like a 
small concern, but it matters on an object that may be used hundreds or even thousands 
of times in the app. The initial solution to allow direct property access as described 
above was to wrap the object in an ES6 Proxy.

## Reason for Deprecation
ES6 Proxies are a relatively new and specialized feature, and there are some unknowns 
as to the breadth and quality of support for them in the toolchain (for example, property 
access on proxies simply can't be done while debugging in node 6.X: 
https://github.com/node-inspector/node-inspector/issues/413). More importantly, we were 
able to solve the problem more simply by bind()-ing the functions we needed to a POJO 
and assigning them directly. The interface stays exactly the same.

## Possible Resurrection paths
It may make sense to resurrect this code if we'd like to make property access more 
complicated than a simple passthrough to the internal object. For example, we may want 
ValueObjects to function as interfaces to a global cache, in which case we'd want 
to hit the cache every time we try to access a property. For that a Proxy would be 
necessary.

## Dead Code
```
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
```
