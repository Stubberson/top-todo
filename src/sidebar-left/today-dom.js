import { clearContent, isToday } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { taskElementCreate, taskRemove } from '../task/task-dom.js'
import { displayDate, indicateDate } from '../sidebar-right/calendar-dom.js'

// --- Today's tasks DOM control ---

const contentContainer = document.querySelector('div.content-container')
function viewToday() {
    clearContent(contentContainer)  // Clear the content container

    const todayHeader = document.createElement('h1')
    todayHeader.textContent = 'Today'

    const summaryContainer = document.createElement('div')
    const summaryItemContainer = document.createElement('div')
    summaryContainer.className = 'today-summary-container'
    summaryItemContainer.className = 'today-summary-item'

    const tasksContainer = document.createElement('div')
    tasksContainer.className = 'tasks-container'

    const tasksToday = collectTodayTasks()
    tasksToday.forEach(task => tasksContainer.append(taskElementCreate(task)))

    const taskNewButton = document.createElement('button')
    taskNewButton.className = 'task-new-button'
    taskNewButton.addEventListener('click', () => {
        const element = taskElementCreate(new Task(Temporal.Now.zonedDateTimeISO()))
        displayDate(Temporal.Now.zonedDateTimeISO())
        indicateDate(Temporal.Now.zonedDateTimeISO())
        tasksContainer.append(element)
        element.children[1].focus()  // Focus header
    })

    summaryContainer.append(summaryItemContainer)
    contentContainer.append(todayHeader, summaryContainer, taskNewButton, tasksContainer)
}

function collectTodayTasks() {
    return Task.memory.filter(task => isToday(task.date))
}

export { viewToday }