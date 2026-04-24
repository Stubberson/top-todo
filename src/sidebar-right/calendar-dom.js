import { createCalendar } from '../utilities/calendar.js'
import { clearContent } from '../utilities/utility.js'
import { taskCreate } from '../task/task-dom.js'
import { Task } from '../task/task-class.js'

const rightSidebar = document.querySelector('div.sidebar-right')
const dateContainer = document.createElement('div')
dateContainer.className = 'date-container'

function viewMainCalendar() {
    const newCalendar = createCalendar()
    rightSidebar.append(newCalendar, dateContainer)
};

function displayDate(date, event) {
    clearContent(dateContainer)
    
    const dateHeaderContainer = document.createElement('div')
    const dateHeaderDay = document.createElement('span')
    const dateHeaderMonth = document.createElement('span')
    const dateHeaderYear = document.createElement('span')

    const dateTasksContainer = document.createElement('div')
    const dateTaskButton = document.createElement('button')

    dateHeaderContainer.className = 'date-header-container'
    dateHeaderDay.className = 'date-header-day'
    dateHeaderMonth.className = 'date-header-month'
    dateHeaderYear.className = 'date-header-year'

    dateHeaderDay.textContent = date.toLocaleString('en', {day: 'numeric'})
    dateHeaderMonth.textContent = date.toLocaleString('en', {month: 'long'}).toUpperCase()
    dateHeaderYear.textContent = date.toLocaleString('en', {year: 'numeric'})

    dateTasksContainer.classList.add('date-tasks-container', 'tasks-container')
    
    dateTaskButton.id = 'date-task-button'
    dateTaskButton.addEventListener('click', () => {
        createDateTask(date, dateTasksContainer)
        indicateDateTasks(event)
    })

    dateHeaderContainer.append(dateHeaderDay, dateHeaderMonth, dateHeaderYear)
    dateTasksContainer.append(dateTaskButton)

    const collectedTasks = collectDateTasks(date)
    collectedTasks.forEach(task => dateTasksContainer.append(task.container))

    dateContainer.append(dateHeaderContainer, dateTasksContainer)
};

function createDateTask(date, container) {
    let task = taskCreate()
    task.date = date
    container.append(task.container)
    task.header.focus()
};

function collectDateTasks(date) {
    const dateTasks = []
    Task.memory.forEach(task => {
        if (date === task.date) dateTasks.push(task)
    })
    return dateTasks
};

function indicateDateTasks(event) {
    // Indicate that there is a task on certain date in the calendar
    event.target.style['color'] = 'red'
};


export { viewMainCalendar, displayDate, createDateTask }
