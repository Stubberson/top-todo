import './style.css'
import { currentDate } from './features/sidebar-funcs.js'

const projectDialog = document.querySelector('dialog.project-dialog')
const dueDate = document.querySelector('input#due-date')
dueDate.min = currentDate
const newProjectButton = document.querySelector('button#new-project')
newProjectButton.addEventListener('click', () => {
    document.body.appendChild(projectDialog)
    projectDialog.showModal()
})

const closeDialogButton = document.querySelector('button#close-project-dialog')
closeDialogButton.addEventListener('click', () => {
  projectDialog.close()
})