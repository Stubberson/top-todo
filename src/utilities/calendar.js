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

function createCalendar() {
    const currentDate = getZonedDateTime()
    const calendarColumns = 8  // Week number + 7 days
    const daysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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
    titleMonth.textContent = currentDate.toLocaleString('en', {month: 'short'})
    
    titleYear.className = 'calendar-year'
    titleYear.textContent = currentDate.toLocaleString('en', {year: 'numeric'})

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
    // Calendar view
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
    const currentMonth = getCalendarMonth(currentDate)
    const calendarBody = document.createElement('tbody')
    for (let i = 0; i < 5; i++) {  // Loop through 5 weeks: 4 of current month plus prev/next
        let bodyRow = document.createElement('tr')
        for (let j = 0; j < calendarColumns; j++) {
            let bodyData = document.createElement('td')
            let bodyDataContent = document.createElement('div')
            if (j === 0) {  // Week number
                bodyDataContent.className = 'week-num'
                bodyDataContent.textContent = currentMonth[i].weekNum
             } else {       // Days
                bodyDataContent.className = 'day'
                bodyDataContent.textContent = currentMonth[i].days[j - 1].day
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

function getZonedDateTime() {
    return Temporal.Now.zonedDateTimeISO()
};

// Credit (edited to fit the new 'Temporal' API): Liam Cain, creator of Obsidian plugin 'Calendar'
function getCalendarMonth(displayedMonth) {
    const today = displayedMonth.day
    const month = []
    let week
    const monthStartDate = displayedMonth.subtract({ days: today - 1 })
    const startOffset = monthStartDate.dayOfWeek - 1  // -1 bc otherwise goes to the prev month
    let date = monthStartDate.subtract({ days: startOffset })
    for (let _day = 0; _day < 35; _day++) {
        if (_day % 7 === 0) {
            week = {
                days: [],
                weekNum: date.weekOfYear
            }
            month.push(week)
        }
        week.days.push(date)
        date = date.add({ days: 1 })
    }
    return month
}

export { createCalendar }