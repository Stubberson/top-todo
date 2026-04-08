import { Project } from "../project/project-class.js";

export class Task {
    constructor(project, taskCompleteCheckbox, taskHeader, taskDescriptionOpener, taskDescription, taskImportantCheckbox) {
        let owningProject = project

        this.container = document.createElement('div')
        this.container.className = 'task-container'

        this.descriptionContainer = document.createElement('div')
        this.descriptionContainer.className = 'task-description-container'
        
        this.completed = taskCompleteCheckbox
        this.header = taskHeader
        this.opener = taskDescriptionOpener
        this.description = taskDescription
        this.important = taskImportantCheckbox

        this.descriptionContainer.append(this.header, this.opener, this.description, this.important)
        this.container.append(this.completed, this.descriptionContainer)

        owningProject.newTask(this.container)  // Save the tasks associated with a project to the project's memory
    }

    get getHeader() {
        return this.header
    }

    get getContainer() {
        return this.container
    }
}