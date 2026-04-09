import { Task } from "./task-class.js"
import { clearContent } from "../utilities/utility.js"

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

    taskCompleteCheckbox.addEventListener('click', (event) => {
        if (event.target.checked) {
            taskHeader.style['color'] = '#767676'
            taskHeader.style['text-decoration'] = '#767676 line-through solid 1px'
            taskDescription.style['text-decoration'] = '#767676 line-through solid 0.5px'
        } else {
            taskHeader.style['color'] = 'revert'
            taskHeader.style['text-decoration'] = 'revert'
            taskDescription.style['text-decoration'] = 'revert'
        }
    })
    
    taskHeader.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()  // Prevent adding new line in description
            taskDescriptionExpand(taskDescription, taskImportantCheckbox, taskDescriptionOpener)
        }
    })

    const taskOpenerEvents = ['mouseenter', 'mouseleave', 'click']
    taskOpenerEvents.forEach(event => taskDescriptionOpener.addEventListener(event, () => {
        switch (event) {
            case 'mouseenter':
                taskHeader.style['background-color'] = 'whitesmoke'
                break
            case 'mouseleave':
                taskHeader.style['background-color'] = 'revert-layer'
                break
            case 'click':
                if (taskDescription.hidden) {
                    taskDescriptionExpand(taskDescription, taskImportantCheckbox, taskDescriptionOpener)
                } else {
                    taskDescriptionMinimize(taskDescription, taskImportantCheckbox, taskDescriptionOpener)
                }
        }
    }))

    // Eases minimizing task
    const taskCloserEvents = ['blur', 'keydown']
    taskCloserEvents.forEach(event => taskDescription.addEventListener(event, (e) => {
        if (e.relatedTarget === null || e.key === 'Escape') {
            taskDescriptionMinimize(taskDescription, taskImportantCheckbox, taskDescriptionOpener)
        }
    }))

    let newTask = new Task(project, taskCompleteCheckbox, taskHeader, taskDescriptionOpener, taskDescription, taskImportantCheckbox)
    return newTask
}

function tasksFilter(mode, project, tasksContainer) {
    clearContent(tasksContainer)

    let allProjectTasks = project.getTasks
    if (mode === 'all') {
        allProjectTasks.forEach(task => tasksContainer.append(task.getContainer))
    }
    if (mode === 'important') {
        allProjectTasks.forEach(task => {
            if (task.getImportant) {
                tasksContainer.append(task.getContainer)
            }
        })
    }
}

function taskDescriptionExpand(taskDescription, taskImportantCheckbox, taskDescriptionOpener) {
    taskDescription.hidden = false
    taskImportantCheckbox.hidden = false
    taskDescriptionOpener.checked = true
    taskDescription.focus()

    // Indicate important task
    taskImportantCheckbox.addEventListener('click', (event) => {
        event.target.classList.remove('task-important')
        if (event.target.checked) event.target.classList.add('task-important')
    })
}

function taskDescriptionMinimize(taskDescription, taskImportantCheckbox, taskDescriptionOpener) {
    taskDescription.hidden = true
    taskImportantCheckbox.hidden = true
    taskDescriptionOpener.checked = false
}

export { taskCreate, tasksFilter }