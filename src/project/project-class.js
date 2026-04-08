import { Task } from '../task/task-class.js'

export class Project {
    static memory = []

    constructor(header, description, dueDate, priority) {
        this.header = header
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.tasks = []
        Project.memory.push(this)
    }

    get getHeader() {
        return this.header
    }

    set setHeader(newHeader) {
        this.header = newHeader
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

    newTask(task) {
        this.tasks.push(task)
    }

    get getTasks() {
        return this.tasks
    }
}