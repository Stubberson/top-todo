function taskCreate(projectContainer) {
    const taskContainer = document.createElement('div')
    const taskCompleteCheckmark = document.createElement('input')
    const taskDescription = document.createElement('input')
    const taskImportant = document.createElement('input')

    taskContainer.className = 'task-container'

    taskCompleteCheckmark.className = 'task-complete'
    taskCompleteCheckmark.type = 'checkbox'

    taskDescription.className = 'task-description'
    taskDescription.type = 'text'
    taskDescription.name = 'task-description'
    taskDescription.placeholder = 'Add task...'
    taskDescription.autocomplete = 'off'

    taskImportant.className = 'task-important'
    taskImportant.type = 'checkbox'

    taskContainer.append(taskCompleteCheckmark, taskDescription, taskImportant)

    projectContainer.append(taskContainer)

    return taskDescription
}

export { taskCreate }