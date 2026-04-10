export class Task {
    static memory = []  // Memory for all tasks

    constructor(project, taskCompleteCheckbox, taskHeader, taskDescriptionOpener, taskDescription, taskImportantCheckbox) {
        this.owningProject = project

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

        this.owningProject.newTask(this)  // Save tasks associated with unique project to project's memory

        Task.memory.push(this)
    }

    get getImportant() {
        if (this.important.className.includes('task-important')) {
            return true
        }        
    }
}