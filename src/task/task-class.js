export class Task {
    static memory = []  // Memory for all tasks

    constructor(date = '', project = undefined) {
        this.id = crypto.randomUUID()

        this.header = ''
        this.description = ''
        this.completed = false
        this.important = false
        this.date = date
        this.style = {}

        if (project) {
            this.owningProject = project
            this.owningProject.tasks.push(this)
        }

        Task.memory.push(this)
    }

    dateToString() {
        // Return 'DD-MM-YYYY', eases comparison between dates
        return this.date.toString().slice(0, 10)
    }
}