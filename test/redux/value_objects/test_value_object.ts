import {ValueObject, buildValueObject} from "src/redux/value_objects/value_object";

function setTest1(thing: string): void {
    this.test1 = thing;
}

export function buildTest(object: TestObject) {
    const newObject: any = buildValueObject(object);
    newObject.setTest1 = setTest1.bind(object);
    return newObject as Test;
}

export type Test = ValueObject<TestObject> & {setTest1: (thing: string) => void};

type TestObject = {
    test1: string,
    test2: boolean,
    testNested: {
        test1: number,
        test2: number,
    },
};
