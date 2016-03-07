import React from 'react';
import MoodNucleus from './MoodNucleus';

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

export default AllMoods;
