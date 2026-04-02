// --- Utility for the project ---

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

    textContainer.addEventListener('click', () => {
        openProject(project)
    })
};



function openProject(project) {
    const projectContainer = document.querySelector('div.project-content')
    let projectHeader = document.querySelector('div.project-content > h1')
    let projectDescription = document.querySelector('p.project-description')

    projectHeader.textContent = project.getTitle
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
    projectDueDate.classList.add('due-date')
    projectDueDate.name = 'project-due-date'

    projectPriority.classList.add('priority-selection')
    projectPriority.name = 'project-priority'

    projectDueDate.value = project.getDate
    projectPriority.value = project.getPriority
    
    projectContainer.append(projectDueDate, projectPriority)
};

export { listProject, openProject }