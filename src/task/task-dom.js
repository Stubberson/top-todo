import { Task } from "./task-class.js"
import { clearContent } from "../utilities/utility.js"
import { Project } from "../project/project-class.js"

function taskCreate(project = undefined) {
    const taskContainer = document.createElement('div')
    const taskCompleteCheckbox = document.createElement('input')
    const taskHeader = document.createElement('input')
    const taskDescriptionOpener = document.createElement('input')
    const taskRemoveButton = document.createElement('button')
    const taskDescription = document.createElement('textarea')
    const taskTagsContainer = document.createElement('div')
    const taskImportant = document.createElement('button')
    const taskDate = document.createElement('button')

    // Envelop each task into a div element
    taskContainer.className = 'task-container'

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

    taskTagsContainer.className = 'task-tags-container'

    taskImportant.classList.add('task-important-button', 'task-tag')
    taskImportant.name = 'task-important-checkbox'
    taskImportant.hidden = true

    taskDate.classList.add('task-date-button', 'task-tag')
    taskDate.hidden = true

    taskCompleteCheckbox.addEventListener('click', (event) => {
        if (event.target.checked) {
            taskHeader.style['color'] = '#767676'
            taskHeader.style['text-decoration'] = '#767676 line-through solid 1px'
            taskDescription.style['text-decoration'] = '#767676 line-through solid 0.5px'
            taskImportant.checked = false  // If completed, task not important anymore
        } else {
            taskHeader.style['color'] = 'revert'
            taskHeader.style['text-decoration'] = 'revert'
            taskDescription.style['text-decoration'] = 'revert'
        }
    })
    
    taskHeader.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()  // Prevent adding new line in description
            taskDescriptionMaximize(taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton)
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
                    taskDescriptionMaximize(taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton)
                } else {
                    taskDescriptionMinimize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton)
                }
        }
    }))

    // Eases minimizing task description
    const taskCloserEvents = ['blur', 'keydown']
    taskCloserEvents.forEach(event => taskDescription.addEventListener(event, (e) => {
        if (e.relatedTarget === null || e.key === 'Escape') {
            taskDescriptionMinimize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton)
        }
    }))

    taskRemoveButton.addEventListener('click', () => {
        taskRemove(task, project)
    })

    // Indicate important task
    let toggle = 0
    taskImportant.addEventListener('click', (event) => {
        event.target.classList.add('task-important-flag')
        if (!toggle) {
            event.target.style.setProperty('background-image', 'var(--important-fill-black)')
            toggle = 1
        } else {
            event.target.style['background-image'] = 'revert-layer'
            toggle = 0
        }
    })

    taskTagsContainer.append(taskImportant, taskDate)
    taskContainer.append(taskCompleteCheckbox, taskHeader, taskDescriptionOpener, taskRemoveButton, taskDescription, taskTagsContainer)
    
    let task = new Task(taskContainer, project)
    
    return task
}

function tasksFilter(mode, project, tasksContainer) {
    clearContent(tasksContainer)

    if (mode === 'all') {
        project.tasks.forEach(task => tasksContainer.append(task.container))
    }
    
    if (mode === 'important') {
        project.tasks.forEach(task => {
            if (task.getImportant) {
                tasksContainer.append(task.container)
            }
        })
    }
}

function taskDescriptionMaximize(taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton) {
    taskDescription.hidden = false
    Array.from(taskTagsContainer.children).forEach(tag => tag.hidden = false)
    taskDescriptionOpener.checked = true
    taskRemoveButton.hidden = false
    
    taskDescription.focus()
}

function taskDescriptionMinimize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton) {
    taskDescription.hidden = true
    Array.from(taskTagsContainer.children).forEach(tag => tag.hidden = true)
    taskDescriptionOpener.checked = false
    taskRemoveButton.hidden = true

    taskHeader.focus()
}

function taskRemove(task, project = undefined) {
    task.container.remove()                                  // Remove task from DOM
    if (project) {
        project.tasks.splice(project.tasks.indexOf(task), 1) // Remove task from project mem
    }    
    Task.memory.splice(Task.memory.indexOf(task), 1)         // Remove task from tasks mem
}

export { taskCreate, tasksFilter, taskRemove }