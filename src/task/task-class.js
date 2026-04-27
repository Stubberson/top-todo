export class Task {
    static memory = []  // Memory for all tasks

    constructor(date = '', project = undefined) {
        this.id = crypto.randomUUID()

        this.header = ''
        this.description = ''
        this.completed = false
        this.important = false
        this.date = date

        if (project) {
            this.owningProject = project
            this.owningProject.tasks.push(this)
        }

        Task.memory.push(this)
    }
}