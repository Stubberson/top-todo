export class Project {
    static memory = []  // Memory for all projects

    constructor(header, description, dueDate) {
        this.header = header
        this.description = description
        this.dueDate = dueDate
        this.projectButton = null
        this.tasks = []
        this.viewStatus = undefined  // viewStatus remembers the view a user left the project at
        Project.memory.push(this)
    }

    newTask(task) {
        this.tasks.push(task)
    }
}