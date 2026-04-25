export class Task {
    static memory = []  // Memory for all tasks

    constructor(project = undefined) {
        // Task properties are defined dynamically by user
        this.completed = false
        this.header = undefined
        this.description = undefined
        this.important = false
        this.date = undefined

        if (project) {
            this.owningProject = project
            this.owningProject.tasks.push(this)
        }

        Task.memory.push(this)
    }

    getImportant() {
        return Task.memory.filter(task => task.important.classList.contains('task-important-flag'))
    }
}