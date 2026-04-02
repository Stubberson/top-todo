import { currentDate, clearContent } from '../utilities/utility.js'
import { editor } from '../utilities/cm.js'

// --- Today's tasks DOM control ---

const todayContainer = document.querySelector('div.content-container')

function viewToday() {
    clearContent(todayContainer)  // Clear the content container

    const todayHeader = document.createElement('h1')
    const todayTaskList = document.createElement('ul')

    todayHeader.textContent = 'Today'

    let todayTaskOne = document.createElement('li')
    todayTaskOne.textContent = "Today's important task one!"
    let todayTaskTwo = document.createElement('li')
    todayTaskTwo.textContent = "Second task for today!"
    todayTaskList.append(todayTaskOne, todayTaskTwo)

    todayContainer.append(todayHeader, todayTaskList, editor.dom)
}


export { viewToday }