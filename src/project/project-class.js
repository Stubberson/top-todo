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

    getDateString() {
        // When the date needs to be displayed nicely
        return this.date.toLocaleString('en-de', {day: '2-digit', month: 'short', year: '2-digit'} )
    }
}