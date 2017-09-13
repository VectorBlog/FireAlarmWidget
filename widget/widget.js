document.body.onload = () => {
    loadData();
};

var timeDisplay;
var timeUnitsDisplay;
var alarmCountDisplay;

function loadData() {
    timeDisplay = document.getElementById("timeSinceLast");
    timeUnitsDisplay = document.getElementById("timeSinceLastUnits");
    alarmCountDisplay = document.getElementById("alarmCount");

    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
            displayData(JSON.parse(request.responseText));
        }
    };
    request.open("GET","../testdata.json"/* Enter API URL Here */,true);
    request.send();
}

function displayData(alarmSummary) {
    let timestamp = new Date(alarmSummary.lastAlarm);
    let count = alarmSummary.alarmCount;

    alarmCountDisplay.textContent = count;

    let timeDifference = new TimeSpan(Date.now(), timestamp);
    timeDisplay.textContent = timeDifference.getLargestUnit();
    timeUnitsDisplay.textContent = timeDifference.getLargestUnitText();
}

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

TimeSpan.prototype.getLargestUnitText = function() {
    if(Math.floor(Math.abs(this.totalDays)) >= 1) return "days";
    else if (Math.floor(Math.abs(this.totalHours)) >= 1) return "hours";
    else if (Math.floor(Math.abs(this.totalMinutes)) >= 1) return "minutes";
    else if (Math.floor(Math.abs(this.totalSeconds)) >= 1) return "seconds";
    return "milliseconds";
}

TimeSpan.prototype.getLargestUnit = function() {
    if(Math.floor(Math.abs(this.totalDays)) >= 1) return Math.floor(this.totalDays);
    else if (Math.floor(Math.abs(this.totalHours)) >= 1) return Math.floor(this.totalHours);
    else if (Math.floor(Math.abs(this.totalMinutes)) >= 1) return Math.floor(this.totalMinutes);
    else if (Math.floor(Math.abs(this.totalSeconds)) >= 1) return Math.floor(this.totalSeconds);
    return Math.floor(this.totalMilliseconds);
}