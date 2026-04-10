import { currentDate, clearContent } from '../utilities/utility.js'
import { Task } from '../task/task-class.js'

// --- Today's tasks DOM control ---

const contentContainer = document.querySelector('div.content-container')

function viewToday() {
    clearContent(contentContainer)  // Clear the content container

    const todayHeader = document.createElement('h1')
    const todayTaskList = document.createElement('ul')

    todayHeader.textContent = 'Today'

    let todayTaskOne = document.createElement('li')
    let todayTaskTwo = document.createElement('li')

    todayTaskOne.textContent = "Today's important task one!"
    todayTaskTwo.textContent = "Second task for today!"
    todayTaskList.append(todayTaskOne, todayTaskTwo)

    contentContainer.append(todayHeader, todayTaskList)
}


export { viewToday }