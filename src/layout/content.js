const container = document.createElement('div.contnet-container')
const viewHeader = document.createElement('h1')
const viewDescription = document.createElement('p')

const projectHeader = document.createElement('h2')
const projectDescription = document.createElement('p')

container.append(viewHeader, viewDescription, projectHeader, projectDescription)

export { container, viewHeader, viewDescription, projectHeader, projectDescription }