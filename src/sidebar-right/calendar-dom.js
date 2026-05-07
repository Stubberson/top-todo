import { currentView } from '../index.js'
import { createMonth } from '../utilities/month.js'
import { clearContent, isToday } from '../utilities/utility.js'
import { taskElementCreate, getTaskHTML, taskSyncLinked } from '../task/task-dom.js'
import { Task } from '../task/task-class.js'
import { Project } from '../project/project-class.js'
import { viewToday } from '../sidebar-left/today-dom.js'

// Basic building blocks
const rightSidebar = document.querySelector('div.sidebar-right')
const dateContainer = document.createElement('div')
dateContainer.className = 'date-container'

function viewCalendar() {
    const calendar = createCalendar()
    rightSidebar.append(calendar, dateContainer)
    displayDate(Temporal.Now.zonedDateTimeISO())  // Show today by default
};

function createCalendar() {
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
        indicateDate()
        // Update displayed month and year
        displayedMonth = displayedMonth.subtract({ months: 1 })
        titleYear.textContent = displayedMonth.toLocaleString('en', {year: 'numeric'})
        titleMonth.textContent = displayedMonth.toLocaleString('en', {month: 'short'})
    })

    nextMonth.className = 'calendar-arrow-right'
    nextMonth.addEventListener('click', () => {
        clearContent(calendar)
        displayMonth(calendarContainer, calendar, createMonth(displayedMonth.add({ months: 1 })))
        indicateDate()
        displayedMonth = displayedMonth.add({ months: 1 })
        titleYear.textContent = displayedMonth.toLocaleString('en', {year: 'numeric'})
        titleMonth.textContent = displayedMonth.toLocaleString('en', {month: 'short'})
    })

    titleToday.className = 'calendar-today-reset'
    titleToday.textContent = 'TODAY'
    titleToday.addEventListener('click', () => {
        clearContent(calendar)
        displayMonth(calendarContainer, calendar, createMonth(Temporal.Now.zonedDateTimeISO()))
        indicateDate()
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

    const currentMonthWeeks = createMonth(displayedMonth)
    displayMonth(calendarContainer, calendar, currentMonthWeeks)
    
    return calendarContainer
};

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
            let taskIndicatorContainer = document.createElement('div')
            if (j === 0) {  // Week number
                bodyDataContent.className = 'week-num'
                bodyDataContent.textContent = currentMonthWeeks[i].weekNum
             } else {  // Days
                bodyData.setAttribute('tabindex', 0)  // Allow focus for each day
                bodyData.setAttribute('time', currentMonthWeeks[i].days[j - 1])  // Makes finding a specific date easier
                bodyDataContent.className = 'day'
                bodyDataContent.textContent = currentMonthWeeks[i].days[j - 1].day
                taskIndicatorContainer.className = 'tasks-indicator'

                if (currentMonthWeeks[i].days[j - 1].dayOfYear === Temporal.Now.zonedDateTimeISO().dayOfYear && 
                    currentMonthWeeks[i].days[j - 1].year === Temporal.Now.zonedDateTimeISO().year) {
                    bodyDataContent.classList.add('day-today')
                }

                if (currentMonthWeeks[i].days[j - 1].month < currentMonthWeeks[i].monthNum || 
                    currentMonthWeeks[i].days[j - 1].month > currentMonthWeeks[i].monthNum) {
                    bodyDataContent.classList.add('day-adjacent-month')
                }
                
                let dataDate = currentMonthWeeks[i].days[j - 1]  // dataDate === Temporal ZonedDateTime obj
                bodyData.addEventListener('click', (event) => dateSelect(dataDate, event))  // Add event listeners for date selection
                bodyData.addEventListener('keydown', (event) => { if (event.code === 'Space' || 
                                          event.code === 'Enter') dateSelect(dataDate, event) })
             }
             bodyData.append(bodyDataContent, taskIndicatorContainer)
             bodyRow.append(bodyData)

        }
        calendarBody.append(bodyRow)
    }

    calendar.append(columnGroup, calendarHead, calendarBody)
    calendarContainer.append(calendar)
};

function displayDate(date) {
    clearContent(dateContainer)
    
    // TODO: ADD NUMBER OF TASKS?
    const dateHeaderContainer = document.createElement('div')
    const dateHeaderDay = document.createElement('span')
    const dateHeaderMonth = document.createElement('span')
    const dateHeaderYear = document.createElement('span')

    dateHeaderContainer.className = 'date-header-container'
    dateHeaderDay.className = 'date-header-day'
    dateHeaderMonth.className = 'date-header-month'
    dateHeaderYear.className = 'date-header-year'

    dateHeaderDay.textContent = date.toLocaleString('en', {day: 'numeric'})
    dateHeaderMonth.textContent = date.toLocaleString('en', {month: 'long'}).toUpperCase()
    dateHeaderYear.textContent = date.toLocaleString('en', {year: 'numeric'})

    const dateTasksContainer = document.createElement('div')
    dateTasksContainer.classList.add('date-tasks-container', 'tasks-container')
    
    const dateTaskButton = document.createElement('button')
    dateTaskButton.id = 'date-task-button'
    dateTaskButton.addEventListener('click', () => {
        const task = new Task(date)
        const element = taskElementCreate(task)
        displayDate(task.date)
        if (isToday(date) && currentView[0] === 'today') {  // If added for today and 'Today' open, add to 'Today'
            const todayTasksContainer = document.querySelector('.content-container > .tasks-container')
            todayTasksContainer.append(element)
        }
        // Focus correct task header
        const copies = getTaskHTML(task)
        copies.length === 1 ? copies[0].children[1].focus() : copies[copies.length - 1].children[1].focus()

        indicateDate(date)  // Indicate date on calendar
    })

    dateHeaderContainer.append(dateHeaderDay, dateHeaderMonth, dateHeaderYear)
    dateTasksContainer.append(dateTaskButton)

    const dateTasks = getDateTasks(date)
    dateTasks.forEach(task => dateTasksContainer.append(taskElementCreate(task)))
    dateContainer.append(dateHeaderContainer, dateTasksContainer)
};

