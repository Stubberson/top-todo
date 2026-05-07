import { currentView } from '../index.js'
import { clearContent, isToday, trackView } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { taskElementCreate, taskRemove } from '../task/task-dom.js'
import { displayDate, indicateDate } from '../sidebar-right/calendar-dom.js'

// --- Today's tasks DOM control ---

function viewToday() {
    trackView('today')  // Keep track of the current view

    const contentContainer = document.querySelector('div.content-container')
    clearContent(contentContainer)  // Refresh content container

    const todayHeader = document.createElement('h1')
    todayHeader.textContent = 'Today'

    const summaryContainer = document.createElement('div')
    const summaryItemContainer = document.createElement('div')
    summaryContainer.className = 'today-summary-container'
    summaryItemContainer.className = 'today-summary-item'

    const todayTasksContainer = document.createElement('div')
    todayTasksContainer.className = 'tasks-container'

    const tasksToday = getTodayTasks()
    tasksToday.forEach(task => todayTasksContainer.append(taskElementCreate(task)))

    const taskNewButton = document.createElement('button')
    taskNewButton.className = 'task-new-button'
    taskNewButton.addEventListener('click', () => {
        const element = taskElementCreate(new Task(Temporal.Now.zonedDateTimeISO()))
        displayDate(Temporal.Now.zonedDateTimeISO())
        indicateDate(Temporal.Now.zonedDateTimeISO())
        todayTasksContainer.append(element)
        element.children[1].focus()  // Focus header
    })

    summaryContainer.append(summaryItemContainer)
    contentContainer.append(todayHeader, summaryContainer, taskNewButton, todayTasksContainer)
}

function getTodayTasks() {
    return Task.memory.filter(task => isToday(task.date))
}

export { viewToday }