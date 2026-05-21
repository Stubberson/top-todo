import { Task } from "./task-class.js"
import { clearContent } from "../utilities/utility.js"
import { createTimePicker } from "../utilities/time.js"
import { Project } from "../project/project-class.js"
import { viewToday } from "../sidebar-left/today-dom.js"
import { createCalendar, displayDate, indicateDate, revertDateIndicator } from "../sidebar-right/calendar-dom.js"

function taskElementCreate(task) {
    const taskContainer = document.createElement('div')
    const taskCompleteCheckbox = document.createElement('input')
    const tagsHeaderContainer = document.createElement('div')
    const tagIndicatorsContainer = document.createElement('div')
    const taskHeader = document.createElement('input')
    const taskDescriptionOpener = document.createElement('input')
    const taskDescription = document.createElement('textarea')
    const taskTagsContainer = document.createElement('div')
    const taskImportantButton = document.createElement('button')
    const taskTimeButton = document.createElement('button')
    const taskTimePicker = createTimePicker(task, taskTimeButton)
    const taskDateButton = document.createElement('button')
    const taskDatePicker = createCalendar()
    const taskRemoveButton = document.createElement('button')
    

    taskContainer.classList.add('task-container')
    taskContainer.setAttribute('data-id', task.id)  // Add a data-id for easier reference

    taskCompleteCheckbox.className = 'task-complete-checkbox'
    taskCompleteCheckbox.type = 'checkbox'
    taskCompleteCheckbox.name = 'task-complete-checkbox'
    if (task.completed) taskCompleteCheckbox.checked = true
    taskCompleteCheckbox.addEventListener('click', (event) => {
        event.target.checked ? task.completed = true : task.completed = false
        taskSyncLinked(task, 'completed')  // taskSyncLinked synchronizes changes between every task copy
    })

    tagsHeaderContainer.className = 'tags-header-container'

    tagIndicatorsContainer.className = 'tag-indicators-container'  // Indicate selected tags if task minimized

    taskHeader.className = 'task-header'
    taskHeader.type = 'text'
    taskHeader.name = 'task-header'
    taskHeader.placeholder = '[task]'
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
    taskDescription.placeholder = '[description]'
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
    if (task.important) {  // Because a task is always created anew when switching pages, I need to track the indicators added
        const indicator = document.createElement('div')
        indicator.className = 'tag-important'
        indicator.style['background-image'] = 'var(--important-fill-gray)'
        tagIndicatorsContainer.prepend(indicator)
        taskImportantButton.style['background-image'] = 'var(--important-fill-black)'
    }
    taskImportantButton.addEventListener('click', (event) => {
        task.important ? task.important = false : task.important = true
        taskSyncLinked(task, 'important')
    })

    taskTimeButton.classList.add('task-time-button', 'task-tag')
    taskTimeButton.hidden = true
    if (task.hour || task.hour === 0) {
        const indicatorH = document.createElement('div')
        indicatorH.className = 'hour-indicator'
        indicatorH.textContent = task.getHourString()
        tagIndicatorsContainer.append(indicatorH)

        // Update time button
        taskTimeButton.textContent = `${task.getHourString()}:00`
        taskTimeButton.style['background-image'] = 'var(--time-add-fill)'
        if (task.minute) {
            const indicatorM = document.createElement('div')
            indicatorM.className = 'minute-indicator'
            indicatorM.textContent = task.getMinuteString()
            tagIndicatorsContainer.append(indicatorM)

            taskTimeButton.textContent = `${task.getHourString()}:${task.getMinuteString()}`
        }
    } else {
        taskTimeButton.style['background-image'] = 'revert-layer'
        taskTimeButton.textContent = 'Time'
    }
    
    taskTimeButton.addEventListener('click', () => {
        if (taskTimePicker.hidden) {
            taskTimePicker.hidden = false
            taskTimePicker.focus()
        } else {
            taskTimePicker.hidden = true
        }
    })
    taskTimeButton.addEventListener('keydown', (event) => {
        // Allow to delete a time marking
        if (event.key === 'Backspace') {
            taskTimeButton.textContent = 'Date'
            taskTimeButton.style = 'revert-layer'
            taskTimePicker.hidden = true
            taskTimeButton.blur()

            task.hour = undefined
            task.minute = 0
        }
    })
    
    taskTimePicker.hidden = true
    taskTimePicker.setAttribute('tabindex', 0)  // Allows focus on time picker

    taskDateButton.classList.add('task-date-button', 'task-tag')
    taskDateButton.hidden = true
    if (task.date) {
        taskDateButton.textContent = task.date.toLocaleString('en-de', { day: '2-digit', month: 'short', year:'2-digit' })
        taskDateButton.style.setProperty('background-image', 'var(--calendar-add-fill)')
    } else {
        taskDateButton.textContent = 'Date'
        taskDateButton.addEventListener('click', () => {
            taskDatePicker.hidden ? taskDatePicker.hidden = false : taskDatePicker.hidden = true
        })
    }
    taskDateButton.addEventListener('keydown', (event) => {
        // Allow date marking deletion
        if (event.key === 'Backspace') {
            taskSyncLinked(task, 'date', event)
        }
    })

    taskDatePicker.classList.add('task-date-picker', 'date-picker')
    taskDatePicker.hidden = true
    taskDatePicker.setAttribute('tabindex', 0)  // Allows focus on date picker

    // Hide time and date picker when clicked outside or Escaped
    document.addEventListener('click', (event) => {
        if (taskTimePicker.hidden === false && !event.target.closest('div.hour-minute-container') && !event.target.classList.contains('task-time-button') 
            && !event.target.classList.contains('hour-select') && !event.target.classList.contains('minute-select')) {
            taskTimePicker.hidden = true
        }
    })
    document.addEventListener('click', (event) => {
        if (taskDatePicker.hidden === false && !event.target.closest('div.date-picker') && !event.target.classList.contains('task-date-button')) {
            taskDatePicker.hidden = true
        }
    })
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            taskDatePicker.hidden = true
            taskTimePicker.hidden = true
        }
    })

    taskRemoveButton.classList.add('task-remove-button', 'task-tag')
    taskRemoveButton.hidden = true
    taskRemoveButton.textContent = 'Delete'
    taskRemoveButton.addEventListener('click', () => {
        removeTask(task)
    })

    taskTagsContainer.append(taskImportantButton, taskTimeButton, taskDateButton, taskRemoveButton)
    tagsHeaderContainer.append(tagIndicatorsContainer, taskHeader)
    taskContainer.append(taskCompleteCheckbox, tagsHeaderContainer, taskDescriptionOpener, taskDescription, taskTagsContainer, taskTimePicker, taskDatePicker)
    
    return taskContainer
}

