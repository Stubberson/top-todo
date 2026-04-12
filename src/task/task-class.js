export class Task {
    static memory = []  // Memory for all tasks

    constructor(project, taskCompleteCheckbox, taskHeader, taskDescriptionOpener, taskRemoveButton, taskDescription, taskImportantCheckbox) {
        this.owningProject = project

        // Envelop each task into a div element
        this.container = document.createElement('div')
        this.container.className = 'task-container'
        
        this.completed = taskCompleteCheckbox
        this.header = taskHeader
        this.opener = taskDescriptionOpener
        this.remove = taskRemoveButton
        this.description = taskDescription
        this.important = taskImportantCheckbox

        this.container.append(this.completed, this.header, this.opener, this.remove, this.description, this.important)

        this.owningProject.newTask(this)  // Save tasks associated with unique project to project's memory

        Task.memory.push(this)
    }

    get getImportant() {
        if (this.important.classList.contains('task-important-tag')) {
            return true
        }        
    }
}