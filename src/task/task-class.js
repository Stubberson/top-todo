export class Task {
    static memory = []  // Memory for all tasks

    constructor(date = '', project = undefined) {
        this.id = crypto.randomUUID()

        this.header = ''
        this.description = ''
        this.completed = false
        this.important = false
        this.hour = undefined
        this.minute = 0  // Default to even hours
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

    getHourString() {
        if (this.hour < 10) {
            return `0${this.hour}`
        } else {
            return this.hour
        }
    }

    getMinuteString() {
        if (this.minute < 10) {
            return `0${this.minute}`
        } else {
            return this.minute
        }
    }
}