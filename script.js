// const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const yearDiv = document.getElementById('year');
const yearNext = document.getElementById('yearNext');
const yearPrevious = document.getElementById('yearPrevious');
const dialog = document.querySelector('dialog');
const monthDiv = document.getElementById('month');
const table = document.getElementById('num-dates');
const dayNow = document.getElementById('dateDayNow');
const nameDay = document.getElementById('nameDay');
const eventList = document.getElementById('eventList');
const eventName = document.getElementById('eventName');
const timeEvent = document.getElementById('eventTime');
const btnAdd = document.getElementById('btnAdd');
const date = new Date();
let year = new Date().getFullYear();
let month = new Date().getMonth();
yearDiv.innerHTML = year;
dayNow.innerHTML = date.getDate();
yearNext.addEventListener('click', getNextYear);
yearPrevious.addEventListener('click', getPreviousYear);
btnAdd.addEventListener('click', addEvent);
const namesOfDay = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const numDates = document.getElementsByClassName('num-dates');
nameDay.innerHTML = namesOfDay[date.getDay()];
document.querySelector('#closeDialog').onclick = function() {
    dialog.close(); // Прячем диалоговое окно
}

gridCalendar(table, calendarAddition(getMonthCalendar(month + 1, year), month + 1, year));

window.onload = () => localStorage.clear();
function addEvent() {
    const name = eventName.value;
    const time = timeEvent.value;
    if (localStorage.getItem(name) === time){
        dialog.show();
    }
    if (name && time) {
        localStorage.setItem(name, time);
    }
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        let li = document.createElement('li');
        li.innerHTML += `${key} : ${value}<br/>`;
        eventList.appendChild(li);
    }
}

function gridCalendar(table, calendar) {
    for (let i = 0; i < calendar.length; i++) {
        let td = document.createElement('td')
        for (let j = 0; j < calendar[i].length; j++)
        {
            let tr = document.createElement('tr');
            tr.innerHTML = calendar[i][j];
            td.appendChild(tr)
        }
        table.appendChild(td)
    }
}


function getPreviousYear() {
    year -= 1;
    yearDiv.innerHTML = year;
    gridCalendar(table, calendarAddition(getMonthCalendar(month + 1, year), month + 1, year))
}

function getNextYear () {
    year += 1;
    yearDiv.innerHTML = year;
    gridCalendar(table, calendarAddition(getMonthCalendar(month + 1, year), month + 1, year))
}

function firstDateOfDay(numberOfDay, month, year) {
    const firstDayOfMonth = new Date(`${month}/1/${year}`).getDay();
    const result = 8 - (firstDayOfMonth - numberOfDay);
    return result > 7 ? result - 7 : result;
}

function numberOfDays(month, year) {
    return new Date(year, month, 0).getDate();
}

function getMonthCalendar(month, year) {
    const calendar = [];
    const countOfDays = numberOfDays(month, year);
    for (let i = 0; i < 7; i++) {
        calendar.push([]);
        for (let date = firstDateOfDay(i + 1, month, year); date <= countOfDays; date += 7) {
            calendar[i].push(date);
        }
    }
    return calendar;
}

function getPreviousMonth(month, year) {
    return month > 1 ? [month - 1, year] : [12, year - 1];
}

function getNextMonth(month, year) {
    return month < 12 ? [month + 1, year] : [1, year + 1];
}

 function calendarAddition(calendar, month, year) {
    const firstDayIndex = calendar.findIndex(element => element[0] === 1);
    const prevMonth = getPreviousMonth(month, year);
     let numberOfDaysInPreviousMonth = numberOfDays(prevMonth[0], prevMonth[1]);
     for (let i = firstDayIndex - 1; i >= 0; i--) {
        calendar[i].unshift(numberOfDaysInPreviousMonth);
        numberOfDaysInPreviousMonth--;
        }
     const countOfDays = numberOfDays(month,year);
     const lastDayIndex = calendar.findIndex(element => element[element.length - 1] === countOfDays)
     let nextDay = 1;
     for (let i = lastDayIndex + 1; i <= 6; i++) {
         calendar[i].push(nextDay);
         nextDay++;
     }
     return calendar;
}




