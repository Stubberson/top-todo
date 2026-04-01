// --- Utility for the project content

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

export { openProject }