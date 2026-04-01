// --- Utility for the sidebar ---

const date = new Date()
export let currentDate = date.toJSON().slice(0, 10)  // Set current date as min value for new due date

export function listProject(project) {
    const projectsList = document.querySelector('ul.projects-list')
    const listItem = document.createElement('li')
    const listItemTitle = document.createElement('span')
    const listItemDate = document.createElement('span')
    
    listItemTitle.textContent = project.getTitle
    listItemDate.textContent = project.getDate
    listItem.append(listItemTitle, listItemDate)

    projectsList.appendChild(listItem)
}