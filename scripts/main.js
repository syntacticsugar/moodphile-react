var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

//var ReactD3 = require('react-d3-tooltip');
var Chart = require('react-d3-core').Chart;
//var LineTooltip = require('react-d3-tooltip').LineTooltip;
var LineTooltip = require('react-d3-basic').LineChart;
console.log(Chart);
console.log(LineTooltip);

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;

var createBrowserHistory = require("history/lib/createBrowserHistory");
var h = require("./helpers");

//Firebase
var Rebase = require("re-base"); // used for syncing
var Firebase = require("firebase"); // used for auth
var base = Rebase.createClass("https://moodphile.firebaseio.com/");
const firebaseAuthRef = new Firebase("https://moodphile.firebaseio.com/");

// something about 2-way binding, from 3:00 Bi-directional data flow
/*
  when user types something into input, we want to have our state update with
  that info.  I think this is called Bi-directional data flow.  React has something
  called Link-State or React-Link helpers to deal with it, but Wes says it's only
  top level, and you can't get deeper --- example while you can update the entire
  fish object in the top level state, you can't easily update fish.picture
  or fish.description etc, so he uses something called Catalyst which he
  found on github (https://github.com/tungd/react-catalyst) - the LinkedStateMixin
*/
var Catalyst = require("react-catalyst");

