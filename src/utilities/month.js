// Credit (edited to fit the new 'Temporal' API): Liam Cain, creator of Obsidian plugin 'Calendar'
function createMonth(selectedMonth) {
    const month = []
    let week
    const monthStartDate = selectedMonth.subtract({ days: selectedMonth.day - 1 })
    const startOffset = monthStartDate.dayOfWeek - 1  // -1 bc otherwise goes to the prev month
    let date = monthStartDate.subtract({ days: startOffset })
    for (let _day = 0; _day < 42; _day++) {
        if (_day % 7 === 0) {
            week = {
                days: [],
                weekNum: date.weekOfYear,
                monthNum: monthStartDate.month
            }
            month.push(week)
        }
        week.days.push(date)
        date = date.add({ days: 1 })
        
    }
    return month
}

export { createMonth }