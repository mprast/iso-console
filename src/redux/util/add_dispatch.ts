import * as React from "react";

// React needs to know what exactly uou want from the
// context before it'll put it on this.context. We
// add the dispatch function to our React Context all
// the way up in AppWrapper (this is hacky as we're
// overloading that component; if it gets much bigger
// we should split the dispatch stuff out)
export const addDispatch = (componentClass: any) => {
    componentClass.contextTypes = {
        dispatch: React.PropTypes.func,
    };
};
