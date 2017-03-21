import * as _ from "lodash";

export type ValueObject<T> = T & {isValid: () => boolean} & {objectType: T};

function isValid(): boolean {
    return true;
};

export function buildValueObject<T>(object: T): ValueObject<T> {
    (object as any).isValid = isValid.bind(object);
    return object as ValueObject<T>;
};

// this type lets you 'mask' a ValueObject by only making some
// of its methods accessible. you'll still be able to read
// any properties you want. using the type is a way of ensuring
// that you'll only change the value in a specific way in the
// method body. TODO: perhaps this makes more sense as a
// standard util type
export type Mask<T extends ValueObject<any>, U> = (T | U) & T["objectType"];
