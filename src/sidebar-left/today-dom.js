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
        element.children[1].lastChild.focus()  // Focus header
    })

    if (tasksToday.length > 0) {
        buttonContainer.append(summaryContainerRefresh)
        summaryContainer.prepend(buttonContainer, summaryItemsContainer)
    }
    contentContainer.append(todayHeader, summaryContainer, taskNewButton, todayTasksContainer)
};

function appendSummaryTasks(tasksToday, itemsContainer) {
    // Add today's tasks to the summary ('refresh' it)
    let prevTime = 0
    tasksToday.forEach(task => {
        const summaryItem = createSummaryItem(task)
        if (task.hour || task.hour === 0) {
            const timeString = task.getHourString() + task.getMinuteString()
            const time = Number.parseInt(timeString)
            console.log(time)
            if (time > prevTime) {
                itemsContainer.append(summaryItem)        
            } else {
                itemsContainer.prepend(summaryItem)
            }
            prevTime = time
        } else {
            itemsContainer.append(summaryItem)
        }
    })
};

// TODO: SUMMARY SHOULD SORT THE TASKS BASED ON TIME
function createSummaryItem(task) {
    const summaryItemContainer = document.createElement('div')
    summaryItemContainer.className = 'today-summary-item'
    
    const headerStyle = task.style['header-decoration']
    const element = taskElementCreate(task)
    const span = document.createElement('span')
    if (task.hour || task.hour === 0) {
        span.textContent = task.getHourString() + ':' + task.getMinuteString() + ' '
        span.textContent += task.header
    } else {
        span.textContent = task.header
    }
    span.style['text-decoration'] = headerStyle
    
    summaryItemContainer.append(span)
    return summaryItemContainer
};

function getTodayTasks() {
    return Task.memory.filter(task => isToday(task.date))
};

export { viewToday }