export class ValueObjectInternal<T extends {}>{
    public object: T;

    constructor(contents: T) {
        this.object = contents;
    }

    public isValid?(): boolean {
        // this should be computed based on this.object
        return true;
    }

    public toJS(): T {
        return this.object;
    }

    // implement your own methods down here to
    // transform this.object
}

export type ValueObject<T extends ValueObjectInternal<any>> = T & T["object"];

export function addProxy<T extends ValueObjectInternal<any>>(internalObj: T) {
    return new Proxy(internalObj, {
        // in a nutshell - forward any properties not implemented on the
        // value object itself to the wrapped object
        get: (target, property, _receiver) => {
            if (property in target) {
                return target[property];
            }
            // ideally TypeScript should keep us from ever getting here, but
            // just in case...
            if (!(target.object.hasOwnProperty(property))) {
                const objectString = JSON.stringify(target.object);
                throw new ReferenceError(`Property ${property} was called on a value object, but it is ` +
                       `not implemented directly on the value object and ` +
                       `was not found in the wrapped value (${objectString}) when ` +
                       `searched for using hasOwnProperty().`);
            }
            return target.object[property];
        },
        has: (target, property) => {
            return property in target || property in target.object;
        },
    }) as ValueObject<T>;
}

// this type lets you 'mask' a ValueObject by only making some
// of its methods accessible. you'll still be able to read
// any properties you want. using the type is a way of ensuring
// that you'll only change the value in a specific way in the
// method body.
export type Mask<T extends ValueObject<any>, U> = (T | U) & T["object"];
