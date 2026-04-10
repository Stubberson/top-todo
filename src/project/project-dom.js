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

    if (project.header.length > 30) {
        projectButtonHeader.textContent = project.header.slice(0, 30) + '...'
    } else {
        projectButtonHeader.textContent = project.header
    } 
    projectButtonDate.textContent = project.date

    projectButton.append(projectButtonHeader, projectButtonDate)
    project.projectButton = projectButton
    projectListing.append(projectButton, projectRemoveButton)

    projectsList.appendChild(projectListing)

    clearContent(projectContainer)  // Clear content view before opening new project
    viewProject(project)            // Open project after creation
    
    projectButton.addEventListener('click', () => {
        clearContent(projectContainer)
        viewProject(project)  // Allow to open project from sidebar
    })

    projectRemoveButton.addEventListener('click', () => {
        // WOULD BE A GOOD IDEA TO ADD A CONFIRMATION POPUP!
        // Only clear content if currently viewed project is removed
        if (project.header === projectContainer.firstChild.value) {
            clearContent(projectContainer)
            let previousProject = Project.memory[Project.memory.indexOf(project) - 1]
            //let followingProject = Project.memory[Project.memory.indexOf(project) + 1]
            if (Project.memory.length > 1) {  // Default to immediate sibling project, otherwise Today
                viewProject(previousProject)
            } else {
                viewToday()
            }
        }
        removeProjectListing(projectListing, project)
    })
};

function viewProject(project) {
    const [projectButtonHeader, projectButtonDate] = project.projectButton.children
    const projectHeader = document.createElement('input')
    const projectDescription = document.createElement('textarea')
    const projectDueDate = document.createElement('input')
    const projectPriority = document.createElement('select')
    
    const taskControlsContainer = document.createElement('div')
    const tasksContainer = document.createElement('div')

    taskControlsContainer.className = 'task-controls-container'
    
    // Populate container with existing tasks (if any)
    tasksContainer.className = 'tasks-container'
    project.tasks.forEach(task => tasksContainer.append(task.container))

    ;(function copyProjectInfo() {  // Without leading semicolon, parser throws an error
        projectHeader.id = 'content-project-header'
        projectHeader.type = 'text'
        projectHeader.className = 'project-header'
        projectHeader.placeholder = 'Add header...'
        projectHeader.autocomplete = 'off'
        projectHeader.value = project.header
        projectHeader.addEventListener('input', () => {  // Update project header when header edited in content view
            if (projectHeader.value.length > 30) {
                projectButtonHeader.textContent = projectHeader.value.slice(0, 30) + '...'
            } else {
                projectButtonHeader.textContent = projectHeader.value
            }
            project.header = projectHeader.value
        })

        projectDescription.classList.add('project-description-area', 'description')
        projectDescription.placeholder = 'Add project description...'
        projectDescription.rows = 3
        projectDescription.name = 'project-description-area'
        projectDescription.textContent = project.description
        projectDescription.addEventListener('input', () => {
            project.description = projectDescription.value
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
        projectDueDate.value = project.date
        projectDueDate.addEventListener('input', () => {
            projectButtonDate.textContent = projectDueDate.value
            project.date = projectDueDate.value
        })
        
        projectPriority.id = 'content-priority-selection'
        projectPriority.className = 'priority-selection'
        projectPriority.value = project.priority
        projectPriority.addEventListener('input', () => {
            project.priority = projectPriority.value
        })
    })()

    ;(function createTaskControls() {
        const tabsAllImportant = document.createElement('div')
        const taskAllButton = document.createElement('button')
        const taskImportantButton = document.createElement('button')
        const taskNewButton = document.createElement('button')

        tabsAllImportant.className = 'task-tabs-container'

        taskNewButton.id = 'task-new-button'
        taskNewButton.className = 'task-control-button'
        taskNewButton.addEventListener('click', () => {
            let newTask = taskCreate(project)
            tasksContainer.append(newTask.container)
            newTask.header.focus()  // Focus task description after creation
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

        tabsAllImportant.append(taskAllButton, taskImportantButton)
        taskControlsContainer.append(taskNewButton, tabsAllImportant)
    })();
    
    // Add project with tasks to DOM
    projectContainer.append(projectHeader, projectDescription, projectDueDate, projectPriority, taskControlsContainer, tasksContainer)
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

export { projectContainer, projectDialog, createProject }