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
      moods : {},
      moodCurrentlyBeingEdited : {}
    }
  },
  addMoodToState : function(mood) {
    var timestamp = (new Date()).getTime();
    // update the state object
    this.state.moods["mood-" + timestamp] = mood;
    // set the state
    this.setState({ moods : this.state.moods});

  },
  render : function() {
    return (
      <MasterMoodEntry addMoodToState={this.addMoodToState} />
    )
  }
});


var MasterMoodEntry = React.createClass({
  getInitialState : function() {
    return {
      moodValue : undefined
    }

  },
  setMoodValue : function(moodValue) {
    this.state.moodValue = moodValue;
    this.setState({ moodValue : this.state.moodValue});
  },
  createMood : function(event) {
    // 1. stop the form from submitting
    event.preventDefault();
    // 2. take form data and create object
    console.log(this.refs);
    console.log(this.state);
    var mood = {
          /* moodValue : this.refs.moodValue.value, */
          moodValue : this.state.moodValue,
          user : this.refs.user.value,
          activity : this.refs.activity.value,
          location : this.refs.location.value,
          locationLarger : this.refs.locationLarger.value,
        };
    console.log("mood is: " + mood);
    console.log("this.refs: " + this.refs);
    console.log("our props in: " + this.props);
    console.log("this: " + this);


    /* add Mood to our App state */
    this.props.addMoodToState(mood);

    /* clear moodForm after submit */
    this.refs.moodForm.reset();

    /* alert("mood object is: " + mood["moodValue"]); */
    alert(mood.moodValue);
  },
  render : function() {
    return (
      <section className="main-mood-panel col-xs-12 col-md-12 col-lg-12">
          <form className="form-horizontal" ref="moodForm" onSubmit={this.createMood}>
              <div className="row">
                <div className="form-group col-xs-8 col-md-6 col-lg-3">
                    <input type="text" className="form-control" ref="user" id="inputDefault" placeholder="start typing..."/>
                    <label className="control-label" htmlFor="inputDefault">Name</label>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-xs-12 col-md-8 col-lg-8" >
                    <input type="text" className="form-control" ref="activity" id="inputDefault" placeholder="...like reading in bed"/>
                    <label className="control-label" htmlFor="inputDefault">What are you doing?</label>
                </div>
              </div>

              <div className="row">
                <div className="form-group dual-location">
                    <div className="col-xs-6 col-sm-6 col-md-4">
                        <input type="text" className="form-control" ref='location' placeholder="bedroom"/>
                        <label htmlFor="birthday" className=" control-label">Location</label>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-4">
                        <input type="text" className="form-control" ref='locationLarger' placeholder="Brooklyn, New York"/>
                        <label htmlhtmlFor="city-state-country" className=" control-label">City/State</label>
                    </div>
                </div>
              </div>

              <MoodButtons setMoodValue={this.setMoodValue} />

              <button type="submit" className="btn btn-default btn-lg">GO</button>
          </form>


      </section>
    )
  }
})


var MoodNucleus = React.createClass({
  render : function() {
    return (
      <p></p>
    )
  }
})
var MoodButtons= React.createClass({
  render : function() {
    var setMoodValue = this.props.setMoodValue;
    return (
      <div className="row mood-pusher-wrapper">
        <div className="form-group col-xs-12 col-sm-8 col-md-8 col-lg-6">
          <dt>Mood? <span className="label-lowlight">(O is lowest, 11 is smashingly happy)</span></dt>

          <div className="btn-group btn-group-lg">
            {[0,1,2,3,4,5,6,7,8,9,10,11].map( function(x) {
                return <button className='nouveau' key={"poopieface"+x} onClick={function(){setMoodValue(x)}} name='mood_on_button' type='button' value={x} >{x}</button>;
            })}
          </div>
        </div>
      </div>
    )
  }
});

ReactDOM.render(<App/>, document.querySelector('#main-moods'));
