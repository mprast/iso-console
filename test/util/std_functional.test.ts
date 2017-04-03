import * as stdf from "src/util/std_functional.ts";
import * as _ from "lodash";

// declare jest-imported globals so we
// don't get errors from typescript
declare let test: any;
declare let expect: any;
declare let describe: any;

describe("traverse", () => {
    const inputObject = {
        a1: 1,
        a2: 2,
        a_nested: {
            an1: "a",
            an2: "b",
        },
        b1: "hey",
        b2: 3,
        b_nested: {
            bn1: "c",
            b_double_nested: 33,
        },
    };

    test("path-based traversal works", () => {
        const transform = (traverse_children: any, head: any, path: any) => {
            if (path.startsWith("a")) {
                return "x";
            } else {
                return traverse_children(head);
            }
        };

        const expectedObject = {
            a1: "x",
            a2: "x",
            a_nested: "x",
            b1: "hey",
            b2: 3,
            b_nested: {
                bn1: "c",
                b_double_nested: 33,
            },
        };

        expect(stdf.traverse(transform, inputObject)).toEqual(expectedObject);
    });

    test("val-based traversal works", () => {
        const transform = (traverse_children: any, head: any, path: any) => {
            if (typeof head === "string") {
                return "x";
            } else {
                return traverse_children(head);
            }
        };

        const expectedObject = {
            a1: 1,
            a2: 2,
            a_nested: {
                an1: "x",
                an2: "x",
            },
            b1: "x",
            b2: 3,
            b_nested: {
                bn1: "x",
                b_double_nested: 33,
            },
        };

        expect(stdf.traverse(transform, inputObject)).toEqual(expectedObject);
    });

    test("can rewrite object tree on the fly", () => {
        const transform = (traverse_children: any, head: any, path: any) => {
            if (typeof head === "string") {
                return "x";
            } else if (path.endsWith("_nested")) {
                return traverse_children({thingOne: "this should get replaced", thingTwo: 2});
            } else {
                return traverse_children(head);
            }
        };

        const expectedObject = {
            a1: 1,
            a2: 2,
            a_nested: {
                thingOne:"x",
                thingTwo: 2,
            },
            b1: "x",
            b2: 3,
            b_nested: {
                thingOne:"x",
                thingTwo: 2,
            },
        };

        expect(stdf.traverse(transform, inputObject)).toEqual(expectedObject);
    });

    test("ignores functions", () => {
        const functionInput = {
            a1: 1,
            fun1: () =>  "I'm a function ",
            a2: "hey",
            nested: {
                a3: 123,
                fun2: () => "meToo",
            },
        };

        const expectedObject = {
            a1: 1,
            a2: "x",
            nested: {
                a3: 123,
            },
        };

        const transform = (traverse_children: any, head: any, path: any) => {
            if (typeof head === "string") {
                return "x";
            } else {
                return traverse_children(head);
            }
        };

        expect(stdf.traverse(transform, functionInput)).toEqual(expectedObject);
    });
});

describe("buildPipeline", () => {
    test("ties functions together", () => {
        const fA = (array: any) => {
            return _.concat(array, "A");
        };

        const fB = (array: any) => {
            return _.concat(array, "B");
        };

        const fC = (array: any) => {
            return _.concat(array, "C");
        };

        const init = () => {
            return [];
        };

        const pipeline = stdf.buildPipeline(init, [fA, fB, fC]);
        expect(pipeline()).toEqual(["A", "B", "C"]);
    });

    test("behaves correctly when passed only one function", () => {
        const fOne = (array: any) => {
            return _.concat(array, "Just One");
        };

        const pipeline = stdf.buildPipeline(fOne, []);

        expect(pipeline([])).toEqual(["Just One"]);
    });
});
