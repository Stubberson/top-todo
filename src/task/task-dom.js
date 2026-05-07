import { Task } from "./task-class.js"
import { clearContent } from "../utilities/utility.js"
import { Project } from "../project/project-class.js"
import { viewToday } from "../sidebar-left/today-dom.js"
import { createCalendar, displayDate, indicateDate, revertDateIndicator } from "../sidebar-right/calendar-dom.js"

function taskElementCreate(task) {
    const taskContainer = document.createElement('div')
    const taskCompleteCheckbox = document.createElement('input')
    const taskHeader = document.createElement('input')
    const taskDescriptionOpener = document.createElement('input')
    const taskDescription = document.createElement('textarea')
    const taskTagsContainer = document.createElement('div')
    const taskImportantButton = document.createElement('button')
    const taskTimeButton = document.createElement('button')
    const taskDateButton = document.createElement('button')
    const taskRemoveButton = document.createElement('button')
    const taskDatePicker = createCalendar()

    taskContainer.classList.add('task-container')
    // Add a data-id to refer to this exact task in multiple places
    taskContainer.setAttribute('data-id', task.id)

    taskCompleteCheckbox.className = 'task-complete-checkbox'
    taskCompleteCheckbox.type = 'checkbox'
    taskCompleteCheckbox.name = 'task-complete-checkbox'
    if (task.completed) taskCompleteCheckbox.checked = true
    taskCompleteCheckbox.addEventListener('click', (event) => {
        event.target.checked ? task.completed = true : task.completed = false
        taskSyncLinked(task, 'completed')  // taskSyncLinked synchronizes changes between every task copy
    })

    taskHeader.className = 'task-header'
    taskHeader.type = 'text'
    taskHeader.name = 'task-header'
    taskHeader.placeholder = 'Add task...'
    taskHeader.autocomplete = 'off'
    taskHeader.value = task.header  // If header is already given, use it
    taskHeader.style['color'] = task.style['header-color']
    taskHeader.style['text-decoration'] = task.style['header-decoration']
    taskHeader.addEventListener('input', () => {
        task.header = taskHeader.value
        taskSyncLinked(task, 'header')
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
    taskDescription.style['text-decoration'] = task.style['description-decoration']
    taskDescriptionOpener.addEventListener('click', () => {
        if (taskDescription.hidden) {
            taskDescriptionMaximize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton)
        } else {
            taskDescriptionMinimize(task, taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton, taskDatePicker)
        }
    })

    taskDescription.classList.add('task-description-area', 'description')
    taskDescription.placeholder = 'Add description...'
    taskDescription.name = 'task-description-area'
    taskDescription.rows = 3
    taskDescription.hidden = true
    taskDescription.value = task.description
    taskDescription.addEventListener('input', () => {
        task.description = taskDescription.value
        taskSyncLinked(task, 'description')
    })
    taskDescription.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            taskDescriptionMinimize(task, taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton, taskDatePicker)
        }
    })

    taskTagsContainer.className = 'task-tags-container'

    taskImportantButton.classList.add('task-important-button', 'task-tag')
    taskImportantButton.hidden = true
    taskImportantButton.textContent = 'Important'
    if (task.important) {  // Indicate important task, if already indicated somewhere else
        taskImportantButton.style.setProperty('background-image', 'var(--important-fill-black)')
        if (!taskDescriptionOpener.checked) {
            taskHeader.style.setProperty('background-image', 'var(--important-fill-gray)')
            taskHeader.style.setProperty('padding-left', '24px')
        }
    } 
    taskImportantButton.addEventListener('click', (event) => {
        task.important ? task.important = false : task.important = true
        taskSyncLinked(task, 'important')
    })

    taskTimeButton.classList.add('task-time-button', 'task-tag')
    taskTimeButton.hidden = true
    taskTimeButton.textContent = 'Time'

    taskDateButton.classList.add('task-date-button', 'task-tag')
    taskDateButton.hidden = true
    if (task.date) {
        taskDateButton.textContent = task.date.toLocaleString('en-de', { day: '2-digit', month: 'short', year:'2-digit' })
        taskDateButton.style.setProperty('background-image', 'var(--calendar-add-fill)')
    } else {
        taskDateButton.textContent = 'Date'
        taskDateButton.addEventListener('click', (event) => {
            if (taskDatePicker.hidden) {
                taskDatePicker.hidden = false
            } else {
                taskDatePicker.hidden = true
            }
        })
    }
    taskDateButton.addEventListener('keydown', (event) => {
        console.log(event.key)
        if (event.key === 'Backspace') {
            taskDateButton.textContent = 'Date'
            taskDateButton.style = 'revert-layer'
            taskDatePicker.hidden = true
            taskDateButton.blur()

            const calendarDateContainer = document.querySelector(`.sidebar-right td[time^="${task.dateToString()}"`)
            revertDateIndicator(calendarDateContainer)
            task.date = ''
        }
    })

    taskRemoveButton.classList.add('task-remove-button', 'task-tag')
    taskRemoveButton.hidden = true
    taskRemoveButton.textContent = 'Delete'
    taskRemoveButton.addEventListener('click', () => {
        removeTask(task)
    })

    taskDatePicker.classList.add('task-date-picker', 'date-picker')
    taskDatePicker.hidden = true
    taskDatePicker.setAttribute('tabindex', 0)  // Allows focus on date picker

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

    taskTagsContainer.append(taskImportantButton, taskTimeButton, taskDateButton, taskRemoveButton)
    taskContainer.append(taskCompleteCheckbox, taskHeader, taskDescriptionOpener, taskDescription, taskTagsContainer, taskDatePicker)
    
    return taskContainer
}

