export function createSidebarLayout() {
    const sidebarContainer = document.createElement('div')
    sidebarContainer.classList.add('sidebar-container')
    const sidebarHeader = document.createElement('h2')
    sidebarHeader.classList.add('sidebar-header')
    const projectList = document.createElement('ul')
    projectList.classList.add('projects-list')
    const newProjectButton = document.createElement('button')
    newProjectButton.id = 'new-project'

    sidebarContainer.append(sidebarHeader, projectList, newProjectButton)

    return {
        sidebar: sidebarContainer,
        header: sidebarHeader,
        projects: projectList,
        newProjectButton: newProjectButton
    }
}