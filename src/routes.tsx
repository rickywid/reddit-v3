import React from "react";
import { Route, Switch } from "react-router-dom";
import Root from "./components/root";
import Dash from "./components/dash";
import Settings from "./components/settings";
import Redirect from "./components/redirect";

const Routes = (
    <Switch>
        <Route exact path="/" component={Root} />
        <Route path="/dash" component={Dash} />
        <Route exact path="/settings" component={Settings} />
        <Route path="/redirect" component={({location, history}:any) => <Redirect location={location} history={history} />} />
    </Switch>
)

export default Routes;
