// --- General utility functionalities ---

function clearContent(container) {
    while (container.firstChild) {
        container.firstChild.remove()
    }
}

export { clearContent }