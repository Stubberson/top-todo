import { viewCurrent } from '../index.js'
import { Project } from './project-class.js'
import { Task } from '../task/task-class.js'
import { taskCreate, tasksFilter } from '../task/task-dom.js'
import { viewToday } from '../sidebar/today-dom.js'
import { currentDate, clearContent } from '../utilities/utility.js'
import { viewImportant } from '../sidebar/important-dom.js'

// --- Project DOM control ---

const projectsList = document.querySelector('ul.projects-list')
const projectContainer = document.querySelector('div.content-container')

function createProject() {
    let project = undefined;

    (function projectBase() {
        const projectHeader = document.createElement('input')
        const projectDescription = document.createElement('textarea')
        const projectDueDate = document.createElement('input')

        project = new Project(projectHeader, projectDescription, projectDueDate)
        listProject(project)
    })();

    (function projectDetails() {
        project.infoContainer = document.createElement('div')
        const [projectButtonHeader, projectButtonDate] = project.projectButton.children

        project.infoContainer.className = 'project-info-container'

        project.header.type = 'text'
        project.header.className = 'project-header-content'
        project.header.name = 'project-header-content'
        project.header.placeholder = 'Add header...'
        project.header.autocomplete = 'off'
        project.header.addEventListener('input', () => {  // Update project header when header edited in content view
            if (project.header.value.length > 25) {
                projectButtonHeader.textContent = project.header.value.slice(0, 25) + '...'
            } else {
                projectButtonHeader.textContent = project.header.value
            }
            project.header.value = project.header.value
        })

        project.description.classList.add('project-description-area', 'description')
        project.description.placeholder = 'Add project description...'
        project.description.rows = 3
        project.description.name = 'project-description-area'
        project.description.addEventListener('input', () => {
            project.description.value = project.description.value
        })

        project.dueDate.type = 'date'
        project.dueDate.className = 'project-date-content'
        project.dueDate.name = 'project-date-content'
        project.dueDate.min = currentDate
        project.dueDate.addEventListener('input', () => {
            projectButtonDate.textContent = project.dueDate.value
            project.dueDate.value = project.dueDate.value
        });

        project.infoContainer.append(project.header, project.description, project.dueDate);
        projectContainer.append(project.infoContainer)
    })();

    (function createTaskControls() {
        project.tabsContainer = document.createElement('div')
        project.controlsContainer = document.createElement('div')
        const tasksContainer = document.querySelector('div.tasks-container')
        
        const taskNewButton = document.createElement('button')
        const taskAllButton = document.createElement('button')
        const taskImportantButton = document.createElement('button')

        project.tabsContainer.className = 'task-tabs-container'
        project.controlsContainer.className = 'tasks-controls-container'

        taskNewButton.className = 'task-new-button'
        taskNewButton.addEventListener('click', () => {
            let task = taskCreate(project)
            tasksContainer.append(task.container)
            task.header.focus()  // Focus task description after creation
        })

        taskAllButton.id = 'task-control-all'
        taskAllButton.className = 'task-control-button'
        taskAllButton.textContent = 'All'
        taskAllButton.disabled = true
        taskAllButton.addEventListener('click', (event) => {
            tasksFilter('all', project, tasksContainer)
            event.target.disabled = true
            taskImportantButton.disabled = false
        })

        taskImportantButton.id = 'task-control-important'
        taskImportantButton.className = 'task-control-button'
        taskImportantButton.textContent = 'Important'
        taskImportantButton.addEventListener('click', (event) => {
            tasksFilter('important', project, tasksContainer)
            event.target.disabled = true
            taskAllButton.disabled = false
        })

        project.tabsContainer.append(taskAllButton, taskImportantButton)
        project.controlsContainer.append(taskNewButton, project.tabsContainer)
        
        projectContainer.append(project.controlsContainer)
    })();
};

function listProject(project) {    
    const projectListing = document.createElement('li')
    const projectButton = document.createElement('button')
    const projectButtonHeader = document.createElement('span')
    const projectButtonDate = document.createElement('span')
    const projectRemoveButton = document.createElement('button')

    projectButton.id = 'listing-button'
    projectButtonHeader.id = 'listing-header'
    projectButtonDate.id = 'listing-date'
    projectRemoveButton.id = 'listing-rm-button'

    if (project.header.length > 25) {
        projectButtonHeader.textContent = project.header.value.slice(0, 25) + '...'
    } else {
        projectButtonHeader.textContent = project.header.value
    } 
    projectButtonDate.textContent = project.dueDate.value

    projectButton.append(projectButtonHeader, projectButtonDate)
    project.projectButton = projectButton
    projectListing.append(projectButton, projectRemoveButton)

    projectsList.appendChild(projectListing)

    clearContent(projectContainer)  // Clear content view before opening new project
    projectButton.addEventListener('click', () => {
        viewProject(project)        // Open project from sidebar
        project.header.focus()
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
            if (project.header.value === document.querySelector('.project-header-content').value) {
                // Default to immediate sibling project, finally Today
                const projectIndex = Project.memory.indexOf(project)
                if (Project.memory.length > 1 && projectIndex < Project.memory.length - 1) {
                    const followingProject = Project.memory[projectIndex + 1]
                    viewProject(followingProject)
                } else if (Project.memory.length > 1 && projectIndex === Project.memory.length - 1) {
                    const previousProject = Project.memory[projectIndex - 1]
                    viewProject(previousProject)
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
    projectsList.removeChild(projectListing)

    // Remove project related tasks
    const projectTasks = project.tasks
    projectTasks.forEach(task => Task.memory.splice(Task.memory.indexOf(task), 1))
    
    // Remove project from mem
    const projectIndex = Project.memory.indexOf(project)
    Project.memory.splice(projectIndex, 1)

    // Update content after removal
    switch (viewCurrent) {
        case 'today':
            viewToday()
            break
        case 'important':
            viewImportant()
            break
    }
};

function viewProject(project) {
    clearContent(projectContainer)  // Clear previous content

    project.tasks.forEach(task => tasksContainer.append(task.container))
    projectContainer.append(project.infoContainer, project.controlsContainer, tasksContainer)
}

export { projectContainer, createProject }