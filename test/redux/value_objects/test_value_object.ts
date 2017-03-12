import {ValueObject, ValueObjectInternal, addProxy, Mask} from "src/redux/value_objects/value_object";

export function buildTest(obj: TestObj) {
    return addProxy(new TestInternal(obj));
}

export type Test = ValueObject<TestInternal>;

type TestObj = {
    test1: string,
    test2: boolean,
    testNested: {
        test1: number,
        test2: number,
    },
};

class TestInternal extends ValueObjectInternal<TestObj> {
    public setTest1(thing) {
        this.object.test1 = thing;
    }
}
