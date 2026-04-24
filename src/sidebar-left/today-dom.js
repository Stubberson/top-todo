import { currentDate, clearContent } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { taskCreate, taskRemove } from '../task/task-dom.js'

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
    tasksToday.forEach(task => tasksContainer.append(task.container))

    const taskNewButton = document.createElement('button')
    taskNewButton.className = 'task-new-button'
    taskNewButton.addEventListener('click', (event) => {
        let task = taskCreate()
        task.date = Temporal.Now.zonedDateTimeISO()
        tasksContainer.append(task.container)
        task.header.focus()
    })

    summaryContainer.append(summaryItemContainer)
    contentContainer.append(todayHeader, summaryContainer, taskNewButton, tasksContainer)
}

function collectTodayTasks() {
    const tasksToday = []
    Task.memory.forEach(task => {
        if (task.getToday) tasksToday.push(task)
    })
    return tasksToday
}


export { viewToday }