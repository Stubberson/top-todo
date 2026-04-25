import { currentDate, clearContent } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { taskElementCreate, taskRemove } from '../task/task-dom.js'

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
        const task = new Task()
        task.date = Temporal.Now.zonedDateTimeISO()  // Today's date for all tasks in 'Today'
        const element = taskElementCreate(task)
        tasksContainer.append(element)
    })

    summaryContainer.append(summaryItemContainer)
    contentContainer.append(todayHeader, summaryContainer, taskNewButton, tasksContainer)
}

function collectTodayTasks() {
    const tasksToday = Task.memory.filter(task => task.date.year === Temporal.Now.zonedDateTimeISO().year && task.date.dayOfYear === Temporal.Now.zonedDateTimeISO().dayOfYear )
    return tasksToday
}

export { viewToday }