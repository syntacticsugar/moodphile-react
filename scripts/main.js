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
      <div className="form-horizontal">
        <div className="form-group">
          <label className="control-label" for="inputDefault">Name</label>
          <input type="text" className="form-control" id="inputDefault" placeholder="start typing..."/>
        </div>
        <div className="form-group">
          <label className="control-label" for="inputDefault">What are you doing?</label>
          <input type="text" className="form-control" id="inputDefault" placeholder="...like reading in bed"/>
        </div>
        <div className="form-group">
          <div className=''>
            <label className="control-label" for="inputDefault">Location?</label>
            <input type="text" className="form-control" id="inputDefault" placeholder="...like living room"/>
          </div>
        </div>
        <MoodButtons/>
      </div>
      <form className="form-vertical">
          <div className="form-group">
              <label for="name" className="col-xs-2 control-label">You</label>
              <div className="col-xs-10">
                  <input type="text" className="form-control col-sm-10" name="name" placeholder="name"/>
              </div>
          </div>

          <div className="form-group">
              <label for="birthday" className="col-xs-3 col-sm-2 control-label">Location</label>
              <div className="col-xs-4">
                  <input type="text" className="form-control" placeholder="bedroom"/>
              </div>
              <div className="col-xs-4">
                  <input type="text" className="form-control" placeholder="City/State"/>
              </div>
          </div>
      </form>
    </section>
  )
  }

});
var MoodNucleus = React.createClass({
  render : function() {
    return (
      <p></p>
    )
  }
})
var MoodButtons = React.createClass({
  render : function() {
    return (
      <div className="mood-pusher-wrapper">
        <div className="form-group">
          <label className="control-label" for="inputDefault">Mood? <span className="label-lowlight">(O is lowest, 11 is smashingly happy)</span></label>
          <p></p>

        {[0,1,2,3,4,5,6,7,8,9,10,11].map( function(x) {
            return <input className='btn mood' name='mood_on_button' type='submit' value={x} />;
        })}
        </div>
      </div>
    )
  }
});

ReactDOM.render(<App/>, document.querySelector('#main-moods'));