function getTaskHTML(task) {
    return Array.from(document.querySelectorAll(`[data-id='${task.id}']`))
}

// Sync all HTML elements linked to a specific task
function taskSyncLinked(task, property) {
    const taskHTML = getTaskHTML(task)
    // Clarification for taskHTML children structure
    const [completed, header, opener, description, tags, datePicker] = [0, 1, 2, 3, 4, 5]
    taskHTML.forEach(copy => {
        switch(property) {
            case 'header':
                copy.children[header].value = task.header
                break
            case 'description':
                copy.children[description].value = task.description
                break
            case 'completed':
                if (!task.completed) {
                    copy.children[completed].checked = false
                    copy.children[header].style.setProperty('color', 'revert-layer')
                    copy.children[header].style.setProperty('text-decoration', 'revert-layer')
                    copy.children[description].style.setProperty('text-decoration', 'revert-layer')

                    // Save the styling to access later
                    task.style['header-color'] = ''
                    task.style['header-decoration'] = ''
                    task.style['description-decoration'] = '' 
                } else {
                    copy.children[completed].checked = true
                    copy.children[header].style.setProperty('color', '#767676')
                    copy.children[header].style.setProperty('text-decoration', '#767676 line-through solid 1px')
                    copy.children[description].style.setProperty('text-decoration', '#767676 line-through solid 0.5px')
                    
                    task.style['header-color'] = '#767676'
                    task.style['header-decoration'] = '#767676 line-through solid 1px'
                    task.style['description-decoration'] = '#767676 line-through solid 0.5px'
                }
                break
            case 'important':
                if (!task.important) {
                    copy.children[header].style.setProperty('background-image', 'revert-layer')
                    copy.children[header].style.setProperty('padding-left', 'revert')
                    copy.children[tags].firstChild.style.setProperty('background-image', 'revert-layer')
                } else {
                    copy.children[header].style.setProperty('background-image', 'var(--important-fill-gray)')
                    copy.children[header].style.setProperty('padding-left', '24px')
                    copy.children[tags].firstChild.style.setProperty('background-image', 'var(--important-fill-black)')
                }
                break
            case 'date':
                copy.children[tags].children[2].textContent = task.date.toLocaleString('en-de', { day: '2-digit', month: 'short', year:'2-digit' })
                copy.children[tags].children[2].style.setProperty('background-image', 'var(--calendar-add-fill)')
                break
        }
    })
}

function removeTask(task) {
    // Remove task HTML
    const taskHTML = getTaskHTML(task)
    taskHTML.forEach(copy => copy.remove())

    // Remove task from mem
    Task.memory.splice(Task.memory.indexOf(task), 1)

    // Remove task from project mem
    if (task.owningProject) {
        task.owningProject.tasks.splice(task.owningProject.tasks.indexOf(task), 1)
    }

    // Remove main calendar marking
    const calendarDateContainer = document.querySelector(`.sidebar-right td[time^="${task.dateToString()}"`)
    revertDateIndicator(calendarDateContainer)
}

function taskDescriptionMaximize(taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton) {
    taskDescription.hidden = false
    Array.from(taskTagsContainer.children).forEach(tag => tag.hidden = false)
    taskDescriptionOpener.checked = true
    taskRemoveButton.hidden = false
    
    taskDescription.focus()
}

function taskDescriptionMinimize(task, taskHeader, taskDescription, taskTagsContainer, taskDescriptionOpener, taskRemoveButton, taskDatePicker) {
    taskDescription.hidden = true
    Array.from(taskTagsContainer.children).forEach(tag => {  // Indicate importance even if task minimized
        tag.hidden = true
        if (task.important) {
            taskSyncLinked(task, 'important')
        }
    })
    taskDescriptionOpener.checked = false
    taskRemoveButton.hidden = true
    taskDatePicker.hidden = true

    taskHeader.focus()
}

export { taskElementCreate, getTaskHTML, taskSyncLinked }