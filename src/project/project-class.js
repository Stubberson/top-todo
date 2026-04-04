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

    set setTitle(newTitle) {
        this.title = newTitle
    }

    get getDescription() {
        return this.description
    }

    set setDescription(newDescription) {
        this.description = newDescription
    }

    get getDate() {
        return this.dueDate
    }

    set setDate(newDate) {
        this.dueDate = newDate
    }

    get getPriority() {
        return this.priority
    }

    set setPriority(newPriority) {
        this.priority = newPriority
    }
}