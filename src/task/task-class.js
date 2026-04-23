export class Task {
    static memory = []  // Memory for all tasks

    constructor(container, project = undefined) {
        const taskElements = Array.from(container.children)

        this.container = container
        this.completed = taskElements[0]
        this.header = taskElements[1]
        this.opener = taskElements[2]
        this.remove = taskElements[3]
        this.description = taskElements[4]
        
        const taskTags = Array.from(taskElements[5].children)
        this.important = taskTags[0]
        this.date = taskTags[1]

        if (project) {
            this.owningProject = project
            this.owningProject.newTask(this)  // Save tasks associated with unique project to project's memory
        }

        Task.memory.push(this)
    }

    get getImportant() {
        if (this.important.classList.contains('task-important-flag')) {
            return true
        }
    }

    get getToday() {
        if (this.date.year === Temporal.Now.zonedDateTimeISO().year && this.date.dayOfYear === Temporal.Now.zonedDateTimeISO().dayOfYear) {
            return true
        }
    }
}