export class Task {
    static memory = []  // Memory for all tasks

    constructor(project, container) {
        this.owningProject = project

        const taskElements = Array.from(container.children)

        this.container = container
        this.completed = taskElements[0]
        this.header = taskElements[1]
        this.opener = taskElements[2]
        this.remove = taskElements[3]
        this.description = taskElements[4]
        this.important = taskElements[5]

        this.owningProject.newTask(this)  // Save tasks associated with unique project to project's memory

        Task.memory.push(this)
    }

    get getImportant() {
        if (this.important.classList.contains('task-important-tag')) {
            return true
        }        
    }
}