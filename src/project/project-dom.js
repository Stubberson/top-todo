import { Project } from './project-class.js'
import { currentDate, clearContent } from '../utilities/utility.js'

// --- Project DOM control ---

const projectsList = document.querySelector('ul.projects-list')
const projectContainer = document.querySelector('div.content-container')
const projectForm = document.querySelector('form')
const projectDialog = document.querySelector('dialog.project-dialog')
const dueDate = document.querySelector('form > input.due-date')
dueDate.min = currentDate

function createProject() {
    const projectTitle = document.querySelector('form > input.project-title').value
    const projectDescription = document.querySelector('form > input.project-description').value
    const dueDate = document.querySelector('form > input.due-date').value
    const projectPriority = document.querySelector('form > select').value
    
    const newProject = new Project(projectTitle, projectDescription, dueDate, projectPriority)

    listProject(newProject)
    
    projectForm.reset()  // Reset form after project created
};

function listProject(project) {    
    const listItem = document.createElement('li')
    const textContainer = document.createElement('button')
    const listItemTitle = document.createElement('span')
    const listItemDate = document.createElement('span')
    const removeItemButton = document.createElement('button')
    
    textContainer.classList.add('project-button')
    listItemTitle.classList.add('li-title')
    listItemDate.classList.add('li-date')
    removeItemButton.id = 'rm-li-btn'

    listItemTitle.textContent = project.getTitle
    listItemDate.textContent = project.getDate

    textContainer.append(listItemTitle, listItemDate)
    listItem.append(textContainer, removeItemButton)

    projectsList.appendChild(listItem)

    clearContent(projectContainer)  // Clear project content before opening new
    viewProject(project)  // Open project after creation
    textContainer.addEventListener('click', () => {
        clearContent(projectContainer)
        viewProject(project)  // Allow to open project from sidebar
    })

    removeItemButton.addEventListener('click', () => {
        // Only clear content if currently viewed project is removed
        if (project.getTitle === projectContainer.firstChild.value) {
            clearContent(projectContainer)
        }
        removeProject(listItem, project)
    })
};

function viewProject(project) {
    const projectHeader = document.createElement('h1')
    const projectDescription = document.createElement('textarea')
    const projectDueDate = document.createElement('input')
    const projectPriority = document.createElement('select')

    projectHeader.textContent = project.getTitle

    projectDescription.textContent = project.getDescription
    projectDescription.name = 'description-area'
    projectDescription.placeholder = 'Add a description for your project...'
    projectDescription.rows = 3

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

    projectDueDate.type = 'date'
    projectDueDate.className = 'due-date'
    projectDueDate.name = 'project-due-date'

    projectPriority.className = 'priority-selection'
    projectPriority.name = 'project-priority'

    projectDueDate.value = project.getDate
    projectPriority.value = project.getPriority
    
    projectContainer.append(projectHeader, projectDescription, projectDueDate, projectPriority)
};



function removeProject(listItem, project) {
    projectsList.removeChild(listItem)
    const index = Project.memory.indexOf(project);
        if (index > -1) { // Only remove if project found
            Project.memory.splice(index, 1)
        }
};

export { projectDialog, createProject }