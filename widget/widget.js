document.body.onload = () => {
    loadData();

    if (location.search.indexOf("embed") >= 0) {
        document.getElementById("infoLink").remove();
    }
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
            setInterval(() => displayData(JSON.parse(request.responseText)), 1000);
        }
    };
    request.open("GET", "../testdata.json"/* Enter API URL Here */, true);
    request.send();
}

function displayData(alarmSummary) {
    let timestamp = new Date(alarmSummary.lastAlarm);
    let count = alarmSummary.alarmCount;

    alarmCountDisplay.textContent = count;

    let timeDifference = new TimeSpan(Date.now(), timestamp);
    let amount = timeDifference.getLargestUnit();
    timeDisplay.textContent = amount;
    timeUnitsDisplay.textContent = timeDifference.getLargestUnitText(amount === 1);
}