document.body.onload = () => {
    loadData();
    setInterval(loadData, 300000);

    if (location.search.indexOf("embed") >= 0) {
        document.getElementById("infoLink").remove();
    }
};

var timeDisplay;
var timeUnitsDisplay;
var alarmCountDisplay;

var updateInterval;

function loadData() {
    timeDisplay = document.getElementById("timeSinceLast");
    timeUnitsDisplay = document.getElementById("timeSinceLastUnits");
    alarmCountDisplay = document.getElementById("alarmCount");

    let request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
            clearInterval(updateInterval);
            updateInterval = setInterval(() => displayData(JSON.parse(request.responseText)), 1000);
        }
    };
    request.open("GET", "http://associationfireaccountability.azurewebsites.net/api/frontend/location/1/summary", true);
    request.send();
}

function displayData(alarmSummary) {
    let timestamp = new Date(alarmSummary.lastAlarmTimestamp);
    let count = alarmSummary.alarmsThisYear;

    alarmCountDisplay.textContent = count;

    let timeDifference = new TimeSpan(Date.now(), timestamp);
    let amount = timeDifference.getLargestUnit();
    timeDisplay.textContent = amount;
    timeUnitsDisplay.textContent = timeDifference.getLargestUnitText(amount === 1);
}
