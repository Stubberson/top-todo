import { currentView } from '../index.js'
import { clearContent, isToday, trackView } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { taskElementCreate, taskRemove } from '../task/task-dom.js'
import { displayDate, indicateDate } from '../sidebar-right/calendar-dom.js'

// --- Today's tasks DOM control ---

function viewToday() {
    trackView('today')  // Keep track of the current view

    const contentContainer = document.querySelector('div.content-container')
    clearContent(contentContainer)     // Refresh content container

    const tasksToday = getTodayTasks()  // All tasks for today

    const todayHeader = document.createElement('h1')
    todayHeader.textContent = 'Today'

    const summaryContainer = document.createElement('div')
    summaryContainer.className = 'today-summary-container'

    const todayTasksContainer = document.createElement('div')
    todayTasksContainer.className = 'tasks-container'

    // Add today's tasks to the summary and as editable tasks
    tasksToday.forEach(task => {
        let todayTask = taskElementCreate(task)
        
        let summaryItem = createSummaryItem(todayTask)
        summaryContainer.append(summaryItem)
        todayTasksContainer.append(todayTask)
    })

    const taskNewButton = document.createElement('button')
    taskNewButton.className = 'task-new-button'
    taskNewButton.addEventListener('click', () => {
        const element = taskElementCreate(new Task(Temporal.Now.zonedDateTimeISO()))
        displayDate(Temporal.Now.zonedDateTimeISO())
        indicateDate(Temporal.Now.zonedDateTimeISO())
        todayTasksContainer.append(element)
        element.children[1].focus()  // Focus header
    })

    contentContainer.append(todayHeader, summaryContainer, taskNewButton, todayTasksContainer)
};

function createSummaryItem(task) {
    const summaryItemContainer = document.createElement('div')
    summaryItemContainer.className = 'today-summary-item'

    summaryItemContainer.append(task.children[1].value)
    return summaryItemContainer
};

function getTodayTasks() {
    return Task.memory.filter(task => isToday(task.date))
};

export { viewToday }