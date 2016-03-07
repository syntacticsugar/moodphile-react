import React from 'react';
import MoodButtons from './MoodButtons';

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

export default MasterMoodEntry;
