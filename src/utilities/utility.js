// --- General utility functionalities ---

const date = new Date()
let currentDate = date.toJSON().slice(0, 10)  // Set current date as min value for new due date

function clearContent(container) {
    while (container.firstChild) {
        container.firstChild.remove()
    }
}

export { currentDate, clearContent }