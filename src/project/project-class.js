export class Project {
    static memory = []  // Memory for all projects

    constructor() {
        // Content
        this.header = undefined
        this.description = undefined
        this.date = undefined
        this.tasks = []

        Project.memory.push(this)
    }
}