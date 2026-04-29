import './style.css'
import { viewToday } from './sidebar-left/today-dom.js'
import { viewImportant } from './sidebar-left/important-dom.js'
import { viewCalendar } from './sidebar-right/calendar-dom.js'
import { createProject } from './project/project-dom.js'

let currentView = undefined;  // Track currently open view

const body = document.querySelector('body');

(() => {  // Default view
    viewToday()
    viewCalendar()
    currentView = 'today'
})();

(function listenIndexEvents() {
    const tasksToday = document.querySelector('button#today-all')
    const tasksImportant = document.querySelector('button#important-all')
    const projectNew = document.querySelector('button#new-project')
    const toggleLeft = document.querySelector('button#toggle-left')

    tasksToday.addEventListener('click', () => {
        viewToday()
        currentView = 'today'
    })

    tasksImportant.addEventListener('click', () => {
        viewImportant()
        currentView = 'important'
    })

    projectNew.addEventListener('click', () => {
        createProject()
        document.querySelector('.project-header-content').focus()
        currentView = 'project'
    })

    toggleLeft.addEventListener('click', () => {
        // SOMETHINGSOMETHING
    })
})();

export { currentView }