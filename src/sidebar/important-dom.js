import { clearContent } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'

const contentContainer = document.querySelector('div.content-container')

function viewImportant() {
    clearContent(contentContainer)

    const importantHeader = document.createElement('h1')
    const tasksContainer = document.createElement('div')

    importantHeader.textContent = 'Important'
    tasksContainer.className = 'tasks-container'

    let tasksImportantAll = Task.memory
    tasksImportantAll.forEach(task => {
        if (task.getImportant) {
            tasksContainer.append(task.container)
        }
    })

    contentContainer.append(importantHeader, tasksContainer)
}

export { viewImportant }