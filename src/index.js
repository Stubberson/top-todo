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

let leftMinimized = false
function toggleLeftSidebar(event) {
    const body = document.querySelector('body')
    const arrow = document.querySelector('svg#chevron-left')
    // Close
    if (!leftMinimized) {
        body.style.setProperty('--left', '40px')
        arrow.style['transform'] = 'rotate(180deg)'
        leftMinimized = true
    } else {
        body.style.setProperty('--left', '300px')
        arrow.style['transform'] = 'revert-layer'
        leftMinimized = false
    }
}

let rightMinimized = false
function toggleRightSidebar(event) {
    const body = document.querySelector('body')
    const sidebarRight = document.querySelector('.sidebar-right')
    const calendarContainer = document.querySelector('div.calendar-container')
    const dateContainer = document.querySelector('div.date-container')
    const arrow = document.querySelector('svg#chevron-right')
    // Close
    if (!rightMinimized) {
        body.style.setProperty('--right', '40px')
        arrow.style['transform'] = 'rotate(180deg)'
        calendarContainer.style['display'] = 'none'
        dateContainer.style['display'] = 'none'
        rightMinimized = true
    } else {
        body.style.setProperty('--right', '300px')
        arrow.style['transform'] = 'revert-layer'
        calendarContainer.style['display'] = 'revert-layer'
        dateContainer.style['display'] = 'revert-layer'
        rightMinimized = false
    }
}

export { currentView }