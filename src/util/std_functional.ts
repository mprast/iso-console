import * as _ from "lodash";

export function traverse
    (transform:
        (traverse_children: (object: any) => any,
         head: any,
         path: String,
        ) => any,
     head: any,
     path= ""): any {
        // when we process children we want to call traverse()
        // again. the way we process the nodes should remain
        // the same.
        const recurse = (rhead: any, rpath: any) => traverse(transform, rhead, rpath);

        // lodash will expand weird things like strings into objects
        // so we need to add an extra typeguard here.
        let headNoFunctions = head;
        if (head instanceof Object) {
            headNoFunctions = _.pickBy(head, (value, key) => {
                return typeof value !== "function";
            });
        }

        // process this node and all its children. traverse_children
        // will take all the key-value pairs in the provided object
        // and pass both the value and the path down to traverse()
        // again. if the thing doesn't have children (i.e. it isn't
        // an object) just return it.
        return transform((thing: any) => {
            if (thing instanceof Object) {
                return _.mapValues(thing, (value, key) => {
                    let rPath;

                    if (path.length > 0) {
                        rPath = `${path}.${key}`;
                    } else {
                        rPath = key;
                    }

                    return recurse(value, rPath);
                });
            } else {
                return thing;
            }
        }, headNoFunctions, path);
    }
