import './style.css'
import { viewToday } from './sidebar/today-dom.js'
import { viewImportant } from './sidebar/important-dom.js'
import { projectContainer, projectDialog, createProject } from './project/project-dom.js'

let viewCurrent = undefined;  // Track currently open view

(() => {
    viewToday()
})();

(function listenIndexEvents() {
    const todayTasks = document.querySelector('button#button-today-all')
    const importantTasks = document.querySelector('button#button-important-all')
    const newProjectButton = document.querySelector('button#new-project')
    const closeDialogButton = document.querySelector('button#dialog-close')
    const submitDialogButton = document.querySelector('button#dialog-submit')

    todayTasks.addEventListener('click', () => {
        viewToday()
        viewCurrent = 'today'
    })

    importantTasks.addEventListener('click', () => {
        viewImportant()
        viewCurrent = 'important'
    })

    newProjectButton.addEventListener('click', () => {
        projectDialog.showModal()
    })

    closeDialogButton.addEventListener('click', () => {
        projectDialog.close()
    })

    submitDialogButton.addEventListener('click', (event) => {
        event.preventDefault()  // Prevent form sending data to server
        createProject()
        projectDialog.close()
        projectContainer.querySelector('button#task-new-button').focus()  // Focus the new task button
        viewCurrent = 'project'
    })
})();

export { viewCurrent }