import { container as contentContainer, viewHeader, viewDescription, projectHeader, projectDescription } from "../layout/content.js";

viewHeader.innerText = 'Today'
viewDescription.innerText = "Today's tasks"
projectHeader.innerText = 'Project Header'
projectDescription.innerText = "Project's tasks"

contentContainer.append(viewHeader, viewDescription, projectHeader, projectDescription)

export default contentContainer