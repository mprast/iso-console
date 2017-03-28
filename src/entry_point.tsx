import * as React from "react";
import { render } from "react-dom";
import { Route, Switch, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { ConnectedRouter, routerReducer, routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import { AppWrapper } from "src/app_wrapper.tsx";
// import { createConsolePipeline } from "src/console/redux/pipeline.ts";
// import { createAdminPipeline } from "src/admin/redux/pipeline.ts";

const history = createHistory();
const middleware = routerMiddleware(history);

const store = createStore(
    combineReducers({
        // admin: createAdminPipeline(),
        // console: createConsolePipeline(),
        router: routerReducer(),
    }),
    applyMiddleware(middleware),
);

// <Switch> renders the first route that matches
// (like a switch-case statement). we should
// render the 404 page if nothing matches.
render(<Provider store={store}>
           <ConnectedRouter history={history}>
               <AppWrapper>
                   <Switch>
                       <Route exact path="/(console)?" render={(props: any) => (
                           <div>
                               <em>This is a placeholder for the console component.</em>
                           </div>
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
