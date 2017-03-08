export interface IsoState {
    console: IsoConsoleState;
    admin: IsoAdminState;
}

export interface IsoConsoleState {
    nodes: Array<{
        name: string,
        isRoot: boolean,
        incidents: Array<string>,
        coords: {
            x: number,
            y: number,
        },
    }>;
}

export interface IsoAdminState {
    aMember: number;
}
