// ORIGINAL: Obsidian plugin 'Calendar' by Liam Cain
// Uses 'Moment.js' which is available as npm package, I would like to implement it as vanilla

// function getDaysOfWeek(..._args) {
//     return window.moment.weekdaysShort(true);
// }
// function isWeekend(date) {
//     return date.isoWeekday() === 6 || date.isoWeekday() === 7;
// }
// function getStartOfWeek(days) {
//     return days[0].weekday(0);
// }

// function getMonth(displayedMonth, ..._args) {
//     const locale = window.moment().locale();
//     const month = [];
//     let week;
//     const startOfMonth = displayedMonth.clone().locale(locale).date(1);
//     const startOffset = startOfMonth.weekday();
//     let date = startOfMonth.clone().subtract(startOffset, "days");
//     for (let _day = 0; _day < 42; _day++) {
//         if (_day % 7 === 0) {
//             week = {
//                 days: [],
//                 weekNum: date.week(),
//             };
//             month.push(week);
//         }
//         week.days.push(date);
//         date = date.clone().add(1, "days");
//     }
//     return month;
// }

function createCalendar() {
    const calendarColumns = 8  // Week number + 7 days
    const daysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    // Get the current day
    const date = getDate()

    const calendarContainer = document.createElement('div')
    calendarContainer.className = 'calendar-container'

    // Navigation
    const calendarNavContainer = document.createElement('div')
    const titleContainer = document.createElement('div')
    const titleMonth = document.createElement('span')
    const titleYear = document.createElement('span')
    const navMonthContainer = document.createElement('div')
    const prevMonth = document.createElement('div')
    const nextMonth = document.createElement('div')
    const titleToday = document.createElement('div')

    calendarNavContainer.className = 'calendar-nav-container'
    titleContainer.className = 'calendar-title-container'
    
    titleMonth.className = 'calendar-month'
    titleMonth.textContent = date.toLocaleString('en', {month: 'short'})
    
    titleYear.className = 'calendar-year'
    titleYear.textContent = date.toLocaleString('en', {year: 'numeric'})

    navMonthContainer.className = 'calendar-month-nav'
    prevMonth.className = 'calendar-arrow-left'
    nextMonth.className = 'calendar-arrow-right'
    titleToday.className = 'calendar-today'
    titleToday.textContent = 'Today'
    // TODO: titletoday.addEventListener('click', () => {
    //       resetCalendarView()
    // })

    // Fill container with nav
    navMonthContainer.append(prevMonth, titleToday, nextMonth)
    titleContainer.append(titleMonth, titleYear, navMonthContainer)
    calendarNavContainer.append(titleContainer)
    calendarContainer.append(calendarNavContainer)


    // TODO: THE IMPLEMENTATION HAS TO BE A BIT MORE SOPHISTICATED
    // Calendar
    const calendar = document.createElement('table')
    calendar.className = 'calendar'

    // Columns, Head, and Body
    const columnGroup = document.createElement('colgroup')
    const calendarHead = document.createElement('thead')
    const calendarHeadRow = document.createElement('tr')
    for (let i = 0; i < calendarColumns; i++) {
        // Cols create
        let column = document.createElement('col')
        if (i > 0 && i < 6) {
            column.className = 'week-day'
        } else if (i >= 6) {
            column.classList.add('week-day', 'weekend')
        }
        columnGroup.append(column)

        // Cols titles
        let columnTitle = document.createElement('th')
        columnTitle.className = 'column-title'
        if (i === 0) {
            columnTitle.textContent = 'W'
        } else {
            columnTitle.textContent = daysNames[i - 1]
        }
        calendarHeadRow.append(columnTitle)
    }
    calendarHead.append(calendarHeadRow)
    
    // Body
    const calendarBody = document.createElement('tbody')
    for (let i = 0; i < 6; i++) {
        let bodyRow = document.createElement('tr')
        for (let j = 0; j < calendarColumns; j++) {
            let bodyData = document.createElement('td')
            let bodyDataContent = document.createElement('div')
            if (j === 0) {  // Week number
                bodyDataContent.className = 'week-num'
                bodyDataContent.textContent = date.weekOfYear + i
             } else {       // Days
                bodyDataContent.className = 'day'
                bodyDataContent.textContent = date.day + (j + i)
             }
             bodyData.append(bodyDataContent)
             bodyRow.append(bodyData)
        }
        calendarBody.append(bodyRow)
    }

    // Fill calendar with body
    calendar.append(columnGroup, calendarHead, calendarBody)
    calendarContainer.append(calendar)
    
    return calendarContainer
};

function getDate() {
    const now = Temporal.Now.zonedDateTimeISO()
    const dateObject = Temporal.PlainDate.from(now)
    return dateObject
};

export { createCalendar }