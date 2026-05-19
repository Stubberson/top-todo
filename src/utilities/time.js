function createTimePicker() {
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
        const hour = document.createElement('span')
        i < 10 ? hour.textContent = `0${i}` : hour.textContent = i
        hour.hidden = true
        hourContainer.append(hour)
    }

    // Minutes
    for (let i = 0; i < 60; i++) {
        const minute = document.createElement('span')
        i < 10 ? minute.textContent = `0${i}` : minute.textContent = i
        minute.hidden = true
        minuteContainer.append(minute)
    }

    hourMinContainer.append(hourContainer, minuteContainer)
    timePickerContainer.append(hourMinContainer)
    return timePickerContainer
}

export { createTimePicker }