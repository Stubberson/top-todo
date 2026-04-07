import './style.css'
import { viewToday } from './today/today-dom.js'
import { projectContainer, projectDialog, createProject } from './project/project-dom.js'

(() => {
    viewToday()
})();

(function listenIndexEvents() {
    const todayTasks = document.querySelector('button#button-today')
    const newProjectButton = document.querySelector('button#new-project')
    const closeDialogButton = document.querySelector('button#dialog-close')
    const submitDialogButton = document.querySelector('button#dialog-submit')

    todayTasks.addEventListener('click', () => {
        viewToday()
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
    })
})();