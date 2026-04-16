import { Task } from "./task-class.js"
import { clearContent } from "../utilities/utility.js"
import { Project } from "../project/project-class.js"

function taskCreate(project = undefined) {
    const taskContainer = document.createElement('div')
    const taskCompleteCheckbox = document.createElement('input')
    const taskHeader = document.createElement('input')
    const taskDescriptionOpener = document.createElement('input')
    const taskRemoveButton = document.createElement('button')
    const taskRemoveContainer = document.createElement('div')
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

    taskRemoveContainer.className = 'task-remove-container'

    taskDescription.classList.add('task-description-area', 'description')
    taskDescription.placeholder = 'Add description...'
    taskDescription.name = 'task-description-area'
    taskDescription.rows = 3
    taskDescription.hidden = true

    taskTagsContainer.className = 'task-tags-container'

    taskImportant.classList.add('task-important-button', 'task-tag')
    taskImportant.hidden = true
    taskImportant.textContent = 'Important'

    taskDate.classList.add('task-date-button', 'task-tag')
    taskDate.hidden = true
    taskDate.textContent = 'Date'

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
            taskDescriptionMaximize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton)
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
                    taskDescriptionMaximize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton)
                } else {
                    taskDescriptionMinimize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton)
                }
        }
    }))

    // Eases minimizing task description
    taskDescription.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            taskDescriptionMinimize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton)
        }
    })

    taskRemoveButton.addEventListener('click', () => {
        taskRemove(task, project)
    })

    // Indicate important task
    let toggle = 0
    taskImportant.addEventListener('click', (event) => {
        if (!toggle) {
            event.target.classList.add('task-important-flag')
            event.target.style.setProperty('background-image', 'var(--important-fill-black)')
            toggle = 1
        } else {
            event.target.classList.remove('task-important-flag')
            event.target.style.setProperty('background-image', 'revert-layer')
            toggle = 0
        }
    })

    taskRemoveContainer.append(taskRemoveButton)
    taskTagsContainer.append(taskImportant, taskDate)
    taskContainer.append(taskCompleteCheckbox, taskHeader, taskDescriptionOpener, taskRemoveContainer, taskDescription, taskTagsContainer)
    
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

function taskDescriptionMaximize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton) {
    taskHeader.style.setProperty('background-image', 'unset')
    taskDescription.hidden = false
    Array.from(taskTagsContainer.children).forEach(tag => tag.hidden = false)
    taskDescriptionOpener.checked = true
    taskRemoveButton.hidden = false
    
    taskDescription.focus()
}

function taskDescriptionMinimize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton) {
    taskDescription.hidden = true
    const taskTags = Array.from(taskTagsContainer.children)
    taskTags.forEach(tag => {  // Indicate importance even if task minimized
        tag.hidden = true
        if (tag.classList.contains('task-important-flag')) {
            taskHeader.style.setProperty('background-image', 'var(--important-fill-gray)')
        }
    })
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