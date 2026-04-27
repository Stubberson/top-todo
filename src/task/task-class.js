export class Task {
    static memory = []  // Memory for all tasks

    constructor(date = '', project = undefined) {
        this.id = crypto.randomUUID()

        this.header = ''
        this.description = ''
        this.date = date
        this.completed = false
        this.important = false

        if (project) {
            this.owningProject = project
            this.owningProject.tasks.push(this)
        }

        Task.memory.push(this)
    }

    #getHTML() {
        return Array.from(document.querySelectorAll(`[data-id='${this.id}']`))
    }

    // Sync all HTML elements linked to a task
    syncLinked(property) {
        const taskHTML = this.#getHTML()
        switch(property) {
            case 'header':
                taskHTML.forEach(copy => copy.children[1].value = this.header)
                break
            case 'description':
                taskHTML.forEach(copy => copy.children[4].value = this.description)
                break
            case 'date':
                // TODO: SET UP DATE DEFINITION
                // taskHTML.forEach(copy => copy.children[4] = this.description)
                // break
        }
    }

    removeElement() {
        // Remove task HTML
        const taskHTML = this.#getHTML()
        taskHTML.forEach(copy => copy.remove())

        // Remove task from mem
        Task.memory.splice(Task.memory.indexOf(this), 1)

        // Remove task from project mem
        if (this.owningProject) {
            this.owningProject.tasks.splice(this.owningProject.tasks.indexOf(this), 1)
        }
    }
}