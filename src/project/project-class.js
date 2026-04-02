export class Project {
    static memory = []

    constructor(title, description, dueDate, priority) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        Project.memory.push(this)
    }

    get getTitle() {
        return this.title
    }

    get getDescription() {
        return this.description
    }

    get getDate() {
        return this.dueDate
    }

    get getPriority() {
        return this.priority
    }
}