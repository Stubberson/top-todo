import './style.css'
import { Project } from './project/project-class.js'
import { listProject } from './project/project-dom.js'
import { currentDate } from './utilities/utility.js'

(function toggleProjectDialog() {
    const projectDialog = document.querySelector('dialog.project-dialog')
 
    const dueDate = document.querySelector('form > input.due-date')
    dueDate.min = currentDate
 
    const newProjectButton = document.querySelector('button#new-project')
    newProjectButton.addEventListener('click', () => {
        projectDialog.showModal()
    })

    const closeDialogButton = document.querySelector('button#close-project-dialog')
    closeDialogButton.addEventListener('click', () => {
        projectDialog.close()
    })
})();

(function createProject() {
    const submitDialogButton = document.querySelector('button#submit-dialog')
    submitDialogButton.addEventListener('click', () => {
        const projectTitle = document.querySelector('form > input#title').value
        const projectDescription = document.querySelector('form > input#description').value
        const dueDate = document.querySelector('form > input.due-date').value
        const projectPriority = document.querySelector('form > select').value
        
        const newProject = new Project(projectTitle, projectDescription, dueDate, projectPriority)

        listProject(newProject)
    })
})();