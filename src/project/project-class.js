export class Project {
    static memory = []  // Memory for all projects

    constructor() {
        this.id = crypto.randomUUID()
        this.header = undefined
        this.description = undefined
        this.date = undefined
        this.tasks = []

        Project.memory.push(this)
    }
}