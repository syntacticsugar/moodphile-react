import React from 'react';
import MoodNucleus from './MoodNucleus';

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

export default SingleMoodOrErrorMessage;
