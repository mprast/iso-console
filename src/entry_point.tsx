import * as React from "react";
import { render } from "react-dom";
import { Route, Switch, Link } from "react-router-dom";
import { createStore, combineReducers, applyMiddleware, Reducer, Action } from "redux";
import { Provider } from "react-redux";
import { ConnectedRouter, routerReducer, routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import { AppWrapper } from "src/app_wrapper";
import { buildPipeline } from "src/util/std_functional";
import { ConsoleRoot } from "src/console/components/console_root";
import { injectLayout } from "src/console/inject_layout";
import { IsoState, IsoConsoleState } from "src/redux/state_types";
import { Node, buildNode, NodeObject } from "src/redux/value_objects/node";
import { Graph, buildGraph } from "src/redux/value_objects/graph";

const history = createHistory();
const middleware = routerMiddleware(history);

const nodes: any = [
        {
            name: "testOne",
            isRoot: false,
            incidents: ["testTwo, testThree"],
            coords: {
                x: 0,
                y: 0,
            },
        },
        {
            name: "testTwo",
            isRoot: true,
            incidents: ["testThree"],
            coords: {
                x: 0,
                y: 0,
            },
        },
        {
            name: "testThree",
            incidents: ["testTwo"],
            isRoot: false,
            coords: {
                x: 0,
                y: 0,
            },
        },
        {
            name: "testFour",
            incidents: ["testOne"],
            isRoot: false,
            coords: {
                x: 0,
                y: 0,
            },
        },
];

const rg: Graph = buildGraph({
                                nodes: nodes.map((node: NodeObject) => buildNode(node)),
                                size: [400, 400],
                             });

const initState: IsoState = {
    console: {rootGraph: rg},
    admin: {},
    control: {},
    router: undefined,
};

// TODO(mprast): split this and console actions out into the console_root file
const consolePreUpdatePipeline = buildPipeline(injectLayout, []);

function applyAction(state: IsoState, action: any): IsoState {
    switch(action.type) {
        case "CHANGE_ROOT": {
            state.console.rootGraph.setRoot(action.nodeName);
            return state;
        }
        default: {
            return state;
        }
    }
}

const combinedReducer: Reducer<IsoState> =
    <A extends Action>(state: IsoState, action: A): IsoState => {
    // TODO(mprast): need to remove these when we change the pipeline to be immutable
    let finalState = Object.assign({}, applyAction(state, action));
    finalState.console = Object.assign({}, consolePreUpdatePipeline(finalState.console));
    finalState.router = routerReducer(finalState.router);
    return finalState;
};

const store = createStore(
    combinedReducer,
    initState,
    applyMiddleware(middleware),
);

// <Switch> renders the first route that matches
// (like a switch-case statement). we should
// render the 404 page if nothing matches.
render(<Provider store={store}>
           <ConnectedRouter history={history}>
               <AppWrapper dispatch={store.dispatch}>
                   <Switch>
                       <Route exact path="/(console)?" render={(props: any) => (
                           <ConsoleRoot/>
                       )}/>
                       <Route path="/admin" render={(props: any) => (
                           <div><em>This is a placeholder for the admin views.</em></div>
                       )}/>
                       <Route render={(props: any) => (
                           <div>
                               <em>You hit a route that doesn't exist!</em>
                           </div>
                       )}/>
                   </Switch>
               </AppWrapper>
           </ConnectedRouter>
       </Provider>, (document as any).getElementById("root"));
