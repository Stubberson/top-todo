import './style.css'
import { currentDate, listProject } from './features/sidebar-funcs.js'
import { Project } from './tabs/project.js'

(function toggleProjectDialog() {
    const projectDialog = document.querySelector('dialog.project-dialog')
 
    const dueDate = document.querySelector('input#due-date')
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
        let projectTitle = document.querySelector('form > input#title').value
        let projectDescription = document.querySelector('form > input#description').value
        let dueDate = document.querySelector('form > input#due-date').value
        let projectPriority = document.querySelector('form > select').value
        
        const newProject = new Project(projectTitle, projectDescription, dueDate, projectPriority)
        
        listProject(newProject)
    })
})();