function onLoad() {
    loadData();
    blinkBackground();
    setInterval(loadData, 30000);

    if (location.search.indexOf("embed") >= 0) {
        document.getElementById("infoLink").remove();
        document.getElementById("archiveNotice").remove();
    }
};

var timeDisplay;
var timeUnitsDisplay;
var alarmCountDisplay;

var updateInterval;
var alarmNow = false;

var DEBUG = false;

function loadData() {
    console.log("Querying for new alarms...");
    timeDisplay = document.getElementById("timeSinceLast");
    timeUnitsDisplay = document.getElementById("timeSinceLastUnits");
    alarmCountDisplay = document.getElementById("alarmCount");

    fetch("../archive/summary.json")
        .then(response => response.json())
        .then(json => {
            clearInterval(updateInterval);
            if (DEBUG) {
                json = debugAlarm(json);
            }
            updateInterval = setInterval(() => displayData(json), 1000);
        });
}

//
// Uncomment for debugging
//
// DEBUG = true;
// const DEBUG_ALARM_SUMMARY = {
//     lastAlarmTimestamp: new Date((new Date().valueOf()) + 30000),
//     alarmsThisYear: 10
// };

// function debugAlarm(realSummary) {
//     if(DEBUG_ALARM_SUMMARY.lastAlarmTimestamp > (new Date()).valueOf()) {
//         console.log("Date in future");
//         return realSummary;
//     }

//     console.log("Date in past");
//     return DEBUG_ALARM_SUMMARY;
// }

function displayData(alarmSummary) {
    let timestamp = new Date(alarmSummary.lastAlarmTimestamp);
    let count = alarmSummary.alarmsThisYear;

    alarmCountDisplay.textContent = count;

    let timeDifference = new TimeSpan(Date.now(), timestamp);

    if (timeDifference.totalSeconds < 120 && !alarmNow) {
        console.log("Alarm happening now!");
        alarmNow = true;
    } else if (timeDifference.totalSeconds > 120 && alarmNow) {
        console.log("Alarm over");
        alarmNow = false;
    }

    let amount = timeDifference.getLargestUnit();
    timeDisplay.textContent = amount;
    timeUnitsDisplay.textContent = timeDifference.getLargestUnitText(amount === 1);
}

function getTint(MIN_TINT = 150) {
    let time = new Date();
    if (time.getSeconds() % 4 < 3) {
        return MIN_TINT + Math.floor((time.getMilliseconds() / 1000) * (255 - MIN_TINT));
    }
    return 255;
}

function blinkBackground() {
    const background = document.getElementById("background");

    tintInterval = setInterval(() => {
        let tint = alarmNow ? getTint() : 255;
        background.style.backgroundColor = `rgb(255, ${tint}, ${tint})`;
    }, 5);
}