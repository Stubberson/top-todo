function taskCreate(projectContainer) {
    const taskContainer = document.createElement('div')
    const taskCompleteCheckbox = document.createElement('input')
    const taskDescriptionContainer = document.createElement('div')
    const taskHeader = document.createElement('input')
    const taskDescription = document.createElement('textarea')
    const taskImportantCheckbox = document.createElement('input')

    taskContainer.className = 'task-container'

    taskCompleteCheckbox.className = 'task-complete-checkbox'
    taskCompleteCheckbox.type = 'checkbox'
    taskCompleteCheckbox.name = 'task-complete-checkbox'

    taskDescriptionContainer.className = 'task-description-container'

    taskHeader.className = 'task-header'
    taskHeader.type = 'text'
    taskHeader.name = 'task-header'
    taskHeader.placeholder = 'Add task...'
    taskHeader.autocomplete = 'off'

    taskDescription.className = 'task-description'
    taskDescription.placeholder = 'Add description...'
    taskDescription.name = 'task-description'
    taskDescription.rows = 3
    taskDescription.hidden = true

    taskImportantCheckbox.className = 'task-important-checkbox'
    taskImportantCheckbox.type = 'checkbox'
    taskImportantCheckbox.name = 'task-important'
    taskImportantCheckbox.hidden = true

    // THIS IS PROBABLY TOO DIFFICULT WITHOUT ANY GUIDANCE...
    taskHeader.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') taskDescriptionExpand(taskDescription, taskImportantCheckbox)
    })

    taskDescriptionContainer.append(taskHeader, taskDescription, taskImportantCheckbox)

    taskContainer.append(taskCompleteCheckbox, taskDescriptionContainer)

    projectContainer.append(taskContainer)

    return taskDescription
}

function taskDescriptionExpand(taskDescription, taskImportantCheckbox) {
    taskDescription.hidden = false
    taskImportantCheckbox.hidden = false
}

export { taskCreate }