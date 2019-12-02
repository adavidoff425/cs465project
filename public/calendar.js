let today = new Date();
let dateSelected = today;
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let yearSelected = document.getElementById("year");
let monthSelected = document.getElementById("month");

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

let monthAndYear = document.getElementById("monthAndYear");
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

function show(month, year) {
  //console.log(month + " " + year);
  let firstDay = new Date(year, month).getDay();
  let daysInMonth = 32 - new Date(year, month, 32).getDate();

  let body = document.getElementById("calendar-body");

  // make sure everything is empty
  body.innerHTML = "";

  //set the heading
  monthAndYear.innerHTML = months[month] + " " + year;

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
        let cell = document.createElement("div");
        cell.id = date;
        cell.onclick = function changeDateSelected() {
          dateSelected.setDate(event.srcElement.id);
          dateSelected.setMonth(monthSelected.value);
          dateSelected.setFullYear(yearSelected.value);
          show(currentMonth, currentYear);
        };

        cell.classList.add("calendar-col");
        cell.classList.add("date");
        let cellText = document.createTextNode(date);
        if (
          date === dateSelected.getDate() &&
          year === dateSelected.getFullYear() &&
          month === dateSelected.getMonth()
        ) {
          cell.classList.add("active");
        } // color today's date
        cell.appendChild(cellText);
        row.appendChild(cell);
        date++;
        rowNull = false;
      }
    }
    body.appendChild(row); // appending each row into calendar body.
  }

  //create the daily view
}
