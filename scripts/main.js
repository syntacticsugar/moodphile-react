var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;

var createBrowserHistory = require("history/lib/createBrowserHistory");
var h = require("./helpers");

//Firebase
var Rebase = require("re-base");

var App = React.createClass({
  getInitialState : function() {
    return {
      people : {},
      moods : {}
    }
  },
  render : function() {
    return (
    <section className="post-mood-wrapper col-md-4">
      <div className="form-group">
        <label className="control-label" for="inputDefault">Name</label>
        <input type="text" className="form-control" id="inputDefault" placeholder="start typing..."/>
      </div>
      <div className="form-group">
        <label className="control-label" for="inputDefault">What are you doing?</label>
        <input type="text" className="form-control" id="inputDefault" placeholder="...like reading in bed"/>
      </div>
      <div className="form-group">
        <label className="control-label" for="inputDefault">Location?</label>
        <input type="text" className="form-control" id="inputDefault" placeholder="...like living room"/>
      </div>
      <div className="mood-pusher-wrapper">
        <MoodPusher/>
      </div>
    </section>
  )
  }

})

ReactDOM.render(<App/>, document.querySelector('#main-moods'));
