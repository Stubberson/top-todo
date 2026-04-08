import { Task } from "./task-class.js"

function taskCreate(project) {
    const taskCompleteCheckbox = document.createElement('input')
    const taskHeader = document.createElement('input')
    const taskDescriptionOpener = document.createElement('input')
    const taskDescription = document.createElement('textarea')
    const taskImportantCheckbox = document.createElement('input')

    taskCompleteCheckbox.className = 'task-complete-checkbox'
    taskCompleteCheckbox.type = 'checkbox'
    taskCompleteCheckbox.name = 'task-complete-checkbox'

    taskHeader.className = 'task-header'
    taskHeader.type = 'text'
    taskHeader.name = 'task-header'
    taskHeader.placeholder = 'Add task...'
    taskHeader.autocomplete = 'off'

    taskDescriptionOpener.className = 'task-tag'
    taskDescriptionOpener.id = 'task-open-checkbox'
    taskDescriptionOpener.type = 'checkbox'
    taskDescriptionOpener.name = 'task-open-checkbox'

    taskDescription.classList.add('task-description-area', 'description')
    taskDescription.placeholder = 'Add description...'
    taskDescription.name = 'task-description-area'
    taskDescription.rows = 3
    taskDescription.hidden = true

    taskImportantCheckbox.className = 'task-tag'
    taskImportantCheckbox.id = 'task-important-checkbox'
    taskImportantCheckbox.type = 'checkbox'
    taskImportantCheckbox.name = 'task-important-checkbox'
    taskImportantCheckbox.hidden = true
    
    taskHeader.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()  // Prevent adding new line in description
            taskDescriptionOpener.checked = true
            taskDescriptionExpand(taskDescription, taskImportantCheckbox)
            taskDescription.focus()
        }
    })

    const taskOpenerEvents = ['mouseenter', 'mouseleave', 'click', 'keydown']
    taskOpenerEvents.forEach(event => taskDescriptionOpener.addEventListener(event, (e) => {
        if (event === 'mouseenter') {
            taskHeader.style['background-color'] = 'whitesmoke'
        }
        if (event === 'mouseleave') {
            taskHeader.style['background-color'] = 'revert-layer'
        }
        if (event === 'click' || e.key === 'Enter') {
            if (taskDescription.hidden) {
                taskDescriptionOpener.checked = true
                taskDescriptionExpand(taskDescription, taskImportantCheckbox)
            } else {
                taskDescription.hidden = true
                taskImportantCheckbox.hidden = true
                taskDescriptionOpener.checked = false
            }
        }
    }))

    let newTask = new Task(project, taskCompleteCheckbox, taskHeader, taskDescriptionOpener, taskDescription, taskImportantCheckbox)
    return newTask  // Return newly created task 
}

function taskDescriptionExpand(taskDescription, taskImportantCheckbox) {
    taskDescription.hidden = false
    taskImportantCheckbox.hidden = false
}

export { taskCreate }