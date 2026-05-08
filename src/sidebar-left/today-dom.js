import { currentView } from '../index.js'
import { clearContent, isToday, trackView } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'
import { taskElementCreate, taskRemove } from '../task/task-dom.js'
import { displayDate, indicateDate } from '../sidebar-right/calendar-dom.js'

// --- Today's tasks DOM control ---

function viewToday() {
    trackView('today')  // Keep track of the current view

    const contentContainer = document.querySelector('div.content-container')
    clearContent(contentContainer)

    const tasksToday = getTodayTasks()  // All tasks for today

    const todayHeader = document.createElement('h1')
    todayHeader.textContent = 'Today'

    const summaryContainer = document.createElement('div')
    summaryContainer.className = 'today-summary-container'

    const summaryItemsContainer = document.createElement('div')
    summaryItemsContainer.className = 'today-summary-items'

    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'summary-buttons-container'

    const summaryContainerRefresh = document.createElement('button')
    summaryContainerRefresh.id = 'today-summary-refresh'
    summaryContainerRefresh.textContent = 'Refresh'
    summaryContainerRefresh.addEventListener('click', () => {
        clearContent(summaryItemsContainer)
        appendSummaryTasks(getTodayTasks(), summaryItemsContainer)
        document.querySelector('.today-summary-container').append(summaryItemsContainer)
    })

    const todayTasksContainer = document.createElement('div')
    todayTasksContainer.className = 'tasks-container'

    tasksToday.forEach(task => {
        todayTasksContainer.append(taskElementCreate(task))
    })
    appendSummaryTasks(tasksToday, summaryItemsContainer)

    const taskNewButton = document.createElement('button')
    taskNewButton.className = 'task-new-button'
    taskNewButton.addEventListener('click', () => {
        const element = taskElementCreate(new Task(Temporal.Now.zonedDateTimeISO()))
        displayDate(Temporal.Now.zonedDateTimeISO())
        indicateDate(Temporal.Now.zonedDateTimeISO())
        todayTasksContainer.append(element)
        element.children[1].focus()  // Focus header
    })

    if (tasksToday.length > 0) {
        buttonContainer.append(summaryContainerRefresh)
        summaryContainer.prepend(buttonContainer, summaryItemsContainer)
    }
    contentContainer.append(todayHeader, summaryContainer, taskNewButton, todayTasksContainer)
};

function appendSummaryTasks(tasksToday, itemsContainer) {
     // Add today's tasks to the summary ('refresh' it)
    tasksToday.forEach(task => {
        let summaryItem = createSummaryItem(task)
        itemsContainer.append(summaryItem)
    })
};

// TODO: SUMMARY SHOULD SORT THE TASKS BASED ON GIVEN TIME (> todo: create time picker)
function createSummaryItem(task) {
    const summaryItemContainer = document.createElement('div')
    summaryItemContainer.className = 'today-summary-item'
    
    const headerStyle = task.style['header-decoration']
    const element = taskElementCreate(task)
    const span = document.createElement('span')
    span.textContent = element.children[1].value
    span.style['text-decoration'] = headerStyle
    
    summaryItemContainer.append(span)
    return summaryItemContainer
};

function getTodayTasks() {
    return Task.memory.filter(task => isToday(task.date))
};

export { viewToday }