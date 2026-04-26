import { Task } from "./task-class.js"
import { clearContent } from "../utilities/utility.js"
import { createCalendar } from "../utilities/calendar.js"
import { Project } from "../project/project-class.js"
import { viewToday } from "../sidebar-left/today-dom.js"
import { displayDate } from "../sidebar-right/calendar-dom.js"

function taskElementCreate(task) {
    const taskContainer = document.createElement('div')
    const taskCompleteCheckbox = document.createElement('input')
    const taskHeader = document.createElement('input')
    const taskDescriptionOpener = document.createElement('input')
    const taskRemoveButton = document.createElement('button')
    const taskRemoveContainer = document.createElement('div')
    const taskDescription = document.createElement('textarea')
    const taskTagsContainer = document.createElement('div')
    const taskImportant = document.createElement('button')
    const taskDateButton = document.createElement('button')
    const taskDatePicker = createCalendar()

    taskContainer.classList.add('task-container')
    // Add a data-id to refer to this exact task in multiple places
    taskContainer.setAttribute('data-id', task.id)

    taskCompleteCheckbox.className = 'task-complete-checkbox'
    taskCompleteCheckbox.type = 'checkbox'
    taskCompleteCheckbox.name = 'task-complete-checkbox'

    taskHeader.className = 'task-header'
    taskHeader.type = 'text'
    taskHeader.name = 'task-header'
    taskHeader.placeholder = 'Add task...'
    taskHeader.autocomplete = 'off'
    taskHeader.value = task.header  // If header is already given, use it
    taskHeader.addEventListener('input', () => {  // Sync changes between every copy
        task.header = taskHeader.value
        task.syncLinked('header')
    })
    taskHeader.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()  // Prevent adding new line in description
            taskDescriptionMaximize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton)
        }
    })

    taskDescriptionOpener.className = 'task-open-checkbox'
    taskDescriptionOpener.type = 'checkbox'
    taskDescriptionOpener.name = 'task-open-checkbox'

    taskRemoveButton.className = 'task-remove-button'
    taskRemoveButton.hidden = true
    taskRemoveButton.addEventListener('click', () => {
        task.removeElement()
    })

    taskRemoveContainer.className = 'task-remove-container'

    taskDescription.classList.add('task-description-area', 'description')
    taskDescription.placeholder = 'Add description...'
    taskDescription.name = 'task-description-area'
    taskDescription.rows = 3
    taskDescription.hidden = true
    taskDescription.value = task.description
    taskDescription.addEventListener('input', () => {
        task.description = taskDescription.value
        task.syncLinked('description')
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
                    taskDescriptionMinimize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton, taskDatePicker)
                }
        }
    }))

    // TODO: NEED SLIGHTLY DIFFERENT TASK CONTROLS FOR DAILY TASKS, E.G. NO DATE NEEDED
    // TODO: MOVE TASK REMOVE TO TAGS CONTAINER
    taskTagsContainer.className = 'task-tags-container'

    taskImportant.classList.add('task-important-button', 'task-tag')
    taskImportant.hidden = true
    taskImportant.textContent = 'Important'

    taskDateButton.classList.add('task-date-button', 'task-tag')
    taskDateButton.hidden = true
    taskDateButton.textContent = 'Date'

    taskDatePicker.classList.add('date-picker')
    taskDatePicker.hidden = true
    taskDatePicker.setAttribute('tabindex', 0)

    taskCompleteCheckbox.addEventListener('click', (event) => {
        if (event.target.checked) {
            taskHeader.style['color'] = '#767676'
            taskHeader.style['text-decoration'] = '#767676 line-through solid 1px'
            taskDescription.style['text-decoration'] = '#767676 line-through solid 0.5px'
            task.completed = true
        } else {
            taskHeader.style['color'] = 'revert'
            taskHeader.style['text-decoration'] = 'revert'
            taskDescription.style['text-decoration'] = 'revert'
            task.completed = false
        }
    })

    // Eases minimizing task description
    taskDescription.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            taskDescriptionMinimize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton, taskDatePicker)
        }
    })

    // Indicate important task
    let toggleImportant = 0
    taskImportant.addEventListener('click', (event) => {
        if (!toggleImportant) {
            event.target.classList.add('task-important-flag')
            event.target.style.setProperty('background-image', 'var(--important-fill-black)')
            toggleImportant = 1
            task.important = true
        } else {
            event.target.classList.remove('task-important-flag')
            event.target.style.setProperty('background-image', 'revert-layer')
            toggleImportant = 0
            task.important = false
        }
    })

    // Show date picker
    let toggleDate = 0
    taskDateButton.addEventListener('click', (event) => {
        if (!toggleDate) {
            toggleDate = 1
            event.target.style.setProperty('background-image', 'var(--calendar-add-fill)')
            taskDatePicker.hidden = false
            taskDatePicker.querySelector('td').focus()  // Focus first cell
        } else {
            toggleDate = 0
            event.target.style.setProperty('background-image', 'revert-layer')
            taskDatePicker.hidden = true
        }
    })

    // Hide date picker when clicked outside or Escaped
    document.addEventListener('click', (event) => {
        if (taskDatePicker.hidden === false && !event.target.closest('div.date-picker') && !event.target.classList.contains('task-date-button')) {
            taskDatePicker.hidden = true
        }
    })
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            taskDatePicker.hidden = true
        }
    })

    taskRemoveContainer.append(taskRemoveButton)
    taskTagsContainer.append(taskImportant, taskDateButton)
    taskContainer.append(taskCompleteCheckbox, taskHeader, taskDescriptionOpener, taskRemoveContainer, taskDescription, taskTagsContainer, taskDatePicker)
    
    return taskContainer
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

function taskDescriptionMinimize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton, taskDatePicker) {
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
    taskDatePicker.hidden = true

    taskHeader.focus()
}

export { taskElementCreate, tasksFilter }