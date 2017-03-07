import {TypedRecord} from "typed-immutable-record";
import * as Immutable from "immutable";
///<reference path='./node_modules/immutable/dist/immutable.d.ts'/>

export interface IsoState {
    console: IsoConsoleState;
    admin: IsoAdminState;
}

// this takes out the boilerplate of declaring a new interface every
// time you want to define a type for an Immutable.js record. Now
// the type of your record is just ImmutableRecord<T>.
type ImmutableRecord<T> = IRecordWithoutType<T> & T;
interface IRecordWithoutType<T> extends TypedRecord<ImmutableRecord<T>> {
}

export interface IsoConsoleState {
    nodes: Immutable.List<{
        name: string,
        isRoot: boolean,
        incidents: Immutable.List<string>,
        coords: ImmutableRecord<{
            x: number,
            y: number,
        }>,
    }>;
}

export interface IsoAdminState {
    aMember: number;
}
