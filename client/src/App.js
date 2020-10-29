import React, {Fragment, useEffect} from 'react';
import './App.css';
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Routes from "./components/routing/Routes";
import store from "./store";
import {Provider} from "react-redux";
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from "./actions/auth";

if (localStorage.getItem('token')) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar/>
          <Switch>
            <Route exact path="/" component={Landing}/>
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  )
};


export default App;
