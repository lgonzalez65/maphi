function getFecha(d) {
    var fecha = new Date(Date.parse(d));
    let day = ('0' + fecha.getDate()).slice(-2);
    let month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    let year = fecha.getFullYear();
    let hours = ('0' + fecha.getHours()).slice(-2);
    let minutes = ('0' + fecha.getMinutes()).slice(-2);
    let seconds = ('0' + fecha.getSeconds()).slice(-2);
    return (day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds);
}

// converts date format from JSON
function getChartDate(d) {
    // user's timezone offset
    var myOffset = new Date().getTimezoneOffset();

    // get the data using javascript's date object (year, month, day, hour, minute, second)
    // months in javascript start at 0, so remember to subtract 1 when specifying the month
    // offset in minutes is converted to milliseconds and subtracted so that chart's x-axis is correct
    return Date.UTC(d.substring(0, 4), d.substring(5, 7) - 1, d.substring(8, 10), d.substring(11, 13), d.substring(14, 16), d.substring(17, 19)) - (myOffset * 60000);
}

