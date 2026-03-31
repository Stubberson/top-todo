import { createSidebarLayout } from '../layout/sidebar.js'
import { createContentLayout } from '../layout/content.js'
// Define the content on the Today/Home view

const sidebarContainerToday = createSidebarLayout()
const contentContainerToday = createContentLayout()

sidebarContainerToday.header.innerText = 'Projects'
sidebarContainerToday.newProjectButton.innerText = 'New Project'

contentContainerToday.header.innerText = 'Today'
contentContainerToday.description.innerText = "Today's tasks"
contentContainerToday.project.innerText = 'Project Header'
contentContainerToday.projectDescription.innerText = "Project's tasks"

export { contentContainerToday, sidebarContainerToday }