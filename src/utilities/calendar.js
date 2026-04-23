import { clearContent } from './utility.js'

const daysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
function createCalendar(popup = false) {
    let displayedMonth = Temporal.Now.zonedDateTimeISO()  // Default to current date

    const calendarContainer = document.createElement('div')
    calendarContainer.className = 'calendar-container'

    // Navigation
    const calendarNavContainer = document.createElement('div')
    const titleContainer = document.createElement('div')
    const titleYear = document.createElement('span')
    const titleMonth = document.createElement('span')
    const navMonthContainer = document.createElement('div')
    const prevMonth = document.createElement('div')
    const nextMonth = document.createElement('div')
    const titleToday = document.createElement('div')

    calendarNavContainer.className = 'calendar-nav-container'
    titleContainer.className = 'calendar-title-container'
    
    titleYear.classList.add('date-picker-year')
    titleYear.textContent = displayedMonth.toLocaleString('en', {year: 'numeric'})

    titleMonth.classList.add('date-picker-month')
    titleMonth.textContent = displayedMonth.toLocaleString('en', {month: 'short'})    

    navMonthContainer.className = 'calendar-month-nav'
    prevMonth.className = 'calendar-arrow-left'

    prevMonth.addEventListener('click', () => {
        clearContent(calendar)
        displayMonth(calendarContainer, calendar, createMonth(displayedMonth.subtract({ months: 1 })))
        // Update displayed month and year
        displayedMonth = displayedMonth.subtract({ months: 1 })
        titleYear.textContent = displayedMonth.toLocaleString('en', {year: 'numeric'})
        titleMonth.textContent = displayedMonth.toLocaleString('en', {month: 'short'})
    })

    nextMonth.className = 'calendar-arrow-right'
    nextMonth.addEventListener('click', () => {
        clearContent(calendar)
        displayMonth(calendarContainer, calendar, createMonth(displayedMonth.add({ months: 1 })))
        displayedMonth = displayedMonth.add({ months: 1 })
        titleYear.textContent = displayedMonth.toLocaleString('en', {year: 'numeric'})
        titleMonth.textContent = displayedMonth.toLocaleString('en', {month: 'short'})
    })

    titleToday.className = 'calendar-today-reset'
    titleToday.textContent = 'Today'
    titleToday.addEventListener('click', () => {
        clearContent(calendar)
        displayMonth(calendarContainer, calendar, createMonth(Temporal.Now.zonedDateTimeISO()))
        displayedMonth = Temporal.Now.zonedDateTimeISO()
        titleYear.textContent = displayedMonth.toLocaleString('en', {year: 'numeric'})
        titleMonth.textContent = displayedMonth.toLocaleString('en', {month: 'short'})
    })

    // Fill container with nav
    navMonthContainer.append(prevMonth, titleToday, nextMonth)
    titleContainer.append(titleYear, titleMonth, navMonthContainer)
    calendarNavContainer.append(titleContainer)
    calendarContainer.append(calendarNavContainer)
    
    // Calendar body
    const calendar = document.createElement('table')
    calendar.className = 'calendar'

    const currentCalendarMonth = createMonth(displayedMonth)  // Default to current date 
    displayMonth(calendarContainer, calendar, currentCalendarMonth)
    
    return calendarContainer
};

// Credit (edited to fit the new 'Temporal' API): Liam Cain, creator of Obsidian plugin 'Calendar'
function createMonth(selectedMonth) {
    const today = selectedMonth.day
    const month = []
    let week
    const monthStartDate = selectedMonth.subtract({ days: today - 1 })
    const startOffset = monthStartDate.dayOfWeek - 1  // -1 bc otherwise goes to the prev month
    let date = monthStartDate.subtract({ days: startOffset })
    for (let _day = 0; _day < 42; _day++) {
        if (_day % 7 === 0) {
            week = {
                days: [],
                weekNum: date.weekOfYear,
                monthNum: monthStartDate.month  // selectedMonth's month number
            }
            month.push(week)
        }
        week.days.push(date)
        date = date.add({ days: 1 })
        
    }
    return month
}

function displayMonth(calendarContainer, calendar, createdMonth) {
    const columnGroup = document.createElement('colgroup')
    const calendarHead = document.createElement('thead')
    const calendarHeadRow = document.createElement('tr')
    for (let i = 0; i < 8; i++) {
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

    const calendarBody = document.createElement('tbody')
    for (let i = 0; i < 6; i++) {  // Loop through 6 weeks: 4 of current month + end/beginning of prev/past
        let bodyRow = document.createElement('tr')
        for (let j = 0; j < 8; j++) {
            let bodyData = document.createElement('td')
            let bodyDataContent = document.createElement('div')
            if (j === 0) {  // Week number
                bodyDataContent.className = 'week-num'
                bodyDataContent.textContent = createdMonth[i].weekNum
             } else {       // Days
                bodyData.setAttribute('tabindex', 0)  // Allows focus
                bodyDataContent.className = 'day'
                // Today class for styling
                if (createdMonth[i].days[j - 1].dayOfYear === Temporal.Now.zonedDateTimeISO().dayOfYear && createdMonth[i].days[j - 1].year === Temporal.Now.zonedDateTimeISO().year) {
                    bodyDataContent.classList.add('day-today')
                }
                // Adjacent months days class for styling
                if (createdMonth[i].days[j - 1].month < createdMonth[i].monthNum || createdMonth[i].days[j - 1].month > createdMonth[i].monthNum) {
                    bodyDataContent.classList.add('day-adjacent-month')
                }
                bodyDataContent.textContent = createdMonth[i].days[j - 1].day
             }
             bodyData.append(bodyDataContent)
             bodyRow.append(bodyData)
        }
        calendarBody.append(bodyRow)
    }

    calendar.append(columnGroup, calendarHead, calendarBody)
    calendarContainer.append(calendar)
}

export { createCalendar }