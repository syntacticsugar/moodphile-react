import React from 'react';
var h = require("../helpers");

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

export default MoodNucleus;
