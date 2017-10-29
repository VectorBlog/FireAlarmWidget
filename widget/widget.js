function onLoad() {
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

    fetch("https://associationfireaccountability.azurewebsites.net/api/frontend/location/1/summary")
    .then(response => response.json())
    .then(json => {
        clearInterval(updateInterval);
        updateInterval = setInterval(() => displayData(json), 1000);
    });
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
