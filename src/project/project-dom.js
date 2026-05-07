import { currentView } from '../index.js'
import { Project } from './project-class.js'
import { Task } from '../task/task-class.js'
import { taskElementCreate, tasksFilter } from '../task/task-dom.js'
import { viewToday } from '../sidebar-left/today-dom.js'
import { clearContent, trackView } from '../utilities/utility.js'
import { createCalendar } from '../sidebar-right/calendar-dom.js'
import { viewImportant } from '../sidebar-left/important-dom.js'

// --- Project DOM control ---
const contentContainer = document.querySelector('div.content-container')

function viewProject(project) {
    trackView(`project-${project.id}`)
    renderProject(project)
    listProject(project)
}

function projectElementCreate(project) {
    const projectContainer = document.createElement('div')
    const projectHeadContainer = document.createElement('div')
    const projectHeader = document.createElement('input')
    const projectDescription = document.createElement('textarea')
    const projectDateContainer = document.createElement('div')
    const projectDateButton = document.createElement('button')
    const projectDatePicker = createCalendar()
    const taskNewButton = document.createElement('button')
    const projectTasksContainer = document.createElement('div')

    projectContainer.className = 'project-container'
    projectContainer.setAttribute('data-id', project.id)

    projectHeadContainer.className = 'project-head-container'

    projectHeader.type = 'text'
    projectHeader.className = 'project-header'
    projectHeader.name = 'project-header'
    projectHeader.placeholder = 'Add header...'
    projectHeader.autocomplete = 'off'
    if (project.header) projectHeader.value = project.header
    projectHeader.addEventListener('input', () => {
        project.header = projectHeader.value
        const listingButtonHeader = document.querySelector(`span[data-id='${project.id}']`)
        listingButtonHeader.textContent = project.header
    })

    projectDescription.classList.add('project-description-area', 'description')
    projectDescription.placeholder = 'Add description...'
    projectDescription.rows = 3
    projectDescription.name = 'project-description-area'
    if (project.description) projectDescription.textContent = project.description
    projectDescription.addEventListener('input', () => {
        project.description = projectDescription.value
    })

    projectDateContainer.className = 'project-date-container'

    projectDateButton.className = 'project-date-button'
    projectDateButton.textContent = 'Date'
    if (project.date) {
        projectDateButton.textContent = project.getDateString()
        projectDateButton.style.setProperty('background-image', 'var(--calendar-add-fill)')
    }
    projectDateButton.addEventListener('click', () => {
        if (projectDatePicker.hidden) {
            projectDatePicker.hidden = false
            projectDatePicker.focus()
        } else {
            projectDatePicker.hidden = true
        }
    })
    projectDateButton.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') {
            projectDateButton.textContent = 'Date'
            projectDateButton.style = 'revert-layer'
            const listingButtonDate = document.querySelector(`.listing-date[data-id='${project.id}']`)
            listingButtonDate.textContent = ''
            projectDatePicker.hidden = true
            projectDateButton.blur()
        }
    })

    projectDatePicker.classList.add('project-date-picker', 'date-picker')
    projectDatePicker.hidden = true
    projectDatePicker.setAttribute('tabindex', 0)
    // Hide date picker when clicked outside or Escaped
    document.addEventListener('click', (event) => {
        if (projectDatePicker.hidden === false && !event.target.closest('div.project-date-picker') && !event.target.classList.contains('project-date-button')) {
            projectDatePicker.hidden = true
        }
    })
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            projectDatePicker.hidden = true
        }
    })

    taskNewButton.className = 'task-new-button'
    taskNewButton.addEventListener('click', () => {
        const task = new Task('', project)
        const element = taskElementCreate(task)
        projectTasksContainer.append(element)
        element.children[1].focus()
    })

    projectTasksContainer.className = 'project-tasks-container'
    if (project.tasks) project.tasks.forEach(task => projectTasksContainer.append(taskElementCreate(task)))

    projectDateContainer.append(projectDateButton)
    projectHeadContainer.append(projectHeader, projectDescription, projectDateContainer, projectDatePicker)
    projectContainer.append(projectHeadContainer, taskNewButton, projectTasksContainer)

    return projectContainer
};

function listProject(project) {
    const projectsList = document.querySelector('ul.projects-list')

    const projectListing = document.createElement('li')
    const projectButton = document.createElement('button')
    const projectButtonHeader = document.createElement('span')
    const projectButtonDate = document.createElement('span')
    const projectRemoveButton = document.createElement('button')

    projectButton.className = 'listing-button'
    projectButtonHeader.className = 'listing-header'
    projectButtonHeader.setAttribute('data-id', project.id)
    projectButtonDate.className = 'listing-date'
    projectButtonDate.setAttribute('data-id', project.id)
    projectRemoveButton.className = 'listing-rm-button'

    projectButtonHeader.textContent = project.header
    if (project.date) {
        projectButtonDate.textContent = project.date.toLocaleString('en-de', { day: '2-digit', month: 'short', year: '2-digit' })
    }

    projectButton.append(projectButtonHeader, projectButtonDate)
    projectListing.append(projectButton, projectRemoveButton)

    projectsList.appendChild(projectListing)

    projectButton.addEventListener('click', () => {
        renderProject(project)
        trackView(`project-${project.id}`)
    })

    projectRemoveButton.addEventListener('click', (event) => {
        projectRemoveButton.hidden = true
        
        const confirmRemove = document.createElement('button')
        confirmRemove.className = 'project-remove-confirm'
        projectListing.append(confirmRemove)
        confirmRemove.focus()
        
        // Confirm project removal
        confirmRemove.addEventListener('click', () => {
            removeProject(projectListing, project)
            if (Project.memory.length > 0 && currentView[0].includes(project.id)) {
                renderProject(Project.memory[0])
            } else if (Project.memory.length === 0) {
                viewToday()
            }
        })

        // If user doesn't confirm removal, cancel
        confirmRemove.addEventListener('blur', () => {
            confirmRemove.remove()
            projectRemoveButton.hidden = false
        })
    })
};

function removeProject(projectListing, project) {
    // Remove project from sidebar
    const projectsList = document.querySelector('ul.projects-list')
    projectsList.removeChild(projectListing)

    // Remove project related tasks
    const projectTasks = project.tasks
    projectTasks.forEach(task => Task.memory.splice(Task.memory.indexOf(task), 1))
    
    // Remove project from mem
    const projectIndex = Project.memory.indexOf(project)
    Project.memory.splice(projectIndex, 1)
};

function renderProject(project) {
    const element = projectElementCreate(project)

    clearContent(contentContainer)
    contentContainer.append(element)
    const projectHeader = element.querySelector('.project-header')
    projectHeader.focus()
}

export { viewProject }