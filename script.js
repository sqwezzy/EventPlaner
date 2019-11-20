const nameMonth = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const namesOfDay = ['SUNDAY','MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
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
let globalYear = date.getFullYear();
let globalMonth = date.getMonth();
let storage = [];
monthDiv.innerHTML = nameMonth[globalMonth];
yearDiv.innerHTML = globalYear;
dayNow.innerHTML = day;
yearNext.addEventListener('click', getNextYear);
yearPrevious.addEventListener('click', getPreviousYear);
btnAdd.addEventListener('click', createEvent);
nameDay.innerHTML = namesOfDay[date.getDay()];
nextMonth.addEventListener('click', nextMonth);
previousMonth.addEventListener('click', previousMonth)
showDayOfMonth(table, calendarAddition(getMonthCalendar(globalMonth + 1, globalYear), globalMonth + 1, globalYear));
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

function getMonthBorders(calendar) {
    let beforeMonthIndex;
    let temp = 0;
    for (let i = 0; i < calendar[0].length; i++) {
        if (calendar[0][i] < temp) beforeMonthIndex = i - 1;
        temp = calendar[0][i];
    }

    temp = 0;
    let afterMonthIndex;
    for (let i = 0; i < calendar[calendar.length - 1].length; i++) {
        if (calendar[calendar.length - 1][i] < temp) {
            afterMonthIndex = i;
        }
        temp = calendar[calendar.length - 1][i];
    }

    return { beforeMonthIndex, afterMonthIndex };
}

function showDayOfMonth(table, calendar) {
    clear();
    let newCalendar = transpose(calendar);
    const { beforeMonthIndex, afterMonthIndex } = getMonthBorders(newCalendar);
    for (let i = 0; i < newCalendar.length; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < newCalendar[i].length; j++) {
            let td = document.createElement('td');
            let monthYear;
            if (i === 0 && (beforeMonthIndex || beforeMonthIndex === 0) && j <= beforeMonthIndex) {
                td.className = 'gray';
                monthYear = getPreviousMonth(globalMonth + 1, globalYear);
            }
            if (i === newCalendar.length - 1 && (afterMonthIndex || afterMonthIndex === 0) && j >= afterMonthIndex) {
                td.className = 'gray';
                monthYear = getNextMonth(globalMonth + 1, globalYear);
            }
            let isFirstWeek = i === 0;
            let isAfterMonth = isFirstWeek ? j > beforeMonthIndex : true;
            let isLastWeek = i === newCalendar.length - 1;
            let isBeforeMonth = isLastWeek ? j < afterMonthIndex : true;
            if (newCalendar[i][j] === date.getDate() && isAfterMonth && isBeforeMonth ) {
                td.className = 'active';
            }
            const today = new Date();
            if (today.getMonth() === globalMonth && today.getDate() === newCalendar[i][j] && today.getFullYear() === globalYear) {
                td.className = 'today'
            }
            td.innerHTML = newCalendar[i][j];
            td.onclick = () => {
                date = monthYear ? new Date(monthYear[1], monthYear[0] - 1, newCalendar[i][j]) : new Date(globalYear, globalMonth, newCalendar[i][j]);
                showDayOfMonth(table, calendarAddition(getMonthCalendar(date.getMonth() + 1, date.getFullYear()), date.getMonth() + 1, date.getFullYear()));
                nameDay.innerHTML = namesOfDay[date.getDay()];
                dayNow.innerHTML = date.getDate();
                // console.log(storage);
            };
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}


function getPreviousYear() {
    globalYear -= 1;
    yearDiv.innerHTML = globalYear;
    showDayOfMonth(table, calendarAddition(getMonthCalendar(globalMonth + 1, globalYear), globalMonth + 1, globalYear))
}

function getNextYear() {
    globalYear += 1;
    yearDiv.innerHTML = globalYear;
    showDayOfMonth(table, calendarAddition(getMonthCalendar(globalMonth + 1, globalYear), globalMonth + 1, globalYear))
}

function firstDateOfDay(numberOfDay, month, year) {
    const firstDayOfMonth = new Date(`${month}/1/${year}`).getDay();
    const result = 8 - (firstDayOfMonth - numberOfDay);
    console.log(result);
    return result % 7 === 0 ? 7 : result % 7;
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
            // console.log(date);
            calendar[i].push(date);
        }
    }
    // console.log(calendar)
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