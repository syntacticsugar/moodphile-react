
import React from 'react';
//var ReactD3 = require('react-d3-tooltip');
var Chart = require('react-d3-core').Chart;
//var D3TimeFormat = require("d3-time-format");
//var LineTooltip = require('react-d3-tooltip').LineTooltip;
var LineTooltip = require('react-d3-basic').LineChart;
var ScatterPlot = require('react-d3-basic').ScatterPlot;
console.log(Chart);
console.log(LineTooltip);
console.log(ScatterPlot);


var MoodDataViz = React.createClass({
  render : function() {
    var width = 900,
        height = 500,
        margins = {left: 100, right: 100, top: 20, bottom: 20},
        title = "User sample";
    // chart series,
    // field: is what field your data want to be selected
    // name: the name of the field that display in legend
    // color: what color is the line
    var moodChartSeries = [
      {
        field : "moodValue",
        name : "mood",
        color : "cadetblue",

      }
    ];

    // your x accessor
    //var x = function(d) {
    //  return d.index;
    //};

    //var formatTime = D3TimeFormat.timeFormat("%B %d, %Y");
    //var parseTime = D3TimeFormat.timeFormat("%B %d, %Y");

    //console.log("formatTime:");
    //console.log(formatTime);
    var x = function(d) {
      return (new Date(d.submitTime)).getTime();
      //return formatTime((new Date(d.submitTime)).getTime());
    };
    var moodChartData = Object.keys(this.props.moods).map ( function(key){
      return this.props.moods[key];
    }.bind(this));
    return (
      <div className="container">
        <ScatterPlot
          margins= {margins}
          title={title}
          //data={chartData}
          data={moodChartData}
          width={width}
          height={height}
          chartSeries={moodChartSeries}
          //chartSeries={chartSeries}
          x={x}
          xScale={'time'}
        />
      </div>
    )
  }
});

export default MoodDataViz;
