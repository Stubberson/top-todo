import { createCalendar } from '../utilities/calendar.js'
import { clearContent, isToday } from '../utilities/utility.js'
import { taskElementCreate } from '../task/task-dom.js'
import { Task } from '../task/task-class.js'
import { viewToday } from '../sidebar-left/today-dom.js'

// Basic building blocks
const rightSidebar = document.querySelector('div.sidebar-right')
const dateContainer = document.createElement('div')
dateContainer.className = 'date-container'

function viewMainCalendar() {
    const newCalendar = createCalendar()
    rightSidebar.append(newCalendar, dateContainer)
    displayDate(Temporal.Now.zonedDateTimeISO())  // Show today's tasks by default
};

function displayDate(date, event = '') {
    clearContent(dateContainer)
    
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
        indicateDateTasks(date)
        if (isToday(date)) {
            const todayTasksContainer = document.querySelector('.content-container > .tasks-container')
            createDateTask(date, todayTasksContainer)
        } else {
            createDateTask(date)
        }
    })

    dateHeaderContainer.append(dateHeaderDay, dateHeaderMonth, dateHeaderYear)
    dateTasksContainer.append(dateTaskButton)

    const collectedTasks = collectDateTasks(date)
    collectedTasks.forEach(task => dateTasksContainer.append(taskElementCreate(task)))

    dateContainer.append(dateHeaderContainer, dateTasksContainer)
};

function createDateTask(date, container = '') {
    const task = new Task(date)
    const element = taskElementCreate(task)
    displayDate(task.date)
    if (container) container.append(element)   // Also append to other possible containers (e.g. 'Today')
    element.children[1].focus() // Focus header
};

function collectDateTasks(date) {
    return Task.memory.filter(task => date.year === task.date.year && date.dayOfYear === task.date.dayOfYear)
};

function indicateDateTasks(date) {
    // Indicate that there is a task on certain date in the calendar
    // event.target.style['color'] = 'red'
};


export { viewMainCalendar, displayDate, createDateTask }
