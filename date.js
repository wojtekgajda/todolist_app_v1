exports.getDate  = function () {
    const today = new Date()
    const dayOption = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    return today.toLocaleString('en-US', dayOption)
}
exports.getDay = function(){
    const today = new Date()
    const dayOption = {
        weekday: 'long',
    }
    return today.toLocaleString('en-US', dayOption)
}

