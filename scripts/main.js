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
  // we've attached <App/> to browser
  componentDidMount : function() {
    // now we setup syncing with Firebase
    console.log(base);
    base.syncState("/", {
      context : this,
      state : 'moods'
    });
    var myLocalStorageReference = localStorage.getItem("local-storage-moodphile");

    if (myLocalStorageReference) {
      // update our component state to reflect contents of localStorage
      // I take out the {} in this.setState because Nicky said it's already an object. I get it!
      this.setState( JSON.parse(myLocalStorageReference ));
    }
  },
  // AKA we're about to call "render"
  componentWillUpdate : function(propz,nextState) {
    console.log("componentWillUpdate: nextState: ");
    console.log(nextState);
    console.log("componentWillUpdate: propz: ");
    console.log(propz);

    localStorage.setItem("local-storage-moodphile", JSON.stringify(nextState));
  },
  addMoodToState : function(mood) {
    var timestamp = (new Date(mood.submitTime)).getTime();
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
  removeMoodFromState : function(key) {
    this.state.moods[key] = null;
    this.setState({ moods : this.state.moods })

  },
  render : function() {
    return (
      <div>
        <MasterMoodEntry addMoodToState={this.addMoodToState} />
        <SingleMoodOrErrorMessage moodDatum={this.state.latestMood} errorMessage="Moods will display here after you enter one."/>
        <AllMoods moodData={this.state.moods}  />
      </div>
    )
  }
});


var MasterMoodEntry = React.createClass({
  getInitialState : function() {
    return {
      moodButtonValue : undefined,
      showInvalidInputWarning : false,
      enteredText : "",
      activityIsFocused : false
    }
  },
  unFocusActivity: function(event) {
    this.setState({ activityIsFocused : false })
  },
  focusActivity: function(event) {
    this.setState({ activityIsFocused : true })
  },
  handleChange : function(event) {
    this.setState({ enteredText : event.target.value })
  },
  remainingCharacters : function() {
    if (this.state.activityIsFocused && this.state.enteredText.length>0)  {
      return 140 - this.state.enteredText.length;
    }
  },
  setMoodButtonValue : function(moodButtonValue) {
    this.state.moodButtonValue = moodButtonValue;
    this.setState({
      moodButtonValue : this.state.moodButtonValue,
      showInvalidInputWarning : false,
      enteredText : "",
    });
  },
  createMood : function(event) {
    // 1. stop the form from submitting
    event.preventDefault();
    // 2. take form data and create object
    console.log(this.refs);
    console.log(this.state);

    // user didn't pick a mood:
    if (this.state.moodButtonValue===undefined) {
      this.setState({ showInvalidInputWarning : true});
      console.log("Why you no give me some mooooodz!")
      return;
    }
    console.log("We have tested moodButtonValue===undefined.");

    var mood = {
          moodValue : this.state.moodButtonValue, // we don't have a ref for this value
          user : this.refs.user.value,
          activity : this.refs.activity.value,
          location : this.refs.location.value,
          locationLarger : this.refs.locationLarger.value,
          sleep : this.refs.sleep.value,
          medication : this.refs.medication.value,
          sunlight : this.refs.sunlight.value,
          specificEvent : this.refs.specificEvent.value,
          // submitTime is stringified to allow Firebase persistence
          submitTime: (new Date()).toString(),
        };
    console.log("mood is: " + mood);
    console.log("this.refs: " + this.refs);
    console.log("our props in: " + this.props);
    console.log("this: " + this);


    /* add Mood to our App state */
    this.props.addMoodToState(mood);

    /* clear moodForm after submit */
    this.refs.moodForm.reset();
    this.setState({
      showInvalidInputWarning : false,
      moodButtonValue: undefined,
      enteredText : "",
    });

    /* alert("mood object is: " + mood["moodValue"]); */
    /* alert(mood.activity); */
  },
  render : function() {
    return (
      <section className="main-mood-panel col-xs-12 col-md-12 col-lg-12">
          <form className="form-horizontal" ref="moodForm" onSubmit={this.createMood} autoComplete="off">
              <div className="row">
                <div className="form-group col-xs-8 col-md-6 col-lg-3">
                    <input type="text" className="form-control" ref="user" id="inputDefault" placeholder="start typing..."/>
                    <label className="control-label" htmlFor="inputDefault">Name</label>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-xs-12 col-md-8 col-lg-8" >
                    <input
                       type="text"
                       onFocus={this.focusActivity}
                       onBlur={this.unFocusActivity}
                       onChange={this.handleChange}
                       className="form-control"
                       ref="activity"
                       id="inputDefault"
                       placeholder="...like reading in bed"
                       autoComplete="off"
                    />
                    <label className="control-label" htmlFor="inputDefault">What are you doing?</label>
                    <span className="remaining-characters">{this.remainingCharacters()}</span>
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


              <MoodButtons currentMoodButtonValue={this.state.moodButtonValue} setMoodButtonValue={this.setMoodButtonValue} />
              <button type="submit" className="btn btn-submit-mood">GO</button>
              <span className={"invalid-input-"+ (this.state.showInvalidInputWarning ? 'show' : 'hide')}>
                Don't be shy, pick a mood.
              </span>

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
                                <input type="text" className="form-control" ref='sunlight' placeholder="minutes"/>
                                <label htmlFor="sunlight" className=" control-label">sunlight</label>
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
          </form>


      </section>
    )
  }
})

