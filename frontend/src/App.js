import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

// import logo from './logo.svg';
import './stylesheets/App.css';
import FormView from './components/FormView';
import MainView from './components/MainView';
import Header from './components/Header';
import VideoView from './components/VideoView';


class App extends Component {
  render() {
    return (
    <div className="App">
      <Header path />
      <Router>
        <Switch>
          <Route path="/" exact component={MainView} />
          <Route path="/add" component={FormView} />
          <Route path="/play" component={VideoView} />
          <Route component={MainView} />
        </Switch>
      </Router>
    </div>
  );

  }
}

export default App;
