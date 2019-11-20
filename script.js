const nameMonth = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const namesOfDay = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
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
let storage = [];

monthDiv.innerHTML = nameMonth[date.getMonth()];
yearDiv.innerHTML = date.getFullYear();
dayNow.innerHTML = date.getDate();
nameDay.innerHTML = namesOfDay[date.getDay()];

yearNext.addEventListener('click', getNextYear);
yearPrevious.addEventListener('click', getPreviousYear);
btnAdd.addEventListener('click', createEvent);
nextMonth.addEventListener('click', showNextMonth);
previousMonth.addEventListener('click', showPreviousMonth)

showDayOfMonth(getFullMonthCalendar(date.getMonth() + 1, date.getFullYear()));
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
        if (calendar[0][i] < temp) {
            beforeMonthIndex = i - 1;
        }
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

function showDayOfMonth(calendar) {
    clear();
    let newCalendar = transpose(calendar);
    const { beforeMonthIndex, afterMonthIndex } = getMonthBorders(newCalendar);
    for (let i = 0; i < newCalendar.length; i++) {
        let tr = document.createElement('tr');
        const isFirstWeek = i === 0;
        const isLastWeek = i === newCalendar.length - 1;
        for (let j = 0; j < newCalendar[i].length; j++) {
            let td = document.createElement('td');
            const currentDate = newCalendar[i][j]

            let monthYear;
            if (isFirstWeek && (beforeMonthIndex || beforeMonthIndex === 0) && j <= beforeMonthIndex) {
                td.className = 'gray';
                monthYear = getPreviousMonth(date.getMonth() + 1, date.getFullYear());
            }

            if (isLastWeek && (afterMonthIndex || afterMonthIndex === 0) && j >= afterMonthIndex) {
                td.className = 'gray';
                monthYear = getNextMonth(date.getMonth() + 1, date.getFullYear());
            }

            let isAfterMonth = isFirstWeek ? j > beforeMonthIndex : true;
            let isBeforeMonth = isLastWeek ? j < afterMonthIndex : true;

            if (currentDate === date.getDate() && isAfterMonth && isBeforeMonth) {
                td.className = 'active';
            }

            const today = new Date();
            if (today.getMonth() === date.getMonth() && today.getDate() === currentDate && today.getFullYear() === date.getFullYear()) {
                td.className = 'today'
            }

            td.innerHTML = currentDate;
            td.onclick = () => {
                date = monthYear
                    ? new Date(monthYear.year, monthYear.month - 1, currentDate)
                    : new Date(date.getFullYear(), date.getMonth(), currentDate);
                showDayOfMonth(getFullMonthCalendar(date.getMonth() + 1, date.getFullYear()));
                nameDay.innerHTML = namesOfDay[date.getDay()];
                dayNow.innerHTML = date.getDate();
                monthDiv.innerHTML = nameMonth[date.getMonth()];
                // console.log(storage);
            };
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function getFullMonthCalendar(month, year) {
    return calendarAddition(getMonthCalendar(month, year), month, year);
}

function getPreviousYear() {
    date = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
    yearDiv.innerHTML = date.getFullYear();
    showDayOfMonth(getFullMonthCalendar(date.getMonth() + 1, date.getFullYear()), date.getMonth() + 1, date.getFullYear());
}

function getNextYear() {
    date = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate())
    yearDiv.innerHTML = date.getFullYear();
    showDayOfMonth(getFullMonthCalendar(date.getMonth() + 1, date.getFullYear()), date.getMonth() + 1, date.getFullYear());
}

function showNextMonth() {
    date = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())
    monthDiv.innerHTML = nameMonth[date.getMonth()];
    if (date.getMonth() === 0) yearDiv.innerHTML = date.getFullYear();
    showDayOfMonth(getFullMonthCalendar(date.getMonth() + 1, date.getFullYear()))
}

function showPreviousMonth() {
    date = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
    monthDiv.innerHTML = nameMonth[date.getMonth()];
    if (date.getMonth() === 11) yearDiv.innerHTML = date.getFullYear();
    showDayOfMonth(getFullMonthCalendar(date.getMonth() - 1, date.getFullYear()))
}

function firstDateOfDay(numberOfDay, month, year) {
    const firstDayOfMonth = new Date(`${month}/1/${year}`).getDay();
    const result = 8 - (firstDayOfMonth - numberOfDay);
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
            calendar[i].push(date);
        }
    }
    return calendar;
}

function getPreviousMonth(month, year) {
    return month > 1 ? { month: month - 1, year } : { month: 12, year: year - 1 };
}

function getNextMonth(month, year) {
    return month < 12 ? { month: month + 1, year } : { month: 1, year: year + 1 };
}

function calendarAddition(calendar, month, year) {
    const firstDayIndex = calendar.findIndex(element => element[0] === 1);

    const prevMonth = getPreviousMonth(month, year);
    let numberOfDaysInPreviousMonth = numberOfDays(prevMonth.month, prevMonth.year);
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