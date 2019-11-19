const nameMonth = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const namesOfDay = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const currentMonth = document.getElementsByClassName('current-month');
const nextMonth = document.getElementById('monthNext');
const previousMonth = document.getElementById('monthPrevious')
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
const numDates = document.getElementsByClassName('num-dates');
let storageUrlKey = 'storageKey';
let date = new Date();
let day = date.getDate();
let year = date.getFullYear();
let month = date.getMonth();
let storage = [];
monthDiv.innerHTML = nameMonth[month];
yearDiv.innerHTML = year;
dayNow.innerHTML = day;
yearNext.addEventListener('click', getNextYear);
yearPrevious.addEventListener('click', getPreviousYear);
btnAdd.addEventListener('click', createEvent);
nameDay.innerHTML = namesOfDay[date.getDay()];
nextMonth.addEventListener('click', nextMonth);
previousMonth.addEventListener('click', previousMonth)
showDayOfMonth(table, calendarAddition(getMonthCalendar(month + 1, year), month + 1, year));
initializeStorage();

function initializeStorage() {
    fetch(localStorage.getItem(storageUrlKey))
        .then(result => result.json())
        .then(result => {
            storage = result;
        });
}

function clear() {
    while (table.firstChild)
        table.removeChild(table.firstChild)
}

function transpose(array) {
    return array[0].map((col, i) => array.map(row => row[i]));
}

function createEvent() {
    const name = eventName.value;
    const time = timeEvent.value;
    const key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const data = { [key]: `${name}: ${time}` };
    storage.push(data);
    const dataToSend = JSON.stringify(storage);
    fetch("https://jsonstorage.net/api/items", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "post",
        body: dataToSend,
    })
        .then(result => result.json())
        .then(result => {
            localStorage.setItem(storageUrlKey, result.uri);
        });
}

function showDayOfMonth(table, calendar) {
    clear();
    let newCalendar = transpose(calendar);
    for (let i = 0; i < newCalendar.length; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < newCalendar[i].length; j++) {
            let td = document.createElement('td');
            td.innerHTML = newCalendar[i][j];
            td.onclick = () => {
                date = new Date(year, month, newCalendar[i][j]);
                nameDay.innerHTML = namesOfDay[date.getDay() - 1];
                dayNow.innerHTML = date.getDate();
                // console.log(storage);
            };
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}


function getPreviousYear() {
    year -= 1;
    yearDiv.innerHTML = year;
    showDayOfMonth(table, calendarAddition(getMonthCalendar(month + 1, year), month + 1, year))
}

function getNextYear() {
    year += 1;
    yearDiv.innerHTML = year;
    showDayOfMonth(table, calendarAddition(getMonthCalendar(month + 1, year), month + 1, year))
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
    const countOfDays = numberOfDays(month, year);
    const lastDayIndex = calendar.findIndex(element => element[element.length - 1] === countOfDays)
    let nextDay = 1;
    for (let i = lastDayIndex + 1; i <= 6; i++) {
        calendar[i].push(nextDay);
        nextDay++;
    }
    return calendar;
}