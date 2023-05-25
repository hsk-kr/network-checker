import React from 'react';
import './styles.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../redux';
import Navbar from '../Navbar';
import Home from '../Home';
import Service from '../Service';
import Join from '../Join';
import MyProfile from '../MyProfile';
import UserInfo from '../UserInfo';

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
