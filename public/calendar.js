let today = new Date();
let dateSelected = today;
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let yearSelected = document.getElementById("year");
let monthSelected = document.getElementById("month");
let body = document.getElementById("calendar-body"); // moved body to global variable
let colorCount = 0;

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

let monthAndYear = document.getElementById("month-and-year");
let dailyViewDate = document.getElementById("daily-view-date");
show(currentMonth, currentYear);

//go to next month
function next() {
  if (currentMonth === 11) {
    currentYear += 1;
  }
  currentMonth = (currentMonth + 1) % 12;
  show(currentMonth, currentYear);
}

//go to current selected day
function base() {
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  show(currentMonth, currentYear);
}

function changeDateSelected() {
  alert(event.srcElement.value);
}

//help with negative mod
//https://www.geeksforgeeks.org/how-to-get-negative-result-using-modulo-operator-in-javascript/
Number.prototype.mod = function(a) {
  return ((this % a) + a) % a;
};

//redo
function previous() {
  if (currentMonth === 0) {
    currentYear -= 1;
  }
  currentMonth = (currentMonth - 1).mod(12);
  show(currentMonth, currentYear);
}

//redo
function jump() {
  currentYear = parseInt(yearSelected.value);
  currentMonth = parseInt(monthSelected.value);
  show(currentMonth, currentYear);
}

var json =
  '{ "type": "FeatureCollection", "features": [ { "geometry": { "type": "Point", "coordinates": "[-122.6810424, 45.509023]" }, "type": "Feature", "properties": { "category": "school", "time": "8am - 10am", "description": "CS4/565", "name": "Full Stack Web Development", "date": "9/30/19-12/6/19", "placeid": "01", "username": "alexdavidoff" } } ] }';
var obj = JSON.parse(json);

var features = obj.features[0];
console.log(obj.length);

function show(month, year) {
  //console.log(month + " " + year);
  let firstDay = new Date(year, month).getDay();
  let daysInMonth = 32 - new Date(year, month, 32).getDate();

  let body = document.getElementById("calendar-body");

  // make sure everything is empty
  body.innerHTML = " ";

  //set the heading of calendar
  monthAndYear.innerHTML = months[month] + " " + year;

  //set the heading of the daily view
  dailyViewDate.innerHTML =
    dateSelected.getDate() +
    " " +
    months[dateSelected.getMonth()] +
    " " +
    dateSelected.getFullYear();

  yearSelected.value = year;
  monthSelected.value = month;

  // creating all cells
  let date = 1;
  for (let i = 0; i < 6; i++) {
    // creates a table row
    let row = document.createElement("div");
    row.classList.add("calendar-row");
    let rowNull = true;

    //let j = rows
    for (let j = 0; j < 7; j++) {
      //let i = columns
      if ((i === 0 && j < firstDay) || date > daysInMonth) {
        //fill the empty days
        let cell = document.createElement("div");
        cell.classList.add("calendar-col");
        //make the last row if empty appear
        //empty
        if (rowNull && i !== 0) {
          cell.id = "empty";
        } else {
          cell.id = "fill";
        }
        let cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else {
        //actual date
        let cell = document.createElement("div");
        cell.id = date;
        //on click set the selected date to this date
        cell.onclick = function changeDateSelected() {
          dateSelected.setDate(event.srcElement.id);
          dateSelected.setMonth(monthSelected.value);
          dateSelected.setFullYear(yearSelected.value);
          show(currentMonth, currentYear);
        };

        //add classes for cell
        cell.classList.add("calendar-col");
        cell.classList.add("date");

        //create text for cell
        let cellText = document.createTextNode(date);

        //split up the date cell
        let numberCell = document.createElement("div");
        numberCell.id = date;
        numberCell.classList.add("calendar-cell-date");
        //add the same onclick function for inner divs
        numberCell.onclick = function changeDateSelected() {
          dateSelected.setDate(event.srcElement.id);
          dateSelected.setMonth(monthSelected.value);
          dateSelected.setFullYear(yearSelected.value);
          show(currentMonth, currentYear);
        };
        let iconCell = document.createElement("div");
        iconCell.id = date;
        iconCell.classList.add("calendar-cell-icon");
        //add the same onclick function for inner divs
        iconCell.onclick = function changeDateSelected() {
          dateSelected.setDate(event.srcElement.id);
          dateSelected.setMonth(monthSelected.value);
          dateSelected.setFullYear(yearSelected.value);
          show(currentMonth, currentYear);
        };
        numberCell.appendChild(cellText);
        cell.appendChild(iconCell);
        cell.appendChild(numberCell);

        let icon = document.createElement("div");
        icon.classList.add("calendar-date-icon");
        iconCell.appendChild(icon);

        if (
          date === dateSelected.getDate() &&
          year === dateSelected.getFullYear() &&
          month === dateSelected.getMonth()
        ) {
          cell.classList.add("active");
        } // color today's date
        row.appendChild(cell);
        date++;
        rowNull = false;
      }
    }
    body.appendChild(row); // appending each row into calendar body.
  }
  //show the events
  showEvent("work", 8, 16);
}

// getter to use calendar body in other script
function showEvent(eventName, startTime, endTime) {
  Number.prototype.mod = function(a) {
    return ((this % a) + a) % a;
  };

  var eventColors = [
    "rgb(255,179,186)",
    "rgb(255,223,186)",
    "rgb(255,255,186)",
    "rgb(186,255,201)",
    "rgb(186,225,255)",
    "rgb(227,198,240)"
  ];
  //grab the grid
  var dailyViewGrid = document.getElementById("daily-view-grid");
  //create div for event
  var event = document.createElement("div");
  //add class for div
  event.classList.add("event");
  //create text node for event
  var eventText = document.createTextNode(eventName + " " + colorCount);
  //add text to event
  event.appendChild(eventText);

  //cycle the color
  colorCount = (colorCount + 1).mod(eventColors.length);
  //set color
  event.style.background = eventColors[colorCount];
  event.style.opacity = 0.7;
  //set span times
  startSpan = ++startTime * 2 + 1;
  endSpan = ++endTime * 2 + 1;
  event.style.gridArea = startSpan + " / 1 / " + endSpan + " / 2";
  //append to daily-grid
  dailyViewGrid.appendChild(event);
}
