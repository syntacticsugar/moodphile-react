var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

//import { Router, Route } from 'react-router';
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;

import { createHistory } from 'history'; // it was exported as createHistory despite being named  createBrowserHistory, yes, it's strange!
//var createBrowserHistory = require("history/lib/createBrowserHistory");

import App from './components/App';
import NotFound from './components/NotFound';
//import MoodDataViz from './components/MoodDataViz';

var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={App}/>
    <Route path="/moods" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
);

ReactDOM.render(routes, document.querySelector('#main-moods'));
