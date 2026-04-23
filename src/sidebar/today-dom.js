import { currentDate, clearContent } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { taskCreate, taskRemove } from '../task/task-dom.js'

// --- Today's tasks DOM control ---

const contentContainer = document.querySelector('div.content-container')
function viewToday() {
    clearContent(contentContainer)  // Clear the content container

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
        task.header.focus()  // Focus task description after creation
    })

    contentContainer.append(taskNewButton, tasksContainer)
}

function collectTodayTasks() {
    const tasksToday = []
    Task.memory.forEach(task => {
        if (task.getToday) tasksToday.push(task)
    })
    return tasksToday
}


export { viewToday }