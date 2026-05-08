import { clearContent, trackView } from "../utilities/utility.js"
import { taskElementCreate } from "../task/task-dom.js"
import { Task } from '../task/task-class.js'

function viewCompleted() {
    trackView('completed')

    const contentContainer = document.querySelector('div.content-container')
    clearContent(contentContainer)

    const completedHeader = document.createElement('h1')
    completedHeader.textContent = 'Completed'

    const completedTasksContainer = document.createElement('div')
    completedTasksContainer.className = 'tasks-container'

    const completedTasks = getCompletedTasks()
    completedTasks.forEach(task => {
        completedTasksContainer.append(taskElementCreate(task))
    })

    contentContainer.append(completedHeader, completedTasksContainer)
};

function getCompletedTasks() {
    return Task.memory.filter(task => task.completed)
};

export { viewCompleted }