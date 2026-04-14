import { Task } from "./task-class.js"
import { clearContent } from "../utilities/utility.js"
import { Project } from "../project/project-class.js"

function taskCreate(project) {
    const taskCompleteCheckbox = document.createElement('input')
    const taskHeader = document.createElement('input')
    const taskDescriptionOpener = document.createElement('input')
    const taskRemoveButton = document.createElement('button')
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

    taskDescriptionOpener.className = 'task-open-checkbox'
    taskDescriptionOpener.type = 'checkbox'
    taskDescriptionOpener.name = 'task-open-checkbox'

    taskRemoveButton.className = 'task-remove-button'
    taskRemoveButton.hidden = true

    taskDescription.classList.add('task-description-area', 'description')
    taskDescription.placeholder = 'Add description...'
    taskDescription.name = 'task-description-area'
    taskDescription.rows = 3
    taskDescription.hidden = true

    taskImportantCheckbox.className = 'task-important-checkbox'
    taskImportantCheckbox.type = 'checkbox'
    taskImportantCheckbox.name = 'task-important-checkbox'
    taskImportantCheckbox.hidden = true

    taskCompleteCheckbox.addEventListener('click', (event) => {
        if (event.target.checked) {
            taskHeader.style['color'] = '#767676'
            taskHeader.style['text-decoration'] = '#767676 line-through solid 1px'
            taskDescription.style['text-decoration'] = '#767676 line-through solid 0.5px'
            taskImportantCheckbox.checked = false  // If completed, task not important anymore
        } else {
            taskHeader.style['color'] = 'revert'
            taskHeader.style['text-decoration'] = 'revert'
            taskDescription.style['text-decoration'] = 'revert'
        }
    })
    
    taskHeader.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()  // Prevent adding new line in description
            taskDescriptionMaximize(taskDescription, taskImportantCheckbox, taskDescriptionOpener, taskRemoveButton)
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
                    taskDescriptionMaximize(taskDescription, taskImportantCheckbox, taskDescriptionOpener, taskRemoveButton)
                } else {
                    taskDescriptionMinimize(taskHeader, taskDescription, taskImportantCheckbox, taskDescriptionOpener, taskRemoveButton)
                }
        }
    }))

    // Eases minimizing task description
    const taskCloserEvents = ['blur', 'keydown']
    taskCloserEvents.forEach(event => taskDescription.addEventListener(event, (e) => {
        if (e.relatedTarget === null || e.key === 'Escape') {
            taskDescriptionMinimize(taskHeader, taskDescription, taskImportantCheckbox, taskDescriptionOpener, taskRemoveButton)
        }
    }))

    taskRemoveButton.addEventListener('click', () => {
        taskRemove(newTask, project)
    })

    // Indicate important task
    taskImportantCheckbox.addEventListener('click', (event) => {
        event.target.classList.remove('task-important')
        if (event.target.checked) event.target.classList.add('task-important-tag')
    })

    let newTask = new Task(project, taskCompleteCheckbox, taskHeader, taskDescriptionOpener, taskRemoveButton, taskDescription, taskImportantCheckbox)
    return newTask
}

function tasksFilter(mode, project, tasksContainer) {
    clearContent(tasksContainer)

    let allProjectTasks = project.tasks
    if (mode === 'all') {
        allProjectTasks.forEach(task => tasksContainer.append(task.container))
    }
    if (mode === 'important') {
        allProjectTasks.forEach(task => {
            if (task.getImportant) {
                tasksContainer.append(task.container)
            }
        })
    }
}

function taskDescriptionMaximize(taskDescription, taskImportantCheckbox, taskDescriptionOpener, taskRemoveButton) {
    taskDescription.hidden = false
    taskImportantCheckbox.hidden = false
    taskDescriptionOpener.checked = true
    taskRemoveButton.hidden = false
    
    taskDescription.focus()

    taskImportantCheckbox.style['top'] = 'revert-layer'
    taskImportantCheckbox.style['right'] = 'revert-layer'
    taskImportantCheckbox.style['transform'] = 'revert-layer'
}

function taskDescriptionMinimize(taskHeader, taskDescription, taskImportantCheckbox, taskDescriptionOpener, taskRemoveButton) {
    taskDescription.hidden = true
    taskDescriptionOpener.checked = false
    taskRemoveButton.hidden = true

    taskHeader.focus()

    if (taskImportantCheckbox.checked) {  // Indicate task importance even if description minimized
        taskImportantCheckbox.style['right'] = '40px'
        taskImportantCheckbox.style['top'] = '-2px'
        taskImportantCheckbox.style['transform'] = 'scale(1.0)'
    } else {
        taskImportantCheckbox.hidden = true
    }
}

function taskRemove(task, project) {
    task.container.remove()                               // Remove task from DOM
    project.tasks.splice(project.tasks.indexOf(task), 1)  // Remove task from project mem
    Task.memory.splice(Task.memory.indexOf(task), 1)      // Remove task from tasks mem
}

export { taskCreate, tasksFilter }