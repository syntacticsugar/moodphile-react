var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

//import { Router, Route } from 'react-router';
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;

var Navigation = ReactRouter.Navigation;
import { createHistory } from 'history'; // it was exported as createHistory despite being named  createBrowserHistory, yes, it's strange!
//var createBrowserHistory = require("history/lib/createBrowserHistory");

import App from './components/App';
import NotFound from './components/NotFound';
import MoodDataViz from './components/MoodDataViz';


var OptionalFlags= React.createClass({
  render : function() {
    return(
      <br/>
    )
  }
});

var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={App}/>
    <Route path="/moods" component={MoodDataViz}/>
    <Route path="*" component={NotFound}/>
  </Router>
);


ReactDOM.render(routes, document.querySelector('#main-moods'));
