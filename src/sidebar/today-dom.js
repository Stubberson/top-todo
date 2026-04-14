import { currentDate, clearContent } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { taskCreate, taskRemove } from '../task/task-dom.js'

// --- Today's tasks DOM control ---

const contentContainer = document.querySelector('div.content-container')

function viewToday() {
    clearContent(contentContainer)  // Clear the content container

    const todayHeader = document.createElement('h1')
    const tasksContainer = document.querySelector('tasks-container')

    todayHeader.textContent = 'Today'

    const taskNewButton = document.createElement('button')
    taskNewButton.className = 'task-new-button'
    taskNewButton.addEventListener('click', () => {
        let task = taskCreate()
        tasksContainer.append(task.container)
        task.header.focus()  // Focus task description after creation
    })

    contentContainer.append(todayHeader, taskNewButton)
}


export { viewToday }