var App = React.createClass({
  mixins : [Catalyst.LinkedStateMixin],
  getInitialState : function() {
    return {
      loggedInWith : false,
      socialMediaDisplayName : '',
      uid: '',
      people : {},
      moods : {},
      latestMood : undefined,
      /* moodCurrentlyBeingEdited : {} */
    }
  },
  authenticate : function(provider) {
    console.log("Trying to auth with" + provider);
    firebaseAuthRef.authWithOAuthPopup(provider, this.postAuthInstructions);
  },
  logout() {
    firebaseAuthRef.unauth();
    localStorage.removeItem('token');
    this.setState({
      uid : null,
      loggedInWith : false,
    });
  },
  postAuthInstructions(err, authData) {
    if(err) {
      console.err(err);
      return;
    }
    //console.log("Hey, the provider you used is:" + provider);
    console.log("authData variable:");
    console.log(authData);
    var uid = authData.uid;
    // save the login token in the browser
    localStorage.setItem('token',authData.token);

    const moodsRef = firebaseAuthRef.child(uid + '/moods');
    moodsRef.on('value', (snapshot)=> {
      var data = snapshot.val() || {};
      // claim it as our own if there is no owner already
      if(!data.owner) {
        moodsRef.set({
          owner : uid,
        });
      }
      // update our state to reflect the current store owner and user
      this.setState({
        uid : uid,
        loggedInWith : authData.provider,
        socialMediaDisplayName : authData[authData.provider].displayName,
      });

    });
  },
  // we've attached <App/> to browser
  componentDidMount : function() {
    // now we setup syncing with Firebase
    console.log(base);
    base.syncState(this.state.uid + '/moods', {
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
  /*
  componentWillUpdate : function(propz,nextState) {
    console.log("componentWillUpdate: nextState: ");
    console.log(nextState);
    console.log("componentWillUpdate: propz: ");
    console.log(propz);

    localStorage.setItem("local-storage-moodphile", JSON.stringify(nextState));
  },
  */
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
      console.log('App props:');
      console.log(this.props);
      if (this.props.route.path === "/") {
        return (
          <div>
            <NavAndLogin />
            <LoginWithSocialMedia
              authenticate={this.authenticate}
              logout={this.logout}
              loggedInWith={this.state.loggedInWith}
              socialMediaDisplayName={this.state.socialMediaDisplayName}
              />
            {/*
            <LoginFake
              authenticate={this.authenticate}
              logout={this.logout}
              loggedInWith={this.state.loggedInWith} />
            */}
            <MasterMoodEntry addMoodToState={this.addMoodToState} />
            <SingleMoodOrErrorMessage moodDatum={this.state.latestMood} errorMessage="Moods will display here after you enter one."/>
            <AllMoods moodData={this.state.moods}  />
          </div>
        )
      } else if (this.props.route.path === "/moods") {
        return (
          <MoodDataViz />
        )
      } else {
        return <NotFound />
      }
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
          <form className="form-horizontal"
                ref="moodForm"
                onSubmit={this.createMood}
                autoComplete="off">
              <div className="row animated slideInLeft">
                <div className="form-group col-xs-8 col-md-6 col-lg-3">
                    <input type="text" className="form-control" ref="user" id="inputDefault" placeholder="start typing..."/>
                    <label className="control-label" htmlFor="inputDefault">Name</label>
                </div>
              </div>
              <div className="row animated slideInLeft">
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

              <div className="row animated slideInLeft">
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

              <button type="submit" className="btn btn-submit-mood animated slideInLeft">GO</button>
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
});

var MoodButtons= React.createClass({
  render : function() {
    var setMoodButtonValue = this.props.setMoodButtonValue;
    var currentMoodButtonValue = this.props.currentMoodButtonValue;
    return (
      <div className="row mood-pusher-wrapper animated slideInLeft">
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
                return (
                  <button
                    className={nouveauButtonClassName}
                    key={"poopieface"+x}
                    onClick={function(){setMoodButtonValue(x)}}
                    name='mood_on_button'
                    type='button'
                    value={x}
                  >
                  {x}
                  </button>);
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

var NavAndLogin = React.createClass({
  render : function() {
    return (
      <nav className="navbar navbar-inverse">
  	      <div className="container-fluid">
  	        <div className="navbar-header">
  	          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2">
  	            <span className="sr-only">Toggle navigation</span>
  	            <span className="icon-bar"></span>
  	            <span className="icon-bar"></span>
  	            <span className="icon-bar"></span>
  	          </button>
  	          <a className="navbar-brand" href="/"><img src="images/moodphile-logo-med.png" /></a>
  	        </div>

  	        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
  	          <ul className="nav navbar-nav">
  	            <li className="active"><a href="/">Post <span className="sr-only">(current)</span></a></li>
  	            <li><a href="/moods">Moods</a></li>
  	            <li><a href="#">Manage</a></li>
  	            <li><a href="#">Explore</a></li>
  	            <li className="dropdown">
  	              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Dropdown <span className="caret"></span></a>
  	              <ul className="dropdown-menu" role="menu">
  	                <li><a href="#">Action</a></li>
  	                <li><a href="#">Another action</a></li>
  	                <li><a href="#">Something else here</a></li>
  	                <li className="divider"></li>
  	                <li><a href="#">Separated link</a></li>
  	                <li className="divider"></li>
  	                <li><a href="#">One more separated link</a></li>
  	              </ul>
  	            </li>{/*<!-- /.dropdown --> */}
              </ul> {/*<!-- /.nav.navbar-nav --> */}
  	        </div>
  	      </div>
  	    </nav>
    )
  }
});

var LoginWithSocialMedia = React.createClass({
  render : function() {
    var loggedInWith = this.props.loggedInWith;
    var socialMediaDisplayName = this.props.socialMediaDisplayName;
    var authenticate = this.props.authenticate;
    function iconSpecificToSocial(loggedInWith) {
      return "fa fa-2x fa-" + loggedInWith;
    }

    if (!loggedInWith) {
      return (
        <div className="login-with-social-media">
          <p>Log in securely:</p>
          <ul>
            <li><a href="" onClick={function(e) {e.preventDefault(); authenticate('facebook')}}>
                    <i className="fa fa-facebook-square fa-2x"></i></a></li>
            <li><a href="" onClick={function(e) {e.preventDefault(); authenticate('github')}}>
                    <i className="fa fa-github fa-2x"></i></a></li>
            <li><a href="" onClick={function(e) {e.preventDefault(); authenticate('twitter')}}>
                    <i className="fa fa-twitter fa-2x"></i></a></li>
          </ul>
        </div>
      )
    } else {
      return (
        <div className="login-with-social-media">
          {socialMediaDisplayName}, you are logged in via <i className={iconSpecificToSocial(loggedInWith)}></i>{loggedInWith}
          <button className='btn'  onClick={this.props.logout}>Logout</button>
        </div>
      )
    }
  }
});

var LoginFake = React.createClass({
  render : function() {
    if (!true) {
      return (
        <div className="login-with-social-media">
          <p>Fakely log in:</p>
          <ul>
            <li><a href="" onClick={function(e) {e.preventDefault(); authenticate('facebook')}}><i className="fa fa-facebook-square fa-2x"></i></a></li>
            <li><a href="" onClick={function(e) {e.preventDefault(); authenticate('github')}}><i className="fa fa-github fa-2x"></i></a></li>
            <li><a href=""><i className="fa fa-twitter fa-2x"></i></a></li>
          </ul>
        </div>
      )
    } else {
      return (
        <div className="login-with-social-media">
          Success. <button className='btn' onClick={this.props.logout}>Logout</button>
        </div>
      )
    }
  }
});

var MoodDataViz = React.createClass({
  render : function() {
    var width = 700,
        height = 300,
        margins = {left: 100, right: 100, top: 20, bottom: 20},
        title = "User sample";
    // chart series,
    // field: is what field your data want to be selected
    // name: the name of the field that display in legend
    // color: what color is the line
    var chartSeries = [
      {
        field: 'BMI',
        name: 'BMI',
        color: 'deeppink'
      }
    ];
    // your x accessor
    var x = function(d) {
      return d.index;
    };
    var chartData =
    [
      {
        name: "Lavon Hilll I",
        BMI: 20.57,
        age: 12,
        birthday: "1994-10-26T00:00:00.000Z",
        city: "Annatown",
        married: true,
        index: 1
      },
      {
        name: "Jennifer Wilson",
        BMI: 20,
        age: 28,
        birthday: "1987-02-09T00:00:00.000Z",
        city: "West Virginia",
        married: false,
        index: 2
      },
      {
        name: "Clovis Pagac",
        BMI: 24.28,
        age: 26,
        birthday: "1995-11-10T00:00:00.000Z",
        city: "South Eldredtown",
        married: false,
        index: 3
      },
      {
        name: "Lucy Fong",
        BMI: 19.9,
        age: 26,
        birthday: "1989-08-09T00:00:00.000Z",
        city: "Brooklyn",
        married: false,
        index: 4
      },
      {
        name: "Gaylord Paucek",
        BMI: 24.41,
        age: 30,
        birthday: "1975-06-12T00:00:00.000Z",
        city: "Koeppchester",
        married: true,
        index: 5
      },
      {
        name: "Ashlynn Kuhn MD",
        BMI: 23.77,
        age: 32,
        birthday: "1985-08-09T00:00:00.000Z",
        city: "West Josiemouth",
        married: false,
        index: 6
      },
    ];
    return (
      <div className="container">
        <Chart
            title={title}
            width={width}
            height={height}
            margins= {margins}
        >
          <LineTooltip
          margins= {margins}
          title={title}
          data={chartData}
          width={width}
          height={height}
          chartSeries={chartSeries}
          x={x}
        />
        </Chart>
      </div>
    )
  }
});

var NotFound = React.createClass({
  render : function() {
    return (
      <div className="container">
        <h1>404 fo sho</h1>
      </div>
    )
  }
});

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={App}/>
    <Route path="/moods" component={App}/>
    <Route path="*" component={App}/>
  </Router>
);


ReactDOM.render(routes, document.querySelector('#main-moods'));
