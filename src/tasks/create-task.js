function createTask(projectContainer) {
    const taskContainer = document.createElement('div')
    const taskCompleteCheckmark = document.createElement('input')
    const taskDescription = document.createElement('input')

    taskCompleteCheckmark.className = 'task-complete'
    taskCompleteCheckmark.type = 'checkbox'

    taskDescription.className = 'task-description'
    taskDescription.type = 'text'
    taskDescription.placeholder = 'Add task...'

    taskContainer.append(taskCompleteCheckmark, taskDescription)

    projectContainer.append(taskContainer)
}

export { createTask }