// --- Project DOM control ---

const projectContainer = document.querySelector('div.project-content')

function clearContent() {
    while (projectContainer.firstChild) {
        projectContainer.firstChild.remove()
    }
}

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

    clearContent()  // Clear project content before opening new
    openProject(project)  // Open project after creation
    textContainer.addEventListener('click', () => {
        clearContent()
        openProject(project)  // Allow to open project from sidebar
    })
}

function openProject(project) {
    const projectHeader = document.createElement('h1')
    const projectDescription = document.createElement('p')

    projectHeader.textContent = project.getTitle

    projectDescription.className = 'project-description'
    projectDescription.textContent = project.getDescription

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
    
    projectContainer.append(projectHeader, projectDescription, projectDueDate, projectPriority)
};

export { listProject, openProject }