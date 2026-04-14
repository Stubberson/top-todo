import './style.css'
import { viewToday } from './sidebar/today-dom.js'
import { viewImportant } from './sidebar/important-dom.js'
import { createProject } from './project/project-dom.js'

let viewCurrent = undefined;  // Track currently open view

(() => {
    viewToday()
})();

(function listenIndexEvents() {
    const tasksToday = document.querySelector('button#today-all')
    const tasksImportant = document.querySelector('button#important-all')
    const projectNew = document.querySelector('button#new-project')

    tasksToday.addEventListener('click', () => {
        viewToday()
        viewCurrent = 'today'
    })

    tasksImportant.addEventListener('click', () => {
        viewImportant()
        viewCurrent = 'important'
    })

    projectNew.addEventListener('click', () => {
        createProject()
        document.querySelector('.project-header-content').focus()
        viewCurrent = 'project'
    })
})();

export { viewCurrent }