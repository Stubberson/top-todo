import './style.css'
import { viewToday } from './today/today-dom.js'
import { projectDialog, createProject } from './project/project-dom.js'

(() => {
    viewToday()
})();

(function listenIndexEvents() {
    const todayTasks = document.querySelector('button#button-today')
    const newProjectButton = document.querySelector('button#new-project')
    const closeDialogButton = document.querySelector('button#close-project-dialog')
    const submitDialogButton = document.querySelector('button#submit-project-dialog')

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
        const projectTitle = document.querySelector('form > .project-title')
        if (projectTitle.value.length < 3) {
            event.preventDefault()
            projectTitle.style['outline'] = '1px auto red'
            projectTitle.focus()
        } else {
            createProject()
            projectTitle.style.removeProperty('outline')
        }
    })

})();