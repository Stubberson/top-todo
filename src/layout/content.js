export function createContentLayout() {
    const contentContainer = document.createElement('div')
    contentContainer.classList.add('content-container')
    const viewHeader = document.createElement('h1')
    const viewDescription = document.createElement('p')

    const projectHeader = document.createElement('h2')
    const projectDescription = document.createElement('p')

    contentContainer.append(viewHeader, viewDescription, projectHeader, projectDescription)

    return {
        root: contentContainer,
        header: viewHeader,
        description: viewDescription,
        project: projectHeader,
        projectDescription: projectDescription
    }
}