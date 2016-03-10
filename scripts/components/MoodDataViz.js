
import React from 'react';
//var ReactD3 = require('react-d3-tooltip');
var Chart = require('react-d3-core').Chart;
//var LineTooltip = require('react-d3-tooltip').LineTooltip;
var LineTooltip = require('react-d3-basic').LineChart;
console.log(Chart);
console.log(LineTooltip);


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
    var chartSeries = [
      {
        field: 'BMI',
        name: 'BMI kthnxbye',
        color: 'deeppink'
      }
    ];
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
    var x = function(d) {
      return (new Date(d.submitTime)).getTime();
    };
    var moodChartData = Object.keys(this.props.moods).map ( function(key){
      return this.props.moods[key];
    }.bind(this));
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

        <LineTooltip
          margins= {margins}
          title={title}
          //data={chartData}
          data={moodChartData}
          width={width}
          height={height}
          chartSeries={moodChartSeries}
          //chartSeries={chartSeries}
          x={x}
        />
      </div>
    )
  }
});

export default MoodDataViz;
