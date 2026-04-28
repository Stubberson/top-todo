import { clearContent, isToday } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { taskElementCreate, taskRemove } from '../task/task-dom.js'
import { createDateTask } from '../sidebar-right/calendar-dom.js'

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

    // TODO: CREATE THE TASK SIMULTANEOUSLY TO TODAY'S DATE IN THE CALENDAR, IF OPEN
    const taskNewButton = document.createElement('button')
    taskNewButton.className = 'task-new-button'
    taskNewButton.addEventListener('click', () => {
        createDateTask(Temporal.Now.zonedDateTimeISO(), tasksContainer)
    })

    summaryContainer.append(summaryItemContainer)
    contentContainer.append(todayHeader, summaryContainer, taskNewButton, tasksContainer)
}

function collectTodayTasks() {
    return Task.memory.filter(task => isToday(task.date))
}

export { viewToday }