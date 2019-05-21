function isWeekend(dateIn) {
    const day = dateIn.getDay();
    if (day === 0 || day === 6) return true;
    return false;
}

function isHoliday(dateIn) {
    const [ month, date, day, week, year ] = [
        dateIn.getMonth(),
        dateIn.getDate(),
        dateIn.getDay(),
        Math.floor((dateIn.getDate() - 1) / 7),
        dateIn.getYear(),
    ]
    
    console.log(`Month: ${month}; Date: ${date}; Day: ${day}; Week: ${week}; Year: ${year}`);

    if (day === 1) {
        if (week === 0) {
            if (month === 8) return true;
        } else if (week === 1) {
            if (month === 9) return true;
        } else if (week === 2) {
            if (month === 0) return true;
            if (month === 1) return true;
        } else if (week === 3) {
            if (month === 4 && date > 24) return true;
        } else if (week === 4) {
            if (month === 4) return true;
        }
    }

    if (day === 4 && month === 10 && week === 3) return true;

    const newYrDay = new Date(`January 1, ${year}`).getDay();
    const newYrDayNextYr = new Date(`January 1, ${year + 1}`).getDay();
    if (
        (month === 0  && date === 1) ||
        (month === 0  && date === 2  && newYrDay === 0) ||
        (month === 11 && date === 31 && newYrDayNextYr === 6)
    ) return true;

    const inaugDay = new Date(`January 20, ${year}`).getDay();
    if (
        (month === 0 && date === 20 && year % 4 === 0) ||
        (month === 0 && date === 19 && year % 4 === 0 && inaugDay === 6) ||
        (month === 0 && date === 21 && year % 4 === 0 && inaugDay === 0)
    ) return true;

    const indDay = new Date(`July 4, ${year}`).getDay();
    if (
        (month === 6 && date === 4) ||
        (month === 6 && date === 3 && indDay === 6) ||
        (month === 6 && date === 5 && indDay === 0)
    ) return true;

    const vetDay = new Date(`November 11, ${year}`).getDay();
    if (
        (month === 10 && date === 11) ||
        (month === 10 && date === 10 && vetDay === 6) ||
        (month === 10 && date === 12 && vetDay === 0)
    ) return true;

    const chrisDay = new Date(`December 25, ${year}`).getDay();
    if (
        (month === 11 && date === 25) ||
        (month === 11 && date === 24 && chrisDay === 6) ||
        (month === 11 && date === 26 && chrisDay === 0)
    ) return true;

    return false;
}

module.exports.isWeekend = isWeekend;
module.exports.isHoliday = isHoliday;
