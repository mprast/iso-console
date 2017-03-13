import {buildTest} from "test/redux/value_objects/test_value_object";
import {ErrorsAsserter} from "test/helpers/assertion_helpers";

// declare jest-imported globals so we don't
// get errors from typescript
declare let test;

let TEST_OBJ = {
    test1: "a test value",
    test2: true,
    testNested: {
        test1: 2,
        test2: 3,
    },
};

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
