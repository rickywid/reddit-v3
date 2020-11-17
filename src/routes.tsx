import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import Root from "./components/root";
import Dash from "./components/dash";
import Redirect from "./components/redirect";

const Routes = (
    <Switch>
        <Route exact path="/" component={Root} />
        <Route exact path="/dash" component={Dash} />
        <Route exact path="/redirect" component={({location, history}:any) => <Redirect location={location} history={history} />} />
    </Switch>
)

export default Routes;
