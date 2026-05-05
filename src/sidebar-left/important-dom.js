import { clearContent } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { syncLinked, taskElementCreate } from '../task/task-dom.js'

const contentContainer = document.querySelector('div.content-container')

function viewImportant() {
    clearContent(contentContainer)

    const importantHeader = document.createElement('h1')
    const tasksContainer = document.createElement('div')

    importantHeader.textContent = 'Important'
    tasksContainer.className = 'tasks-container'

    const tasksImportant = getImportantTasks()
    tasksImportant.forEach(task => tasksContainer.append(taskElementCreate(task)))

    contentContainer.append(importantHeader, tasksContainer)
}

function getImportantTasks() {
    return Task.memory.filter(task => task.important)
}

export { viewImportant }