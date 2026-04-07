import { Project } from './project-class.js'
import { taskCreate } from '../task/create-task.js'
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
    const projectTitle = document.querySelector('form > input.project-title')
    const projectDescription = document.querySelector('form > input.project-description')
    const projectPriority = document.querySelector('form > select')
    
    const newProject = new Project(projectTitle.value, projectDescription.value, dueDate.value, projectPriority.value)

    listProject(newProject)
    
    projectForm.reset()  // Reset form after project created
};

function listProject(project) {    
    const listItem = document.createElement('li')
    const textContainer = document.createElement('button')
    const listItemTitle = document.createElement('span')
    const listItemDate = document.createElement('span')
    const removeItemButton = document.createElement('button')
    
    textContainer.id = 'li-button'
    listItemTitle.id = 'li-title'
    listItemDate.id = 'li-date'
    removeItemButton.id = 'li-rm-button'

    listItemTitle.textContent = project.getTitle
    listItemDate.textContent = project.getDate

    textContainer.append(listItemTitle, listItemDate)
    listItem.append(textContainer, removeItemButton)

    projectsList.appendChild(listItem)

    clearContent(projectContainer)                     // Clear content view before opening new project
    viewProject(project, listItemTitle, listItemDate)  // Open project after creation
    
    textContainer.addEventListener('click', () => {
        clearContent(projectContainer)
        viewProject(project, listItemTitle, listItemDate)  // Allow to open project from sidebar
    })

    removeItemButton.addEventListener('click', () => {
        // WOULD BE A GOOD IDEA TO ADD A CONFIRMATION POPUP!

        // Only clear content if currently viewed project is removed
        if (project.getTitle === projectContainer.firstChild.value) {
            clearContent(projectContainer)
            viewToday()  // If viewed project removed, default to today
        }
        removeProject(listItem, project)
    })
};

function viewProject(project, listItemTitle, listItemDate) {
    const projectHeader = document.createElement('input')
    const projectDescription = document.createElement('textarea')
    const projectDueDate = document.createElement('input')
    const projectPriority = document.createElement('select')

    const taskControlsContainer = document.createElement('div')

    ;(function copyProjectInfo() {  // Without leading semicolon, parser throws an error
        projectHeader.id = 'content-project-title'
        projectHeader.type = 'text'
        projectHeader.className = 'project-title'
        projectHeader.autocomplete = 'off'
        projectHeader.value = project.getTitle
        projectHeader.addEventListener('input', () => {  // Update project header when header edited in content view
            listItemTitle.textContent = projectHeader.value
            project.setTitle = projectHeader.value
        })

        projectDescription.id = 'project-description-area'
        projectDescription.placeholder = 'Add project description...'
        projectDescription.rows = 3
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
            listItemDate.textContent = projectDueDate.value
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
            let taskDescription = taskCreate(projectContainer)
            taskDescription.focus()  // Focus task description after creation
        })

        taskControlsContainer.append(taskAllButton, taskImportantButton, taskNewButton)
    })();
    
    projectContainer.append(projectHeader, projectDescription, projectDueDate, projectPriority, taskControlsContainer)
};

function removeProject(listItem, project) {
    projectsList.removeChild(listItem)             // Remove from DOM
    const index = Project.memory.indexOf(project)  // Remove from mem
        if (index > -1) { // Only remove if project found
            Project.memory.splice(index, 1)
        }
};

export { projectContainer, projectDialog, createProject }