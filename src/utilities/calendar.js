import { viewCurrent } from '../index.js';
import { clearContent } from './utility.js'
import { viewToday } from '../sidebar-left/today-dom.js';
import { displayDate, indicateDate } from '../sidebar-right/calendar-dom.js'
import { Task } from '../task/task-class.js';
import { taskElementCreate, syncLinked } from '../task/task-dom.js';

function createCalendar() {
    const displayedMonth = Temporal.Now.zonedDateTimeISO()  // Default to current date

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
    titleToday.textContent = 'TODAY'
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

    const currentMonthWeeks = createMonth(displayedMonth)  // Default to current date 
    displayMonth(calendarContainer, calendar, currentMonthWeeks)
    
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

function displayMonth(calendarContainer, calendar, currentMonthWeeks) {
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
            // Week days 'Mon', 'Tue', etc.
            columnTitle.textContent = currentMonthWeeks[0].days[i - 1].toLocaleString('en', {weekday: 'short'}).toUpperCase()
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
                bodyDataContent.textContent = currentMonthWeeks[i].weekNum
             } else {       // Days
                bodyData.setAttribute('tabindex', 0)  // Allow focus for each day
                bodyDataContent.className = 'day'
                bodyDataContent.textContent = currentMonthWeeks[i].days[j - 1].day
                // If a date has a task, indicate the date on calendar
                Task.memory.forEach(task => {
                    if (task.date.year === currentMonthWeeks[i].days[j - 1].year && task.date.dayOfYear === currentMonthWeeks[i].days[j - 1].dayOfYear) {
                        // TODO: DEFINE A BETTER INDICATOR
                        // bodyData.style['color'] = 'red'
                    }
                })

                if (currentMonthWeeks[i].days[j - 1].dayOfYear === Temporal.Now.zonedDateTimeISO().dayOfYear && currentMonthWeeks[i].days[j - 1].year === Temporal.Now.zonedDateTimeISO().year) {
                    bodyDataContent.classList.add('day-today')
                }

                if (currentMonthWeeks[i].days[j - 1].month < currentMonthWeeks[i].monthNum || currentMonthWeeks[i].days[j - 1].month > currentMonthWeeks[i].monthNum) {
                    bodyDataContent.classList.add('day-adjacent-month')
                }
                
                let dataDate = currentMonthWeeks[i].days[j - 1]  // dataDate === Temporal ZonedDateTime obj
                bodyData.addEventListener('click', (event) => dateSelect(dataDate, event))  // Add event listeners for date selection
                bodyData.addEventListener('keydown', (event) => { if (event.code === 'Space' || event.code === 'Enter') dateSelect(dataDate, event) })
             }
             bodyData.append(bodyDataContent)
             bodyRow.append(bodyData)
        }
        calendarBody.append(bodyRow)
    }

    calendar.append(columnGroup, calendarHead, calendarBody)
    calendarContainer.append(calendar)
}

function dateSelect(date, event) {
    // Differentiate between SIDEBAR and TASK date selection
    const datePicker = document.querySelector('.date-picker')
    if (!datePicker || event.currentTarget.compareDocumentPosition(datePicker) !== 10) {
        // SIDEBAR
        displayDate(date)
    } else {
        // TASK
        const taskId = datePicker.parentNode.getAttribute('data-id')
        const [task] = Task.memory.filter(task => task.id === taskId)  // filter() returns an array, un-nest it
        task.date = date
        syncLinked(task, 'date')

        // Reset selection on the picker
        const allDates = Array.from(datePicker.querySelectorAll('td:has( > .day)'))
        allDates.forEach(day => {
            // TODO: NEED BETTER INDICATOR STYLISTICALLY
            if (day.style['outline']) day.style['outline'] = 'unset'
        })
        
        indicateDate(date)  // Indicate the selection
    }
}

export { createCalendar }