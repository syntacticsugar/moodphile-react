var React = require('react');
var Rebase = require("re-base"); // used for syncing
var Firebase = require("firebase"); // used for auth

// chunked components:
import NotFound from './NotFound';
import MasterMoodEntry from './MasterMoodEntry';
import SingleMoodOrErrorMessage from './SingleMoodOrErrorMessage';
import NavAndLogin from './NavAndLogin';
import LoginWithSocialMedia from './LoginWithSocialMedia';
import AllMoods from './AllMoods';
import MoodDataViz from './MoodDataViz';

//Firebase setup
var base = Rebase.createClass("https://moodphile.firebaseio.com/");
const firebaseAuthRef = new Firebase("https://moodphile.firebaseio.com/");

var App = React.createClass({
  getInitialState : function() {
    return {
      loggedIn: null,
      /*
      loggedIn: {
        provider: ''
        socialMediaDisplayName : '',
        uid: '',
        rebase: [],
      }
      */
      //loggedInWith : false,
      //socialMediaDisplayName : '',
      //uid: null,
      //people : {},
      moods : {},
      latestMood : null,
      /* moodcurrentlybeingedited : {} */
    }
  },

  authenticate : function(provider) {
    console.log("trying to auth with" + provider);
    firebaseAuthRef.authWithOAuthPopup(provider, this.postAuthInstructions);
  },

  logout() {
    firebaseAuthRef.unauth();
    localStorage.removeItem('token');
    for (var i in this.state.loggedIn.rebase) {
      base.removeBinding(this.state.loggedIn.rebase[i]);
    }
    this.setState({ loggedIn : null, moods: {}, latestMood: null });
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

    const moodsRef = firebaseAuthRef.child('users/' + uid + '/moods');
    moodsRef.on('value', (snapshot)=> {
      var data = snapshot.val() || {};
      // claim it as our own if there is no owner already
      if(!data.owner) {
        moodsRef.set({
          owner : uid,
        });
      }
      if (!this.state.loggedIn) {
        // get existing moods (for un-authenticated user, so we can add them to moods for their account
        var preLoginMoods = this.state.moods;

        console.log('about to setup sync sync state:');
        console.log('path = users/' + uid + '/moods');
        var syncMoods = base.syncState('users/' + uid + '/moods', {
          context : this,
          state : 'moods'
        });
        console.log(syncMoods);

        var moods = this.state.moods;
        // copy preLoginMoods into new (authenticated) moods (this might overwrite mood, but it's unlikely)
        for (var k in preLoginMoods) {
          moods[k] = preLoginMoods[k];
        }
        // update our state to reflect the current store owner and user
        this.setState({
          moods: moods,
          loggedIn: {
            uid : uid,
            provider : authData.provider,
            socialMediaDisplayName : authData[authData.provider].displayName,
            rebase: [syncMoods],
          }
        });
      }


    });
  },

  // we've attached <App/> to browser
  componentDidMount : function() {
    // now we setup syncing with Firebase
    console.log('componentDidMount:');
    console.log(base);
    // if we sync before authentication, all moods will get synced
    // with uid = null

    /*
    var firebaseElements = base.syncState('users/' + this.state.uid + '/moods', {
      context : this,
      state : 'moods'
    });
    console.log(firebaseElements);
    */

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
              loggedInWith={this.state.loggedIn ? this.state.loggedIn.provider : null}
              socialMediaDisplayName={this.state.loggedIn ? this.state.loggedIn.socialMediaDisplayName : null}
              />
            <MasterMoodEntry
              addMoodToState={this.addMoodToState}
              loggedIn={this.state.loggedIn}
              socialMediaDisplayName={this.state.loggedIn ? this.state.loggedIn.socialMediaDisplayName : null}
            />
            <SingleMoodOrErrorMessage moodDatum={this.state.latestMood} errorMessage="Moods will display here after you enter one."/>
            <AllMoods moodData={this.state.moods}  />
          </div>
        )
      } else if (this.props.route.path === "/moods") {
        return (
          <div>
            <NavAndLogin />
            <MoodDataViz moods={this.state.moods}/>
          </div>
        )
      } else {
        return <NotFound />
      }
  }

});

export default App;
