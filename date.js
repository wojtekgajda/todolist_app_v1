module.exports = getDate;
 function getDate() {
    let today = new Date()
    let dayOption = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    let day = today.toLocaleString('en-US', dayOption)
    return day
}

