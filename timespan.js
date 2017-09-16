function TimeSpan(recentTime, pastTime) {
    let diff = recentTime - pastTime;

    this.totalMilliseconds = diff;
    this.milliseconds = this.totalMilliseconds % 1000;
    this.totalSeconds = diff / 1000;
    this.seconds = Math.floor(this.totalSeconds) % 60;
    this.totalMinutes = this.totalSeconds / 60;
    this.minutes = Math.floor(this.totalMinutes) % 60;
    this.totalHours = this.totalMinutes / 60;
    this.hours = Math.floor(this.totalHours) % 24;
    this.totalDays = this.totalHours / 24;
    this.days = Math.floor(this.totalDays);
}

TimeSpan.prototype.getLargestUnitText = function (singular) {
    if (Math.floor(Math.abs(this.totalDays)) >= 1) return singular ? "day" : "days";
    else if (Math.floor(Math.abs(this.totalHours)) >= 1) return singular ? "hour" : "hours";
    else if (Math.floor(Math.abs(this.totalMinutes)) >= 1) return singular ? "minute" : "minutes";
    else if (Math.floor(Math.abs(this.totalSeconds)) >= 1) return singular ? "second" : "seconds";
    return singular ? "millisecond" : "milliseconds";
}

TimeSpan.prototype.getLargestUnit = function () {
    if (Math.floor(Math.abs(this.totalDays)) >= 1) return Math.floor(this.totalDays);
    else if (Math.floor(Math.abs(this.totalHours)) >= 1) return Math.floor(this.totalHours);
    else if (Math.floor(Math.abs(this.totalMinutes)) >= 1) return Math.floor(this.totalMinutes);
    else if (Math.floor(Math.abs(this.totalSeconds)) >= 1) return Math.floor(this.totalSeconds);
    return Math.floor(this.totalMilliseconds);
}

TimeSpan.prototype.toString = function () {
    return `${this.days > 0 ? `${pad(this.days)}.` : ""}${pad(this.hours)}:${pad(this.minutes)}:${pad(this.seconds)}:${this.milliseconds > 0 ? `.${pad(this.milliseconds,8)}` : ""}`;
}

TimeSpan.prototype.toLongString = function() {
    let string = "";
    if(this.days > 0) string += `${this.days} day${this.days === 1 ? '' : 's'} `;
    if(this.hours > 0) string += `${this.hours} hour${this.hours === 1 ? '' : 's'} ` ;
    if(this.minutes > 0) string += `${this.minutes} minute${this.minutes === 1 ? '' : 's'} `;
    if(this.seconds > 0) string += `${this.seconds} second${this.seconds === 1 ? '' : 's'} `;
    return string.trim();
}

function pad(n, width, z) {
    z = z || '0';
    width = width || 2;
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}