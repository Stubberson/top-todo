import './style.css'
import { viewToday } from './sidebar-left/today-dom.js'
import { viewImportant } from './sidebar-left/important-dom.js'
import { viewMainCalendar } from './sidebar-right/calendar-dom.js'
import { createCalendar } from './utilities/calendar.js'
import { createProject } from './project/project-dom.js'

let viewCurrent = undefined;  // Track currently open view

const body = document.querySelector('body');

(() => {  // Default view
    viewToday()
    viewMainCalendar()
})();

(function listenIndexEvents() {
    const tasksToday = document.querySelector('button#today-all')
    const tasksImportant = document.querySelector('button#important-all')
    const projectNew = document.querySelector('button#new-project')
    const toggleLeft = document.querySelector('button#toggle-left')

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

    toggleLeft.addEventListener('click', () => {
        // SOMETHINGSOMETHING
    })
})();

export { viewCurrent }