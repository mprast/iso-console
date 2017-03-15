import {buildTest} from "test/redux/value_objects/test_value_object";
import {ErrorsAsserter} from "test/helpers/assertion_helpers";

// declare jest-imported globals so we don't
// get errors from typescript
declare let test: any;
declare let expect: any;

let TEST_OBJ = {
    test1: "a test value",
    test2: true,
    testNested: {
        test1: 2,
        test2: 3,
    },
};

// can't test that properties are writable; that's handled
// by the typescript checker
test("object properties are all readable", () => {
    const testValueObj = buildTest(Object.assign({}, TEST_OBJ));
    const ea = new ErrorsAsserter();

    for(const prop of Object.getOwnPropertyNames(TEST_OBJ)) {
        if (!(prop in testValueObj)) {
            ea.push(`'${prop} in testValueObj' is false.`);
        } else if (testValueObj[prop] !== TEST_OBJ[prop]) {
            const msg = `'valueObject.${prop}' is ${testValueObj[prop]}, but ` +
                `'wrappedObject.${prop}' is ${TEST_OBJ[prop]}`;
            ea.push(msg);
        }
    }

    ea.assertNoErrors();
});

test("object properties are writable via test methods", () => {
    const testValueObj = buildTest(Object.assign({}, TEST_OBJ));
    const newVal: string = "an updated test value";

    testValueObj.setTest1(newVal);

    expect(testValueObj.test1).toBe(newVal);
});

test("default isValid? always returns true", () => {
    const testValueObj = buildTest(Object.assign({}, TEST_OBJ));
    expect(testValueObj.isValid()).toBe(true);
});

test("value objects can give back the wrapped object", () => {
    const testValueObj = buildTest(Object.assign({}, TEST_OBJ));
    expect(testValueObj.toJS()).toEqual(TEST_OBJ);
});

test("toJS() deeply clones the wrapped object before returning", () => {
    const testValueObj = buildTest(Object.assign({}, TEST_OBJ));
    expect(testValueObj.toJS() !== TEST_OBJ &&
           testValueObj.toJS().testNested !== TEST_OBJ.testNested).toBe(true);
});

test("getObject() should be inaccessible", () => {
    const testValueObj = buildTest(Object.assign({}, TEST_OBJ));
    expect(() => {
        testValueObj.getObj();
    }).toThrow();
});

// Mask<T, U> is enforced by the typescript compiler, so
// we can't write a unit test for it.
