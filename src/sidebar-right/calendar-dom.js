import { createCalendar } from '../utilities/calendar.js'
import { clearContent } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'

const rightSidebar = document.querySelector('div.sidebar-right')
const dateContainer = document.createElement('div')
dateContainer.className = 'date-container'

function viewMainCalendar() {
    const newCalendar = createCalendar()
    rightSidebar.append(newCalendar, dateContainer)
};

function displayDate(date) {
    clearContent(dateContainer)
    
    const dateHeaderContainer = document.createElement('div')
    const dateHeaderDay = document.createElement('span')
    const dateHeaderMonth = document.createElement('span')
    const dateHeaderYear = document.createElement('span')
    const minimizeTasksButton = document.createElement('button')

    // TODO: POPOVER BEHAVES UNEXECTEDLY
    const dateTasksContainer = document.createElement('div')
    dateTasksContainer.id = 'date-tasks-container'
    dateTasksContainer.setAttribute('popover', 'manual')
    dateTasksContainer.textContent = 'IHAN SAMA'
    dateTasksContainer.addEventListener('toggle', (event) => {
        if (event.newState === 'open') {
            console.log('huzzaah')
        }
    })

    dateHeaderContainer.className = 'date-header-container'
    dateHeaderDay.className = 'date-header-day'
    dateHeaderMonth.className = 'date-header-month'
    dateHeaderYear.className = 'date-header-year'
    
    minimizeTasksButton.id = 'date-tasks-close'
    minimizeTasksButton.setAttribute('popovertarget', 'date-tasks-container')

    dateHeaderDay.textContent = date.toLocaleString('en', {day: 'numeric'})
    dateHeaderMonth.textContent = date.toLocaleString('en', {month: 'long'}).toUpperCase()
    dateHeaderYear.textContent = date.toLocaleString('en', {year: 'numeric'})

    dateHeaderContainer.append(dateHeaderDay, dateHeaderMonth, dateHeaderYear, minimizeTasksButton)

    // TODO: COLLECT ALL TASKS FOR THAT DATE

    dateContainer.append(dateHeaderContainer, dateTasksContainer)
};

function collectDateTasks() {

};

function createDateTask() {
    // let task = taskCreate()
    // task.date = date
    // rightSidebar.append(task.container)
    // task.header.focus()
};


export { viewMainCalendar, displayDate }
