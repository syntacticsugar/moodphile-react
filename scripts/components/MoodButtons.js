import React from 'react';

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

export default MoodButtons;
