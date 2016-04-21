let helpers =  {
   months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
   ,weekdays : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
   ,prettyDate : function(d) {
     var prettyMonth = this.months[d.getMonth()];
     var prettyWeekday = this.weekdays[d.getDay()];
     var prettyYear = d.getFullYear();
     var prettyDate = d.getDate();

     return prettyMonth + " " + prettyDate + ", " + prettyYear;
   }
   ,prettyTime : function(d) {
     var hour = parseInt(d.getHours());
     var minutes = d.getMinutes();
     var suffix = "am";
     if (hour >= 12) {
       suffix = "pm";
       hour -= 12;
     }
     if (minutes<10) {
       minutes = "0" + minutes;
     }
     return hour + ":" + minutes + suffix;
   }
   ,rando : function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
   ,slugify : function(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

}

export default helpers;
