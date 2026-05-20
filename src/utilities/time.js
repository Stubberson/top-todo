function createTimePicker(task, button) {
    const currentTime = Temporal.Now.plainTimeISO()
    
    const timePickerContainer = document.createElement('div')
    timePickerContainer.className = 'task-time-picker'

    const hourMinContainer = document.createElement('div')
    hourMinContainer.className = 'hour-minute-container'

    const hourContainer = document.createElement('div')
    hourContainer.className = 'time-picker-hour'
    hourContainer.textContent = '[hh]'

    const minuteContainer = document.createElement('div')
    minuteContainer.className = 'time-picker-minute'
    minuteContainer.textContent = '[mm]'
    
    // Hours
    for (let i = 0; i < 24; i++) {
        const hour = document.createElement('div')
        hour.className = 'hour-select'
        i < 10 ? hour.textContent = `0${i}` : hour.textContent = i
        hour.addEventListener('click', (event) => {
            task.hour = Number.parseInt(event.target.textContent)
            event.target.scrollIntoView({behavior: 'smooth', block: 'start'})
            button.style.setProperty('background-image', 'var(--time-add-fill)')
            if (task.minute) {
                button.textContent = `${task.getHourString()}:${task.getMinuteString()}`
            } else {
                button.textContent = `${task.getHourString()}:00`
            }
        })
        hourContainer.append(hour)
    }

    // Minutes
    for (let i = 0; i < 60; i += 5) {  // 5min step should be precise enough
        const minute = document.createElement('div')
        minute.className = 'minute-select'
        i < 10 ? minute.textContent = `0${i}` : minute.textContent = i
        minute.addEventListener('click', (event) => {
            task.minute = Number.parseInt(event.target.textContent)
            event.target.scrollIntoView({behavior: 'smooth', block: 'start'})
            if (task.hour) {
                button.textContent = `${task.getHourString()}:${task.getMinuteString()}`
            } else {
                button.textContent = `[hh]:${task.getMinuteString()}`
            }
        })
        minuteContainer.append(minute)
    }

    hourMinContainer.append(hourContainer, minuteContainer)
    timePickerContainer.append(hourMinContainer)
    return timePickerContainer
}

export { createTimePicker }