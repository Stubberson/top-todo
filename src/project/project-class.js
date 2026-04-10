export class Project {
    static memory = []  // Memory for all projects

    constructor(header, description, dueDate, priority) {
        this.header = header
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.projectButton = null
        this.tasks = []
        this.viewStatus = undefined  // viewStatus remembers the view a user left the project at
        Project.memory.push(this)
    }

    newTask(task) {
        this.tasks.push(task)
    }
}