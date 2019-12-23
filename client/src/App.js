import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './redux';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Navbar from './containers/Navbar';
import Home from "./containers/Home";
import Service from './containers/Service';
import Join from './components/Join';
import MyProfile from './components/MyProfile';
import UserInfo from './containers/UserInfo';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <UserInfo />
        <Navbar />
        <Switch>
          <Route path="/service">
            <Service />
          </Route>
          <Route path="/join">
            <Join />
          </Route>
          <Route path="/myprofile">
            <MyProfile />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
