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
var base = Rebase.createClass("https://moodphile.firebaseio.com/");

var App = React.createClass({
  getInitialState : function() {
    return {
      people : {},
      moods : {},
      latestMood : undefined,
      /* moodCurrentlyBeingEdited : {} */
    }
  },
  componentDidMount : function() {
    base.syncState("/", {
      context : this,
      state : 'moods'
    });
  },
  addMoodToState : function(mood) {
    var timestamp = (new Date()).getTime();
    // update the state object
    this.state.moods["mood-" + timestamp] = mood;
    // also, simultaneously replace latestMood //
    this.state.latestMood = mood;
    // set the state
    this.setState({
      moods : this.state.moods,
      latestMood : this.state.latestMood
    });

  },
  render : function() {
    return (
      <div>
        <MasterMoodEntry addMoodToState={this.addMoodToState} />
        <SingleMood moodProp={this.state.latestMood} />
      </div>
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
          submitTime: (new Date()),
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
    /* alert(mood.activity); */
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
                        <label htmlFor="location" className=" control-label">Location</label>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-4">
                        <input type="text" className="form-control" ref='locationLarger' placeholder="Brooklyn, New York"/>
                        <label htmlFor="city-state-country" className=" control-label">City/State</label>
                    </div>
                </div>
              </div>

              <MoodButtons setMoodValue={this.setMoodValue} />

              <button type="submit" className="btn btn-submit-mood">GO</button>
              <OptionalFlags />
          </form>


      </section>
    )
  }
})

var SingleMood = React.createClass({
  render : function() {
    if (this.props.moodProp) {
      return (<MoodNucleus moodProp={this.props.moodProp} />);
    } else {
      return (<p>Enter a mood above.</p>);
    }
  },
});

var MoodNucleus = React.createClass({
  render : function() {
    var details = this.props.moodProp;

    return (
      <div id="hexxx ">
        	<ul id="hexGrid">
	            <li className="hex">
	                <a className="hexIn" href="#">
	                    <div className="pseudo-img">
	                      <h1 className='hexa mood-value'>{details.moodValue}</h1>
                        <p>{h.prettyTime(details.submitTime)}</p>
	                      <p className="prettyDate">{h.prettyDate(details.submitTime)}</p>
                      </div>
	                </a>
	            </li>
              <li className="hex">
	                <a className="hexIn" href="#">
                    <img src="images/flickr-solo-walk-sepia.jpg" alt="" />
	                    <h1>This is a title</h1>
	                    {/*}<p>Gray cast, a gray film settles upon our eyes like a veil.*/}
	                    <p>{details.activity}</p>
	                </a>
	            </li>
              <li className="hex">
	                <a className="hexIn" href="#">
                    <img src="images/flickr-beach-maroon.jpg" alt="" />
	                    <h1>.</h1>
	                    <p className="hexagon-long-text">The pellucid curtains of tiny crystal are draped in layers. There's a fey allure to the
                        wings of the moth, as they incandesce and flicker under the lamplight.
                        Zephyrs, breathing like the sieves of an organ, respire for their rounded minute.</p>
	                </a>
	            </li>
          </ul>
      </div>
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
var OptionalFlags= React.createClass({
  render : function() {
    return(
      <div className="row">
          <div className="optional-flags-wrapper">
            <a className="btn btn-primary" role="button" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">More options</a>
            <div className="optional-fields collapse" id="collapseExample">
              <div className="row">
                <div className="form-group dual-location">
                    <div className="col-xs-2 col-sm-2 col-md-1">
                        <input type="text" className="form-control" ref='sleep' placeholder="hrs"/>
                        <label htmlFor="sleep" className=" control-label">Sleep</label>
                    </div>
                    <div className="col-xs-5 col-sm-6 col-md-4">
                        <input type="text" className="form-control" ref='medication' placeholder="separated by commas"/>
                        <label htmlFor="birthday" className=" control-label">Vitamins, medications, etc</label>
                    </div>

                    <div className="col-xs-3 col-sm-3 col-md-2">
                        <input type="text" className="form-control" ref='fitness' placeholder="steps taken"/>
                        <label htmlFor="Fitness" className=" control-label">Fitness (steps)</label>
                    </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-xs-12 col-md-8 col-lg-8" >
                    <input type="text" className="form-control" ref="specificEvent" id="inputDefault" placeholder="Just got news that..."/>
                    <label className="control-label" htmlFor="specificEvent">Specific event</label>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
});

ReactDOM.render(<App/>, document.querySelector('#main-moods'));
