export class Project {
    static memory = []  // Memory for all projects

    constructor(header, description, date) {
        // Content
        this.header = header
        this.description = description
        this.dueDate = date
        this.tasks = []

        // Containers for DOM
        this.infoContainer = undefined
        this.tabsContainer = undefined
        this.controlsContainer = undefined

        // Sidebar and utility
        this.projectButton = null
        this.viewStatus = undefined  // viewStatus remembers the view a user left the project at
        Project.memory.push(this)
    }

    newTask(task) {
        this.tasks.push(task)
    }
}