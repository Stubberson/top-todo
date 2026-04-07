function taskCreate(projectContainer) {
    const taskContainer = document.createElement('div')
    const taskCompleteCheckmark = document.createElement('input')
    const taskDescription = document.createElement('input')

    taskContainer.className = 'task-container'

    taskCompleteCheckmark.className = 'task-complete'
    taskCompleteCheckmark.type = 'checkbox'

    taskDescription.className = 'task-description'
    taskDescription.type = 'text'
    taskDescription.name = 'task-description'
    taskDescription.placeholder = 'Add task...'

    taskContainer.append(taskCompleteCheckmark, taskDescription)

    projectContainer.append(taskContainer)

    return taskContainer
}

export { taskCreate }