function dateSelect(date, event) {
    // TASK, PROJECT, and main CALENDAR date selection
    const datePickers = Array.from(document.querySelectorAll('.date-picker'))
    const [datePicker] = datePickers.filter(instance => !instance.hidden)  // querySelector() also selects hidden elements, select the visible
    if (datePicker && datePicker.classList.contains('task-date-picker')) {
        // TASK
        const taskId = datePicker.parentNode.getAttribute('data-id')
        const [task] = Task.memory.filter(task => task.id === taskId)
        task.date = date
        taskSyncLinked(task, 'date')  // Controls the appearance of date button
        indicateDate(date)           // Indicate the current selection on main calendar
        datePicker.hidden = true    // Hide the picker when selection is made
    } else if (datePicker && datePicker.classList.contains('project-date-picker')) {
        // PROJECT
        const projectId = datePicker.parentNode.parentNode.getAttribute('data-id')
        const [project] = Project.memory.filter(project => project.id === projectId)
        project.date = date
        indicateDate(date, project)
        datePicker.hidden = true
    } else {
        // CALENDAR
        const containers = document.querySelectorAll('.sidebar-right > .calendar-container td:has( > .day)')
        containers.forEach(container => container.firstChild.style['transform'] = 'revert-layer')
        event.currentTarget.firstChild.style.setProperty('transition', 'transform 0.2s ease-in-out')
        event.currentTarget.firstChild.style.setProperty('transform', 'scale(1.3)')
        displayDate(date)
    }
}

function indicateDate(date = '', project = '') {
    if (project) {
        // Indicate date in the project listing
        const listingButtonDate = document.querySelector(`.listing-date[data-id='${project.id}']`)
        listingButtonDate.textContent = date.toLocaleString('en-de', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase()
        
        const projectDateButton = document.querySelector('.project-date-button')
        projectDateButton.textContent = date.toLocaleString('en-de', { day: '2-digit', month: 'short', year: '2-digit' })
        projectDateButton.style.setProperty('background-image', 'var(--calendar-add-fill)')
    } else if (date) {
        // Indicate a task on certain date
        const dateTasks = getDateTasks(date)
        const dateString = date.toString().slice(0, 10)
        const containers = document.querySelectorAll('.sidebar-right > .calendar-container td:has( > .day)')
        containers.forEach(container => {
            let containerDateString = container.getAttribute('time').slice(0, 10)
            if (containerDateString === dateString) {
                container.firstChild.style['font-weight'] = '600'

                const svgns = 'http://www.w3.org/2000/svg'
                const rect = document.createElementNS(svgns, 'rect')
                const svgContainer = document.createElementNS(svgns, 'svg')
                svgContainer.setAttribute('width', '5px')
                svgContainer.setAttribute('height', '5px')

                // TODO: STILL NEEDS WORK, BLACK AND RED NOT EASY TO DISTINGUISH
                if (dateTasks.length < 5) {
                    rect.style['stroke'] = 'black'
                    rect.style['stroke-width'] = '0.5px'
                } else if (dateTasks.length >= 5 && dateTasks.length < 9) {
                    rect.style['stroke'] = 'var(--cherry-rose)'
                    rect.style['stroke-width'] = '0.5px'
                } else {
                    rect.style['x'] = '0.5px'
                    rect.style['y'] = '0.5px'
                    rect.style['width'] = '4px'
                    rect.style['height'] = '4px'
                    rect.style['fill'] = 'var(--cherry-rose)'
                    rect.style['fill-opacity'] = '1'
                }

                svgContainer.appendChild(rect)
                container.lastChild.prepend(svgContainer)
            } else {
                // Keep track of correct number of tasks per date and indicate accordingly
                const indicatorsPerDate = container.lastChild.childNodes.length
                const tasksPerDate = getDateTasks(Temporal.ZonedDateTime.from(container.getAttribute('time')))
                if (indicatorsPerDate > tasksPerDate.length) {
                    revertDateIndicator(container)
                }
            }
        })
    } else {
        // When a "new calendar" is rendered (prev/next month), show task indicators correctly
        Task.memory.forEach(task => {
            let taskDate = task.date.toString().slice(0, 10)
            let calendarDateContainer = document.querySelector(`.sidebar-right td[time^="${taskDate}"`)
            if (taskDate === calendarDateContainer.getAttribute('time').slice(0, 10)) {
                indicateDate(task.date)
            }
        })
    }
};

function revertDateIndicator(dateContainer) {
    if (dateContainer.lastChild.childNodes.length === 1) {
        dateContainer.lastChild.firstChild.remove()
        dateContainer.firstChild.style['font-weight'] = 'revert-layer'
    } else {
        dateContainer.lastChild.firstChild.remove()
    }
};

function getDateTasks(date) {
    return Task.memory.filter(task => date.year === task.date.year && date.dayOfYear === task.date.dayOfYear)
};

export { viewCalendar, createCalendar, displayDate, indicateDate, revertDateIndicator }
