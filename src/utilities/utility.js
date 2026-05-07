// --- General utility functionalities ---

import { currentView } from "../index.js"

function clearContent(container) {
    while (container.firstChild) {
        container.firstChild.remove()
    }
};

function isToday(date) {
    return date.dayOfYear === Temporal.Now.zonedDateTimeISO().dayOfYear && date.year === Temporal.Now.zonedDateTimeISO().year ? true : false
};

function trackView(view) {
    if (currentView) currentView.pop()
    currentView.push(view)
    return currentView[0]
};

export { clearContent, isToday, trackView }