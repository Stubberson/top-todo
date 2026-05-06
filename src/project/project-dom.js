import { currentView } from '../index.js'
import { Project } from './project-class.js'
import { Task } from '../task/task-class.js'
import { taskElementCreate, tasksFilter } from '../task/task-dom.js'
import { viewToday } from '../sidebar-left/today-dom.js'
import { clearContent } from '../utilities/utility.js'
import { createCalendar } from '../sidebar-right/calendar-dom.js'
import { viewImportant } from '../sidebar-left/important-dom.js'

// --- Project DOM control ---
function viewProject(project) {
    const element = projectElementCreate(project)
    
    const contentContainer = document.querySelector('div.content-container')
    clearContent(contentContainer)
    contentContainer.append(element)
    
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
    projectHeader.addEventListener('input', () => {
        project.header = projectHeader.value
        const listingButtonHeader = document.querySelector(`span[data-id='${project.id}']`)
        listingButtonHeader.textContent = project.header
    })

    projectDescription.classList.add('project-description-area', 'description')
    projectDescription.placeholder = 'Add project description...'
    projectDescription.rows = 3
    projectDescription.name = 'project-description-area'
    projectDescription.addEventListener('input', () => {
        project.description = projectDescription.value
    })

    projectDateContainer.className = 'project-date-container'

    projectDateButton.className = 'project-date-button'
    projectDateButton.textContent = 'Date'
    projectDateButton.addEventListener('click', () => {
        projectDatePicker.hidden ? projectDatePicker.hidden = false : projectDatePicker.hidden = true
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
    if (project.date) projectButtonDate.textContent = project.date.toString().splice(0, 10)

    projectButton.append(projectButtonHeader, projectButtonDate)
    projectListing.append(projectButton, projectRemoveButton)

    projectsList.appendChild(projectListing)

    projectButton.addEventListener('click', () => {
        projectElementCreate(project)
    })

    projectRemoveButton.addEventListener('click', () => {
        projectRemoveButton.hidden = true
        
        const confirmRemove = document.createElement('button')
        confirmRemove.className = 'project-remove-confirm'
        projectListing.append(confirmRemove)
        confirmRemove.focus()
        
        // Confirm project removal
        confirmRemove.addEventListener('click', () => {
            removeProjectListing(projectListing, project)
        })

        // If user doesn't confirm removal, cancel
        confirmRemove.addEventListener('blur', () => {
            confirmRemove.remove()
            projectRemoveButton.hidden = false
        })
    })
};

function removeProjectListing(projectListing, project) {
    // Remove project from sidebar
    const projectsList = document.querySelector('ul.projects-list')
    projectsList.removeChild(projectListing)

    // Remove project related tasks
    const projectTasks = project.tasks
    projectTasks.forEach(task => Task.memory.splice(Task.memory.indexOf(task), 1))
    
    // Remove project from mem
    const projectIndex = Project.memory.indexOf(project)
    Project.memory.splice(projectIndex, 1)

    // Update content after removal
    switch (currentView) {
        case 'today':
            viewToday()
            break
        case 'important':
            viewImportant()
            break
    }
};

export { viewProject }