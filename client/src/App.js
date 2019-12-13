import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from "./components/Home";
import Service from './components/Service';
import Join from './components/Join';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/service">
          <Service />
        </Route>
        <Route path="/join">
          <Join />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
