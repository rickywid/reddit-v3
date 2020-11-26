import React from "react";
import { Route, Switch } from "react-router-dom";
import Root from "./components/root";
import Settings from "./components/settings";

const Routes = (
    <Switch>
        <Route exact path="/" component={Root} />
        <Route exact path="/settings" component={Settings} />
    </Switch>
)

export default Routes;
