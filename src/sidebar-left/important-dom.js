import { clearContent } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { taskElementCreate } from '../task/task-dom.js'

const contentContainer = document.querySelector('div.content-container')

function viewImportant() {
    clearContent(contentContainer)

    const importantHeader = document.createElement('h1')
    const tasksContainer = document.createElement('div')

    importantHeader.textContent = 'Important'
    tasksContainer.className = 'tasks-container'

    const tasksAll = Task.memory
    tasksAll.forEach(task => {
        if (task.important) {
            tasksContainer.append(taskElementCreate(task))
        }
    })

    contentContainer.append(importantHeader, tasksContainer)
}

export { viewImportant }