var SingleMoodOrErrorMessage = React.createClass({
  render : function() {
    var moodDatumExists = this.props.moodDatum;
    var errorMessage = this.props.errorMessage ? this.props.errorMessage : 'Missing mood, no error message provided';
    if (moodDatumExists) {
      return (<MoodNucleus moodDatum={this.props.moodDatum} />);
    } else {
      return (<p>{errorMessage}</p>);
    }
  },
});

var MoodNucleus = React.createClass({
  render : function() {
    var details = this.props.moodDatum;
    // wherein we UNstringify submitTime so our helper methods actually work
    var rawSubmitTime = new Date(details.submitTime);

    return (
      <div id="hexxx ">
        	<ul id="hexGrid">
	            <li className="hex">
	                <a className="hexIn" href="#">
	                    <div className="pseudo-img teal">
	                      <h1 className='hexa mood-value'>{details.moodValue}</h1>
                        <p className="pretty-time">{h.prettyTime(rawSubmitTime)}</p>
	                      <p className="prettyDate">{h.prettyDate(rawSubmitTime)}</p>
                      </div>
	                </a>
	            </li>
              <li className="hex">
	                <a className="hexIn" href="#">
                    <img src="images/flickr-solo-walk-sepia.jpg" alt="" />
	                    {/*<h1>This is a title</h1> */}
	                    {/*}<p>Gray cast, a gray film settles upon our eyes like a veil.*/}
	                    <p className="hex-activity">{details.activity}</p>
	                </a>
	            </li>
              <li className="hex">
	                <a className="hexIn" href="#">
                    <img src="images/flickr-beach-maroon.jpg" alt="" />
                      {/*<h1>.</h1> */}
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
    var setMoodButtonValue = this.props.setMoodButtonValue;
    var currentMoodButtonValue = this.props.currentMoodButtonValue;
    return (
      <div className="row mood-pusher-wrapper">
        <div className="form-group col-xs-12 col-sm-8 col-md-8 col-lg-6">
          <dt>Mood? <span className="label-lowlight">(O is lowest, 11 is smashingly happy)</span></dt>

          <div id="all-mood-buttons" className="btn-group-lg">
            {[0,1,2,3,4,5,6,7,8,9,10,11].map( function(x) {
              var nouveauButtonClassName;
              if (currentMoodButtonValue === x) {
                nouveauButtonClassName = "nouveau nouveau-force-focus"
              }else {
                nouveauButtonClassName = "nouveau"
              }
                return <button className={nouveauButtonClassName} key={"poopieface"+x} onClick={function(){setMoodButtonValue(x)}} name='mood_on_button' type='button' value={x} >{x}</button>;
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
      <br/>
    )
  }
});
var AllMoods = React.createClass({
  renderMood : function(key) {
    return (
        <MoodNucleus key={key} index={key} moodDatum={this.props.moodData[key]} />
    )
  },
  render : function() {
    return (
      <div>
        <div className="list-of-moods">
          {Object.keys(this.props.moodData).reverse().map(this.renderMood)}
        </div>

      </div>

    )
  }
});

ReactDOM.render(<App/>, document.querySelector('#main-moods'));
