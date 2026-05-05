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
    listProject(project)
    const contentContainer = document.querySelector('div.content-container')
    clearContent(contentContainer)
    contentContainer.append(element)
}

function projectElementCreate(project) {
    const projectContainer = document.createElement('div')
    const projectHeadContainer = document.createElement('div')
    const projectHeader = document.createElement('input')
    const projectDescription = document.createElement('textarea')
    const projectDateButton = document.createElement('button')
    const projectDatePicker = createCalendar()
    const taskNewButton = document.createElement('button')
    const projectTasksContainer = document.createElement('div')

    projectContainer.className = 'project-container'

    projectHeadContainer.className = 'project-head-container'

    projectHeader.type = 'text'
    projectHeader.className = 'project-header-content'
    projectHeader.name = 'project-header-content'
    projectHeader.placeholder = 'Add header...'
    projectHeader.autocomplete = 'off'
    projectHeader.addEventListener('input', () => {
        // projectButtonHeader.textContent = project.header.value
        project.header = projectHeader.value
    })

    projectDescription.classList.add('project-description-area', 'description')
    projectDescription.placeholder = 'Add project description...'
    projectDescription.rows = 3
    projectDescription.name = 'project-description-area'
    projectDescription.addEventListener('input', () => {
        project.description = projectDescription.value
    })

    projectDateButton.className = 'project-date-button'
    projectDateButton.textContent = 'Date'
    projectDateButton.addEventListener('click', () => {
        if (projectDatePicker.hidden) {
            // Clear the date picker visually
            const allDates = Array.from(projectDatePicker.querySelectorAll('.day'))
            allDates.forEach(day => {
                day.style = 'revert-layer'
            })
            projectDatePicker.hidden = false
        } else {
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

    projectHeadContainer.append(projectHeader, projectDescription, projectDateButton)
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

    projectButton.id = 'listing-button'
    projectButtonHeader.id = 'listing-header'
    projectButtonDate.id = 'listing-date'
    projectRemoveButton.id = 'listing-rm-button'

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
            // Only clear view if currently viewed project removed
            if (project.header === document.querySelector('.project-header-content').value) {
                // Default to immediate sibling project, finally Today
                const projectIndex = Project.memory.indexOf(project)
                if (Project.memory.length > 1 && projectIndex < Project.memory.length - 1) {
                    const followingProject = Project.memory[projectIndex + 1]
                    projectElementCreate(followingProject)
                } else if (Project.memory.length > 1 && projectIndex === Project.memory.length - 1) {
                    const previousProject = Project.memory[projectIndex - 1]
                    projectElementCreate(previousProject)
                } else {
                    viewToday()
                }
            }
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