// --- General utility functionalities ---

function clearContent(container) {
    while (container.firstChild) {
        container.firstChild.remove()
    }
}

function isToday(date) {
    return date.dayOfYear === Temporal.Now.zonedDateTimeISO().dayOfYear && date.year === Temporal.Now.zonedDateTimeISO().year ? true : false
}

export { clearContent, isToday }