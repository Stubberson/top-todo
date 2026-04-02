import { Project } from './project-class.js'
import { currentDate, clearContent } from '../utilities/utility.js'
import { editor } from '../utilities/cm.js'

// --- Project DOM control ---

const projectContainer = document.querySelector('div.content-container')
const projectDialog = document.querySelector('dialog.project-dialog')
const dueDate = document.querySelector('form > input.due-date')
dueDate.min = currentDate

function viewProject(project) {
    const projectHeader = document.createElement('h1')

    projectHeader.textContent = project.getTitle

    editor.dispatch({ changes: {from: 0, insert: project.getDescription} })  // Add an editable description for the project

    const projectDueDate = document.createElement('input')
    const projectPriority = document.createElement('select')
    
    const priorityOptions = [
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
    
    projectContainer.append(projectHeader, editor.dom, projectDueDate, projectPriority)
};

function listProject(project) {
    const projectsList = document.querySelector('ul.projects-list')
    
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
}

function createProject() {
    const projectTitle = document.querySelector('form > input#title').value
    const projectDescription = document.querySelector('form > input#description').value
    const dueDate = document.querySelector('form > input.due-date').value
    const projectPriority = document.querySelector('form > select').value
    
    const newProject = new Project(projectTitle, projectDescription, dueDate, projectPriority)

    listProject(newProject)
};

export { projectDialog, createProject }