function getTaskHTML(task) {
    return Array.from(document.querySelectorAll(`[data-id='${task.id}']`))
}

// Sync all HTML elements linked to a specific task
function taskSyncLinked(task, property, event = '') {
    const taskHTML = getTaskHTML(task)
    // Clarification for taskHTML children structure
    const [completed, topLineContainer, opener, description, tags, timePicker, datePicker] = [0, 1, 2, 3, 4, 5, 6]
    taskHTML.forEach(copy => {
        switch(property) {
            case 'header':
                copy.children[topLineContainer].lastChild.value = task.header
                break
            case 'description':
                copy.children[description].value = task.description
                break
            case 'completed':
                if (!task.completed) {
                    copy.children[completed].checked = false
                    copy.children[topLineContainer].lastChild.style['color'] = 'revert-layer'
                    copy.children[topLineContainer].lastChild.style['text-decoration'] = 'revert-layer'
                    copy.children[description].style['text-decoration'] = 'revert-layer'

                    // Save the styling to access later
                    task.style['header-color'] = ''
                    task.style['header-decoration'] = ''
                    task.style['description-decoration'] = '' 
                } else {
                    copy.children[completed].checked = true
                    copy.children[topLineContainer].lastChild.style['color'] = '#767676'
                    copy.children[topLineContainer].lastChild.style['text-decoration'] = '#767676 line-through solid 1px'
                    copy.children[description].style['text-decoration'] = '#767676 line-through solid 0.5px'
                    
                    task.style['header-color'] = '#767676'
                    task.style['header-decoration'] = '#767676 line-through solid 1px'
                    task.style['description-decoration'] = '#767676 line-through solid 0.5px'
                }
                break
            case 'important':
                const indicator = document.createElement('div')
                indicator.className = 'tag-important'
                if (!task.important) {
                    copy.children[tags].children[0].style['background-image'] = 'revert-layer'
                    const tag = copy.children[topLineContainer].firstChild.querySelector('.tag-important')
                    tag.remove()
                } else {
                    copy.children[tags].children[0].style['background-image'] = 'var(--important-fill-black)'
                    indicator.style['background-image'] = 'var(--important-fill-gray)'
                    copy.children[topLineContainer].firstChild.prepend(indicator)
                }
                break
            case 'time-h':
                // Indicate selection in the time picker
                const hours = copy.children[timePicker].querySelectorAll('.hour-select')
                hours.forEach(elem => elem.style['font-weight'] = 'revert-layer')
                event.target.style['font-weight'] = '500'
                event.target.scrollIntoView({behavior: 'smooth', block: 'start'})

                // Update time button
                copy.children[tags].children[1].style['background-image'] = 'var(--time-add-fill)'
                if (task.minute) {
                    copy.children[tags].children[1].textContent = `${task.getHourString()}:${task.getMinuteString()}`
                } else {
                    copy.children[tags].children[1].textContent = `${task.getHourString()}:00`
                }

                // Indicate hh before task header
                const hourCopy = document.createElement('div')
                hourCopy.className = 'hour-indicator'
                hourCopy.textContent = task.getHourString()
                const prevH = copy.children[topLineContainer].firstChild.querySelector('.hour-indicator')
                if (prevH) {
                    prevH.before(hourCopy)
                    prevH.remove()
                } else {
                    copy.children[topLineContainer].firstChild.append(hourCopy)
                }
                break
            case 'time-m':
                // Indicate selection in time picker
                const minutes = copy.children[timePicker].querySelectorAll('.minute-select')
                minutes.forEach(elem => elem.style['font-weight'] = 'revert-layer')
                event.target.style['font-weight'] = '500'
                event.target.scrollIntoView({behavior: 'smooth', block: 'start'})

                // Update time button
                if (task.hour) {
                    copy.children[tags].children[1].textContent = `${task.getHourString()}:${task.getMinuteString()}`
                } else {
                    copy.children[tags].children[1].textContent = `[hh]:${task.getMinuteString()}`
                }

                // Indicate mm before task header
                const minuteCopy = document.createElement('div')
                minuteCopy.className = 'minute-indicator'
                minuteCopy.textContent = task.getMinuteString()
                const prevM = copy.children[1].firstChild.querySelector('.minute-indicator')
                if (prevM) {
                    prevM.before(minuteCopy)
                    prevM.remove()
                } else {
                    copy.children[1].firstChild.append(minuteCopy)
                }
                break
            case 'date':
                if (event.key === 'Backspace') {
                    copy.children[tags].children[2].textContent = 'Date'
                    copy.children[tags].children[2].style = 'revert-layer'
                    copy.children[datePicker].hidden = true
                    copy.children[tags].children[2].blur()

                    const calendarDateContainer = document.querySelector(`.sidebar-right td[time^="${task.dateToString()}"`)
                    revertDateIndicator(calendarDateContainer)
                    task.date = ''
                } else {
                    copy.children[tags].children[2].textContent = task.date.toLocaleString('en-de', { day: '2-digit', month: 'short', year:'2-digit' })
                    copy.children[tags].children[2].style['background-image'] = 'var(--calendar-add-fill)'
                }
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
    if (task.date) {
        const calendarDateContainer = document.querySelector(`.sidebar-right td[time^="${task.dateToString()}"`)
        revertDateIndicator(calendarDateContainer)
    }
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
    Array.from(taskTagsContainer.children).forEach(tag => {
        tag.hidden = true
    })
    taskDescriptionOpener.checked = false
    taskRemoveButton.hidden = true
    taskDatePicker.hidden = true
}

export { taskElementCreate, getTaskHTML, taskSyncLinked, removeTask }