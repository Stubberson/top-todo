import { Project } from './project-class.js'
import { taskCreate } from '../task/task-dom.js'
import { viewToday } from '../today/today-dom.js'
import { currentDate, clearContent } from '../utilities/utility.js'

// --- Project DOM control ---

const projectsList = document.querySelector('ul.projects-list')
const projectContainer = document.querySelector('div.content-container')
const projectForm = document.querySelector('form')
const projectDialog = document.querySelector('dialog.dialog-project')
const dueDate = document.querySelector('#dialog-due-date')
dueDate.min = currentDate  // Do not allow setting due dates into the past

function createProject() {
    const projectHeader = document.querySelector('form input.project-header')
    const projectDescription = document.querySelector('form > input.project-description')
    const projectPriority = document.querySelector('form > select')
    
    const newProject = new Project(projectHeader.value, projectDescription.value, dueDate.value, projectPriority.value)

    listProject(newProject)
    
    projectForm.reset()  // Reset form after project created
};

function listProject(project) {    
    const projectListing = document.createElement('li')
    const projectButton = document.createElement('button')
    const projectButtonHeader = document.createElement('span')
    const projectButtonDate = document.createElement('span')
    const projectRemoveButton = document.createElement('button')
    
    projectButton.id = 'li-button'
    projectButtonHeader.id = 'li-title'
    projectButtonDate.id = 'li-date'
    projectRemoveButton.id = 'li-rm-button'

    projectButtonHeader.textContent = project.getHeader
    projectButtonDate.textContent = project.getDate

    projectButton.append(projectButtonHeader, projectButtonDate)
    projectListing.append(projectButton, projectRemoveButton)

    projectsList.appendChild(projectListing)

    clearContent(projectContainer)  // Clear content view before opening new project
    viewProject(project, projectButtonHeader, projectButtonDate)  // Open project after creation
    
    projectButton.addEventListener('click', () => {
        clearContent(projectContainer)
        viewProject(project, projectButtonHeader, projectButtonDate)  // Allow to open project from sidebar
    })

    projectRemoveButton.addEventListener('click', () => {
        // WOULD BE A GOOD IDEA TO ADD A CONFIRMATION POPUP!
        // Only clear content if currently viewed project is removed
        if (project.getHeader === projectContainer.firstChild.value) {
            clearContent(projectContainer)
            viewToday()  // If viewed project removed, default to today
        }
        removeProject(projectListing, project)
    })
};

function viewProject(project, projectButtonHeader, projectButtonDate) {
    const projectHeader = document.createElement('input')
    const projectDescription = document.createElement('textarea')
    const projectDueDate = document.createElement('input')
    const projectPriority = document.createElement('select')

    const taskControlsContainer = document.createElement('div')

    ;(function copyProjectInfo() {  // Without leading semicolon, parser throws an error
        projectHeader.id = 'content-project-header'
        projectHeader.type = 'text'
        projectHeader.className = 'project-header'
        projectHeader.placeholder = 'Add header...'
        projectHeader.autocomplete = 'off'
        projectHeader.value = project.getHeader
        projectHeader.addEventListener('input', () => {  // Update project header when header edited in content view
            projectButtonHeader.textContent = projectHeader.value
            project.setHeader = projectHeader.value
        })

        projectDescription.classList.add('project-description-area', 'description')
        projectDescription.placeholder = 'Add project description...'
        projectDescription.rows = 3
        projectDescription.name = 'project-description-area'
        projectDescription.textContent = project.getDescription
        projectDescription.addEventListener('input', () => {
            project.setDescription = projectDescription.value
        })
        // Create priority options for project content view
        const priorityOptions = [
            { value: "", text: "Priority" },
            { value: "high", text: "Urgent" },
            { value: "medium", text: "Upcoming" },
            { value: "low", text: "Someday" }
        ]
        priorityOptions.forEach(opt => {
            const option = document.createElement('option')
            option.value = opt.value
            option.textContent = opt.text
            projectPriority.appendChild(option)
        })

        projectDueDate.id = 'content-due-date'
        projectDueDate.type = 'date'
        projectDueDate.className = 'due-date'
        projectDueDate.min = currentDate
        projectDueDate.value = project.getDate
        projectDueDate.addEventListener('input', () => {
            projectButtonDate.textContent = projectDueDate.value
            project.setDate = projectDueDate.value
        })
        
        projectPriority.id = 'content-priority-selection'
        projectPriority.className = 'priority-selection'
        projectPriority.value = project.getPriority
        projectPriority.addEventListener('input', () => {
            project.setPriority = projectPriority.value
        })
    })()

    ;(function taskCreateControls() {
        const taskAllButton = document.createElement('button')
        const taskImportantButton = document.createElement('button')
        const taskNewButton = document.createElement('button')

        taskControlsContainer.className = 'task-controls-container'

        taskAllButton.id = 'task-control-all'
        taskAllButton.className = 'task-control-button'
        taskAllButton.textContent = 'All'
        taskAllButton.addEventListener('click', () => {
            taskViewAll(projectContainer)
        })

        taskImportantButton.id = 'task-control-important'
        taskImportantButton.className = 'task-control-button'
        taskImportantButton.textContent = 'Important'
        taskImportantButton.addEventListener('click', () => {
            taskViewImportant(projectContainer)
        })

        taskNewButton.id = 'task-new-button'
        taskNewButton.className = 'task-control-button'
        taskNewButton.addEventListener('click', () => {
            let newTask = taskCreate(project)
            projectContainer.append(newTask.getContainer)
            newTask.getHeader.focus()  // Focus task description after creation
        })

        taskControlsContainer.append(taskAllButton, taskImportantButton, taskNewButton)
    })();
    
    // Add a project with its tasks to the DOM
    projectContainer.append(projectHeader, projectDescription, projectDueDate, projectPriority, taskControlsContainer)

    let projectTasks = project.getTasks
    projectTasks.forEach(task => projectContainer.append(task))
};

function removeProject(projectListing, project) {
    projectsList.removeChild(projectListing)             // Remove from DOM
    const index = Project.memory.indexOf(project)  // Remove from mem
        if (index > -1) { // Only remove if project found
            Project.memory.splice(index, 1)
        }
};

export { projectContainer, projectDialog, createProject }