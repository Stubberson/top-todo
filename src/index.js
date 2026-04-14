import './style.css'
import { viewToday } from './sidebar/today-dom.js'
import { viewImportant } from './sidebar/important-dom.js'
import { createProject } from './project/project-dom.js'

let viewCurrent = undefined;  // Track currently open view

(() => {
    viewToday()
})();

(function listenIndexEvents() {
    const todayTasks = document.querySelector('button#today-all')
    const importantTasks = document.querySelector('button#important-all')
    const newProjectButton = document.querySelector('button#new-project')

    todayTasks.addEventListener('click', () => {
        viewToday()
        viewCurrent = 'today'
    })

    importantTasks.addEventListener('click', () => {
        viewImportant()
        viewCurrent = 'important'
    })

    newProjectButton.addEventListener('click', () => {
        createProject()
        document.querySelector('.project-header-content').focus()
        viewCurrent = 'project'
    })
})();

export { viewCurrent }