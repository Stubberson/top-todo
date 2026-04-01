// --- Utility for the sidebar ---

const date = new Date()
export let currentDate = date.toJSON().slice(0, 10)  // Set current date as min value for new due date

export function listProject(project) {
    const projectsList = document.querySelector('ul.projects-list')
    
    const listItem = document.createElement('li')
    const textContainer = document.createElement('button')
    const listItemTitle = document.createElement('span')
    const listItemDate = document.createElement('span')
    const removeItemButton = document.createElement('button')
    
    listItemTitle.classList.add('li-title')
    listItemDate.classList.add('li-date')
    removeItemButton.id = 'rm-li-btn'

    listItemTitle.textContent = project.getTitle
    listItemDate.textContent = project.getDate

    textContainer.append(listItemTitle, listItemDate)
    listItem.append(textContainer, removeItemButton)

    projectsList.appendChild(listItem)
}