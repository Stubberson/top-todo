export class Project {
    constructor(title, description, dueDate, priority) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
    }

    get getTitle() {
        return this.title
    }

    get getDate() {
        return this.dueDate
    }
}