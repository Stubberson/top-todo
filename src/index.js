import './style.css'
import { viewToday } from './sidebar-left/today-dom.js'
import { viewImportant } from './sidebar-left/important-dom.js'
import { viewCompleted } from './sidebar-left/completed-dom.js'
import { viewCalendar } from './sidebar-right/calendar-dom.js'
import { Project } from './project/project-class.js'
import { viewProject } from './project/project-dom.js'

let currentView = [];  // Track currently open view

(() => {  // Default view
    viewToday()
    viewCalendar()
})();

(function listenIndexEvents() {
    const tasksToday = document.querySelector('button#today-all')
    const tasksImportant = document.querySelector('button#important-all')
    const tasksCompleted = document.querySelector('button#completed-all')
    const projectNew = document.querySelector('button#new-project')
    const toggleLeft = document.querySelector('button#toggle-left')
    const toggleRight = document.querySelector('button#toggle-right')

    tasksToday.addEventListener('click', () => {
        viewToday()
    })

    tasksImportant.addEventListener('click', () => {
        viewImportant()
    })

    tasksCompleted.addEventListener('click', () => {
        viewCompleted()
    })

    projectNew.addEventListener('click', () => {
        viewProject(new Project())
    })

    toggleLeft.addEventListener('click', (event) => {
        toggleLeftSidebar(event)
    })

    toggleRight.addEventListener('click', (event) => {
        toggleRightSidebar(event)
    })
})();

const body = document.querySelector('body')
let leftMinimized = false
function toggleLeftSidebar(event) {
    const arrow = document.querySelector('svg#chevron-left')
    const listedProjects = document.querySelectorAll('li')
    const lButton = document.querySelector('button#toggle-left')
    // Close
    if (!leftMinimized) {
        body.style.setProperty('--left', '40px')
        listedProjects.forEach(project => project.lastChild.hidden = true)
        lButton.style['background-image'] = 'var(--l-panel-closed)'
        lButton.classList.add('closed')
        leftMinimized = true
    } else {
        body.style.setProperty('--left', '300px')
        listedProjects.forEach(project => project.lastChild.hidden = false)
        lButton.style['background-image'] = 'revert-layer'
        lButton.classList.remove('closed')
        leftMinimized = false
    }
}

let rightMinimized = false
function toggleRightSidebar(event) {
    const sidebarRight = document.querySelector('.sidebar-right')
    const calendarContainer = document.querySelector('.sidebar-right > .calendar-container')
    const dateContainer = document.querySelector('div.date-container')
    const rButton = document.querySelector('button#toggle-right')
    // Close
    if (!rightMinimized) {
        body.style.setProperty('--right', '40px')
        calendarContainer.style['display'] = 'none'
        dateContainer.style['display'] = 'none'
        rButton.style['background-image'] = 'var(--r-panel-closed)'
        rightMinimized = true
    } else {
        body.style.setProperty('--right', '300px')
        rButton.style['background-image'] = 'revert-layer'
        calendarContainer.style['display'] = 'revert-layer'
        dateContainer.style['display'] = 'revert-layer'
        rightMinimized = false
    }
}

export { currentView }